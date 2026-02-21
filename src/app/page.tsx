"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  ArrowRight,
  CheckSquare,
  Calendar,
  Brain,
  Users,
  Workflow,
  Monitor,
  Activity,
  Bot,
  User,
  Clock,
  Zap,
  CheckCircle2,
  Loader2,
  TrendingUp,
  BarChart3,
  Crown,
} from "lucide-react";
import { useMockData } from "@/lib/mock-data";

const navItems = [
  {
    name: "タスクボード",
    href: "/tasks",
    icon: CheckSquare,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    desc: "Todo / In Progress / Done",
  },
  {
    name: "カレンダー",
    href: "/calendar",
    icon: Calendar,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    desc: "タスク・Cron・リマインダー",
  },
  {
    name: "メモリ",
    href: "/memory",
    icon: Brain,
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
    desc: "ナレッジベース・検索",
  },
  {
    name: "チーム",
    href: "/team",
    icon: Users,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    desc: "エージェント組織図",
  },
  {
    name: "コンテンツ",
    href: "/content",
    icon: Workflow,
    color: "text-pink-400",
    bg: "bg-pink-500/10",
    border: "border-pink-500/20",
    desc: "Ideas → Published パイプライン",
  },
  {
    name: "オフィス",
    href: "/office",
    icon: Monitor,
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
    desc: "デジタルオフィス空間",
  },
];

