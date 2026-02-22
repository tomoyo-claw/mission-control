"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { BarChart3, CheckCircle2, Clock, Loader2, TrendingUp, Zap, User, Bot } from "lucide-react";

function StatCard({ label, value, sub, color = "text-white" }: {
  label: string; value: string | number; sub?: string; color?: string;
}) {
  return (
    <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-5">
      <div className="text-xs text-gray-500 mb-1">{label}</div>
      <div className={`text-3xl font-bold ${color}`}>{value}</div>
      {sub && <div className="text-xs text-gray-600 mt-1">{sub}</div>}
    </div>
  );
}

function ProgressBar({ value, max, color = "bg-blue-500" }: { value: number; max: number; color?: string }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs text-gray-400 w-8 text-right">{value}</span>
    </div>
  );
}

export default function StatsPage() {
  const tasks = useQuery(api.tasks.list) ?? [];

  if (tasks === undefined) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
      </div>
    );
  }

  const total = tasks.length;
  const done = tasks.filter((t) => t.status === "done").length;
  const inprogress = tasks.filter((t) => t.status === "inprogress").length;
  const todo = tasks.filter((t) => t.status === "todo").length;
  const completionRate = total > 0 ? Math.round((done / total) * 100) : 0;

  const aiTotal = tasks.filter((t) => t.assignee === "ai").length;
  const aiDone = tasks.filter((t) => t.assignee === "ai" && t.status === "done").length;
  const zakTotal = tasks.filter((t) => t.assignee === "zak").length;
  const zakDone = tasks.filter((t) => t.assignee === "zak" && t.status === "done").length;

  // プロジェクト別
  const projects = ["Steam Hub", "Mission Control", "X", "Setup"].map((p) => {
    const tag = `[${p}]`;
    const ptasks = tasks.filter((t) => t.title.includes(tag));
    return {
      name: p,
      total: ptasks.length,
      done: ptasks.filter((t) => t.status === "done").length,
      inprogress: ptasks.filter((t) => t.status === "inprogress").length,
    };
  });

  // 優先度別
  const priorities = [
    { label: "High", key: "high" as const, color: "text-red-400", bar: "bg-red-500" },
    { label: "Medium", key: "medium" as const, color: "text-yellow-400", bar: "bg-yellow-500" },
    { label: "Low", key: "low" as const, color: "text-green-400", bar: "bg-green-500" },
  ].map((p) => ({
    ...p,
    total: tasks.filter((t) => t.priority === p.key).length,
    done: tasks.filter((t) => t.priority === p.key && t.status === "done").length,
  }));

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <BarChart3 className="w-6 h-6 text-blue-400" />
        <h1 className="text-2xl font-bold text-white">タスク統計</h1>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="完了タスク" value={done} sub={`全 ${total} 件`} color="text-green-400" />
        <StatCard label="達成率" value={`${completionRate}%`} sub={`${done}/${total}`} color="text-blue-400" />
        <StatCard label="進行中" value={inprogress} color="text-yellow-400" />
        <StatCard label="未着手" value={todo} color="text-gray-400" />
      </div>

      {/* 全体プログレス */}
      <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-sm font-medium text-white">
            <TrendingUp className="w-4 h-4 text-blue-400" />
            全体進捗
          </div>
          <span className="text-2xl font-bold text-blue-400">{completionRate}%</span>
        </div>
        <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full transition-all"
            style={{ width: `${completionRate}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1.5">
          <span>✅ 完了 {done}</span>
          <span>⏳ 進行中 {inprogress}</span>
          <span>📋 未着手 {todo}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* 担当者別 */}
        <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4 text-sm font-medium text-white">
            <User className="w-4 h-4 text-purple-400" />
            担当者別
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <Bot className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-gray-300">AI (Tomoyo)</span>
                <span className="ml-auto text-xs text-green-400">{aiDone}/{aiTotal} 完了</span>
              </div>
              <ProgressBar value={aiDone} max={aiTotal} color="bg-blue-500" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <User className="w-4 h-4 text-purple-400" />
                <span className="text-sm text-gray-300">Zak</span>
                <span className="ml-auto text-xs text-green-400">{zakDone}/{zakTotal} 完了</span>
              </div>
              <ProgressBar value={zakDone} max={zakTotal} color="bg-purple-500" />
            </div>
          </div>
        </div>

        {/* 優先度別 */}
        <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4 text-sm font-medium text-white">
            <Zap className="w-4 h-4 text-yellow-400" />
            優先度別
          </div>
          <div className="space-y-4">
            {priorities.map((p) => (
              <div key={p.key}>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className={`text-xs font-semibold ${p.color}`}>{p.label}</span>
                  <span className="ml-auto text-xs text-green-400">{p.done}/{p.total} 完了</span>
                </div>
                <ProgressBar value={p.done} max={p.total} color={p.bar} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* プロジェクト別 */}
      <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4 text-sm font-medium text-white">
          <CheckCircle2 className="w-4 h-4 text-green-400" />
          プロジェクト別
        </div>
        <div className="space-y-4">
          {projects.filter((p) => p.total > 0).map((p) => (
            <div key={p.name}>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-sm text-gray-300">{p.name}</span>
                {p.inprogress > 0 && (
                  <span className="text-[10px] text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded-full">
                    進行中 {p.inprogress}
                  </span>
                )}
                <span className="ml-auto text-xs text-gray-500">
                  {p.total > 0 ? Math.round((p.done / p.total) * 100) : 0}%
                </span>
                <span className="text-xs text-green-400">{p.done}/{p.total}</span>
              </div>
              <ProgressBar
                value={p.done}
                max={p.total}
                color={
                  p.name === "Steam Hub" ? "bg-blue-500" :
                  p.name === "Mission Control" ? "bg-purple-500" :
                  p.name === "X" ? "bg-sky-500" : "bg-gray-500"
                }
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
