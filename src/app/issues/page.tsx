"use client";

import { useState, useEffect } from "react";
import { ExternalLink, GitBranch, Circle, CheckCircle2, Loader2, RefreshCw, Tag } from "lucide-react";

interface Issue {
  id: number;
  number: number;
  title: string;
  state: "open" | "closed";
  html_url: string;
  created_at: string;
  updated_at: string;
  labels: { name: string; color: string }[];
  user: { login: string; avatar_url: string };
  body: string | null;
  repo: string;
}

function repoShort(repo: string) {
  return repo.split("/")[1];
}

function repoColor(repo: string) {
  return repo.includes("mission-control")
    ? "bg-blue-500/15 text-blue-400 border-blue-500/30"
    : "bg-purple-500/15 text-purple-400 border-purple-500/30";
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "今日";
  if (days === 1) return "昨日";
  if (days < 7) return `${days}日前`;
  return new Date(iso).toLocaleDateString("ja-JP", { month: "short", day: "numeric" });
}

export default function IssuesPage() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "mission-control" | "steam-game-hub">("all");
  const [refreshing, setRefreshing] = useState(false);

  const load = async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const res = await fetch("/api/github/issues");
      const data = await res.json();
      setIssues(data.issues || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = filter === "all"
    ? issues
    : issues.filter((i) => i.repo.includes(filter));

  const mcCount = issues.filter((i) => i.repo.includes("mission-control")).length;
  const sgCount = issues.filter((i) => i.repo.includes("steam-game-hub")).length;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <GitBranch className="w-6 h-6 text-gray-400" />
            <h1 className="text-2xl font-bold text-white">GitHub Issues</h1>
          </div>
          <p className="text-sm text-gray-500">tomoyo-claw オープンイシュー</p>
        </div>
        <button
          onClick={() => load(true)}
          disabled={refreshing}
          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-700 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
          更新
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        {([
          ["all", `すべて (${issues.length})`, "text-white"],
          ["mission-control", `mission-control (${mcCount})`, "text-blue-400"],
          ["steam-game-hub", `steam-game-hub (${sgCount})`, "text-purple-400"],
        ] as const).map(([val, label, color]) => (
          <button
            key={val}
            onClick={() => setFilter(val)}
            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
              filter === val
                ? `bg-gray-700 border-gray-500 ${color}`
                : "bg-gray-800/50 border-gray-700 text-gray-400 hover:text-white"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-green-500/50" />
          <p>オープンイシューはありません 🎉</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((issue) => (
            <div
              key={issue.id}
              className="bg-gray-800/60 border border-gray-700 rounded-xl p-4 hover:border-gray-600 transition-colors"
            >
              <div className="flex items-start gap-3">
                <Circle className="w-4 h-4 mt-1 text-green-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <a
                      href={issue.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-white hover:text-blue-400 transition-colors flex items-center gap-1.5 group"
                    >
                      {issue.title}
                      <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 flex-shrink-0" />
                    </a>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    {/* Repo badge */}
                    <span className={`px-2 py-0.5 rounded-full border text-[10px] font-medium ${repoColor(issue.repo)}`}>
                      {repoShort(issue.repo)}
                    </span>

                    {/* Issue number */}
                    <span className="text-gray-600">#{issue.number}</span>

                    {/* Labels */}
                    {issue.labels.map((label) => (
                      <span
                        key={label.name}
                        className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px]"
                        style={{
                          backgroundColor: `#${label.color}22`,
                          color: `#${label.color}`,
                          border: `1px solid #${label.color}44`,
                        }}
                      >
                        <Tag className="w-2.5 h-2.5" />
                        {label.name}
                      </span>
                    ))}

                    {/* Author + date */}
                    <span className="text-gray-600 ml-auto">
                      <img
                        src={issue.user.avatar_url}
                        alt={issue.user.login}
                        className="w-4 h-4 rounded-full inline mr-1"
                      />
                      {issue.user.login} · {timeAgo(issue.updated_at)}
                    </span>
                  </div>

                  {/* Body preview */}
                  {issue.body && (
                    <p className="mt-2 text-xs text-gray-500 line-clamp-2">{issue.body.slice(0, 200)}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