export default function Home() {
  const { tasks, content, notes, events } = useMockData();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Stats
  const todoTasks = tasks.filter((t) => t.status === "todo").length;
  const inProgressTasks = tasks.filter((t) => t.status === "inprogress").length;
  const doneTasks = tasks.filter((t) => t.status === "done").length;
  const aiTasks = tasks.filter((t) => t.assignee === "ai" && t.status !== "done").length;
  const zakTasks = tasks.filter((t) => t.assignee === "zak" && t.status !== "done").length;
  const publishedContent = content.filter((c) => c.stage === "published").length;
  const inPipelineContent = content.filter((c) => c.stage !== "published" && c.stage !== "ideas").length;
  const upcomingEvents = events.filter((e) => e.startDate > Date.now()).length;
  const runningEvents = events.filter((e) => e.status === "running").length;

  return (
    <div className="p-4 md:p-6 min-h-screen">
      {/* Hero */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-1">
              <span className="bg-gradient-to-r from-violet-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Mission Control
              </span>
            </h1>
            <p className="text-gray-500 text-sm">
              AIエージェントのためのデジタルワークスペース
            </p>
          </div>
          <div className="text-right">
            <div className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2">
              <div className="text-[10px] text-gray-500">
                {time.toLocaleDateString("ja-JP", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  weekday: "short",
                })}
              </div>
              <div className="font-mono text-sm text-emerald-400">
                {time.toLocaleTimeString("ja-JP")}
              </div>
            </div>
          </div>
        </div>

        {/* Status banner */}
        <div className="bg-gradient-to-r from-violet-500/10 via-blue-500/10 to-cyan-500/10 border border-gray-800 rounded-xl p-4 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm text-gray-300">システム稼働中</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Crown className="w-3 h-3 text-violet-400" />
              智代 オンライン
            </span>
            <span className="flex items-center gap-1">
              <Bot className="w-3 h-3" />
              {aiTasks} AIタスク
            </span>
            <span className="flex items-center gap-1">
              <User className="w-3 h-3" />
              {zakTasks} Zakタスク
            </span>
            {runningEvents > 0 && (
              <span className="flex items-center gap-1 text-blue-400">
                <Loader2 className="w-3 h-3 animate-spin" style={{ animationDuration: "3s" }} />
                {runningEvents} 実行中
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <SummaryCard
          icon={<CheckSquare className="w-4 h-4" />}
          label="タスク"
          value={`${doneTasks}/${tasks.length}`}
          sub="完了"
          color="text-blue-400"
          trend={doneTasks > 0 ? `${Math.round((doneTasks / tasks.length) * 100)}%` : "0%"}
        />
        <SummaryCard
          icon={<Workflow className="w-4 h-4" />}
          label="コンテンツ"
          value={String(publishedContent)}
          sub={`公開 / ${content.length}件`}
          color="text-pink-400"
          trend={inPipelineContent > 0 ? `${inPipelineContent}件制作中` : undefined}
        />
        <SummaryCard
          icon={<Brain className="w-4 h-4" />}
          label="メモリ"
          value={String(notes.length)}
          sub="ドキュメント"
          color="text-violet-400"
        />
        <SummaryCard
          icon={<Calendar className="w-4 h-4" />}
          label="予定"
          value={String(upcomingEvents)}
          sub="今後のイベント"
          color="text-emerald-400"
        />
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left: Activity feed + Tasks */}
        <div className="lg:col-span-2 space-y-5">
          {/* Active tasks */}
          <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-gray-300 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-blue-400" />
                アクティブタスク
              </h2>
              <Link href="/tasks" className="text-xs text-gray-500 hover:text-blue-400 flex items-center gap-1">
                すべて表示 <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="space-y-2">
              {tasks
                .filter((t) => t.status !== "done")
                .slice(0, 4)
                .map((task) => (
                  <div
                    key={task._id}
                    className="flex items-center gap-3 p-2.5 bg-gray-800/50 rounded-lg border border-gray-800"
                  >
                    {task.status === "inprogress" ? (
                      <Loader2
                        className="w-4 h-4 text-blue-400 flex-shrink-0 animate-spin"
                        style={{ animationDuration: "3s" }}
                      />
                    ) : (
                      <Circle className="w-4 h-4 text-gray-600 flex-shrink-0" />
                    )}
                    <span className="text-sm text-gray-200 flex-1 truncate">
                      {task.title}
                    </span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full flex items-center gap-1 ${
                        task.assignee === "ai"
                          ? "bg-violet-500/15 text-violet-400"
                          : "bg-cyan-500/15 text-cyan-400"
                      }`}
                    >
                      {task.assignee === "ai" ? (
                        <Bot className="w-3 h-3" />
                      ) : (
                        <User className="w-3 h-3" />
                      )}
                      {task.assignee === "ai" ? "AI" : "Zak"}
                    </span>
                  </div>
                ))}
              {tasks.filter((t) => t.status !== "done").length === 0 && (
                <p className="text-xs text-gray-600 text-center py-4">
                  全タスク完了 🎉
                </p>
              )}
            </div>
          </div>

          {/* Content pipeline summary */}
          <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-gray-300 flex items-center gap-1.5">
                <Workflow className="w-4 h-4 text-pink-400" />
                コンテンツパイプライン
              </h2>
              <Link href="/content" className="text-xs text-gray-500 hover:text-pink-400 flex items-center gap-1">
                管理画面 <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="flex gap-2">
              {(
                [
                  ["Ideas", "ideas", "bg-violet-500"],
                  ["Script", "script", "bg-amber-500"],
                  ["Thumb", "thumbnail", "bg-pink-500"],
                  ["Film", "filming", "bg-cyan-500"],
                  ["Edit", "editing", "bg-orange-500"],
                  ["Pub", "published", "bg-green-500"],
                ] as const
              ).map(([label, stage, color]) => {
                const count = content.filter((c) => c.stage === stage).length;
                return (
                  <div key={stage} className="flex-1 text-center">
                    <div
                      className={`text-lg font-bold ${
                        count > 0 ? "text-white" : "text-gray-700"
                      }`}
                    >
                      {count}
                    </div>
                    <div className={`h-1 rounded-full mt-1 ${count > 0 ? color : "bg-gray-800"}`} />
                    <div className="text-[9px] text-gray-600 mt-1">{label}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Navigation grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`group ${item.bg} border ${item.border} rounded-xl p-4 hover:bg-opacity-20 transition-all`}
              >
                <item.icon className={`w-6 h-6 ${item.color} mb-2`} />
                <h3 className="text-sm font-semibold text-white mb-0.5">
                  {item.name}
                </h3>
                <p className="text-[11px] text-gray-500">{item.desc}</p>
                <div className="flex items-center text-[10px] text-gray-600 mt-2 group-hover:text-gray-400 transition-colors">
                  開く <ArrowRight className="w-3 h-3 ml-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-4">
          {/* Agent status */}
          <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-4">
            <h2 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-1.5">
              <Bot className="w-4 h-4 text-violet-400" />
              エージェント状態
            </h2>
            <div className="space-y-2.5">
              {[
                { name: "智代", role: "Commander", status: "online" as const, emoji: "🌸", main: true },
                { name: "Dev", role: "Developer", status: "idle" as const, emoji: "⚡", main: false },
                { name: "Writer", role: "Writer", status: "idle" as const, emoji: "✍️", main: false },
                { name: "Researcher", role: "Researcher", status: "idle" as const, emoji: "🔍", main: false },
                { name: "Designer", role: "Designer", status: "offline" as const, emoji: "🎨", main: false },
                { name: "Guardian", role: "Security", status: "offline" as const, emoji: "🛡️", main: false },
              ].map((agent) => (
                <div key={agent.name} className="flex items-center gap-2.5">
                  <span className="text-sm">{agent.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-medium text-white">{agent.name}</span>
                      {agent.main && (
                        <span className="text-[8px] px-1 py-0.5 bg-violet-500/20 text-violet-300 rounded">
                          MAIN
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-gray-600">{agent.role}</span>
                  </div>
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${
                      agent.status === "online"
                        ? "bg-green-500"
                        : agent.status === "idle"
                        ? "bg-amber-500"
                        : "bg-gray-700"
                    }`}
                  />
                </div>
              ))}
            </div>
            <Link
              href="/team"
              className="block text-center text-xs text-gray-600 hover:text-violet-400 mt-3 pt-2 border-t border-gray-800"
            >
              チーム詳細 →
            </Link>
          </div>

          {/* Recent memories */}
          <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-4">
            <h2 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-1.5">
              <Brain className="w-4 h-4 text-violet-400" />
              最新メモリ
            </h2>
            <div className="space-y-2">
              {notes.slice(0, 3).map((note) => (
                <div key={note._id} className="p-2 bg-gray-800/40 rounded-lg">
                  <p className="text-xs font-medium text-gray-300 line-clamp-1">
                    {note.title}
                  </p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3 text-gray-600" />
                    <span className="text-[10px] text-gray-600">
                      {new Date(note.updatedAt).toLocaleDateString("ja-JP", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <Link
              href="/memory"
              className="block text-center text-xs text-gray-600 hover:text-violet-400 mt-3 pt-2 border-t border-gray-800"
            >
              メモリ一覧 →
            </Link>
          </div>

          {/* Upcoming events */}
          <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-4">
            <h2 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-emerald-400" />
              今後の予定
            </h2>
            <div className="space-y-2">
              {events
                .filter((e) => e.startDate > Date.now())
                .sort((a, b) => a.startDate - b.startDate)
                .slice(0, 3)
                .map((ev) => (
                  <div key={ev._id} className="flex items-start gap-2">
                    <div
                      className="w-1 h-full min-h-[24px] rounded-full flex-shrink-0 mt-0.5"
                      style={{ backgroundColor: ev.color }}
                    />
                    <div>
                      <p className="text-xs text-gray-300 line-clamp-1">{ev.title}</p>
                      <span className="text-[10px] text-gray-600">
                        {new Date(ev.startDate).toLocaleDateString("ja-JP", {
                          month: "short",
                          day: "numeric",
                        })}{" "}
                        {new Date(ev.startDate).toLocaleTimeString("ja-JP", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
            <Link
              href="/calendar"
              className="block text-center text-xs text-gray-600 hover:text-emerald-400 mt-3 pt-2 border-t border-gray-800"
            >
              カレンダー →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Summary Card ─────────────────────────────────── */
function SummaryCard({
  icon,
  label,
  value,
  sub,
  color,
  trend,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  color: string;
  trend?: string;
}) {
  return (
    <div className="bg-gray-800/80 border border-gray-700 rounded-xl px-4 py-3">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1.5 text-gray-400 text-xs">
          {icon} {label}
        </div>
        {trend && (
          <span className="text-[10px] text-emerald-500 flex items-center gap-0.5">
            <TrendingUp className="w-3 h-3" />
            {trend}
          </span>
        )}
      </div>
      <div className={`text-xl font-bold ${color}`}>{value}</div>
      <div className="text-[10px] text-gray-600">{sub}</div>
    </div>
  );
}

/* ── Circle (for todo items) ──────────────────────── */
function Circle({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
    </svg>
  );
}
