"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Crown,
  Code,
  Pen,
  Palette,
  Search,
  Shield,
  BarChart3,
  User,
  Clock,
  Activity,
  Monitor,
  Coffee,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { useMockData } from "@/lib/mock-data";

/* ── Agent desks ──────────────────────────────────── */
interface DeskAgent {
  id: string;
  name: string;
  nameJa: string;
  emoji: string;
  role: string;
  icon: typeof Crown;
  color: string;
  screenColor: string;
  status: "working" | "thinking" | "idle" | "away" | "offline";
  currentTask?: string;
  type: "human" | "main" | "sub";
}

const baseAgents: Omit<DeskAgent, "status" | "currentTask">[] = [
  {
    id: "zak",
    name: "Zak",
    nameJa: "ザック",
    emoji: "👨‍💻",
    role: "Owner",
    icon: User,
    color: "#06B6D4",
    screenColor: "#0891B2",
    type: "human",
  },
  {
    id: "tomoyo",
    name: "Tomoyo",
    nameJa: "智代",
    emoji: "🌸",
    role: "Commander",
    icon: Crown,
    color: "#8B5CF6",
    screenColor: "#7C3AED",
    type: "main",
  },
  {
    id: "dev",
    name: "Dev",
    nameJa: "開発者",
    emoji: "⚡",
    role: "Developer",
    icon: Code,
    color: "#3B82F6",
    screenColor: "#2563EB",
    type: "sub",
  },
  {
    id: "writer",
    name: "Writer",
    nameJa: "ライター",
    emoji: "✍️",
    role: "Writer",
    icon: Pen,
    color: "#10B981",
    screenColor: "#059669",
    type: "sub",
  },
  {
    id: "designer",
    name: "Designer",
    nameJa: "デザイナー",
    emoji: "🎨",
    role: "Designer",
    icon: Palette,
    color: "#EC4899",
    screenColor: "#DB2777",
    type: "sub",
  },
  {
    id: "researcher",
    name: "Researcher",
    nameJa: "リサーチャー",
    emoji: "🔍",
    role: "Researcher",
    icon: Search,
    color: "#F59E0B",
    screenColor: "#D97706",
    type: "sub",
  },
  {
    id: "guardian",
    name: "Guardian",
    nameJa: "ガーディアン",
    emoji: "🛡️",
    role: "Security",
    icon: Shield,
    color: "#EF4444",
    screenColor: "#DC2626",
    type: "sub",
  },
  {
    id: "analyst",
    name: "Analyst",
    nameJa: "アナリスト",
    emoji: "📊",
    role: "Analyst",
    icon: BarChart3,
    color: "#06B6D4",
    screenColor: "#0891B2",
    type: "sub",
  },
];

const statusLabels: Record<DeskAgent["status"], { label: string; color: string; dot: string }> = {
  working: { label: "作業中", color: "text-green-400", dot: "bg-green-500" },
  thinking: { label: "思考中", color: "text-blue-400", dot: "bg-blue-500" },
  idle: { label: "待機中", color: "text-amber-400", dot: "bg-amber-500" },
  away: { label: "離席", color: "text-gray-400", dot: "bg-gray-500" },
  offline: { label: "オフライン", color: "text-gray-600", dot: "bg-gray-700" },
};

/* ── Main ─────────────────────────────────────────── */
export default function OfficePage() {
  const [selected, setSelected] = useState<DeskAgent | null>(null);
  const [time, setTime] = useState(new Date());
  const [activities, setActivities] = useState<Record<string, string>>({});

  // Live task data from Convex
  const { tasks } = useMockData();

  // Derive agent statuses from real task data
  const deskAgents = useMemo((): DeskAgent[] => {
    const zakInProgress = tasks.filter(
      (t) => t.assignee === "zak" && t.status === "inprogress"
    );
    const zakTodo = tasks.filter(
      (t) => t.assignee === "zak" && t.status === "todo"
    );
    const aiInProgress = tasks.filter(
      (t) => t.assignee === "ai" && t.status === "inprogress"
    );
    const aiTodo = tasks.filter(
      (t) => t.assignee === "ai" && t.status === "todo"
    );

    return baseAgents.map((base) => {
      if (base.id === "zak") {
        return {
          ...base,
          status: zakInProgress.length > 0 ? "working" : zakTodo.length > 0 ? "idle" : "away",
          currentTask: zakInProgress[0]?.title ?? (zakTodo.length > 0 ? `次: ${zakTodo[0].title}` : undefined),
        } as DeskAgent;
      }
      if (base.id === "tomoyo") {
        return {
          ...base,
          status: aiInProgress.length > 0 ? "working" : aiTodo.length > 0 ? "idle" : "away",
          currentTask: aiInProgress[0]?.title ?? (aiTodo.length > 0 ? `次: ${aiTodo[0].title}` : undefined),
        } as DeskAgent;
      }
      // Sub-agents: fixed statuses
      const subDefaults: Record<string, DeskAgent["status"]> = {
        dev: "idle",
        writer: "idle",
        designer: "offline",
        researcher: "idle",
        guardian: "offline",
        analyst: "offline",
      };
      return { ...base, status: subDefaults[base.id] ?? "idle" } as DeskAgent;
    });
  }, [tasks]);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Simulate activity changes for working agents
  useEffect(() => {
    const interval = setInterval(() => {
      const newActs: Record<string, string> = {};
      deskAgents.forEach((a) => {
        if (a.status === "working") {
          const acts = ["typing", "typing", "typing", "reading", "thinking"];
          newActs[a.id] = acts[Math.floor(Math.random() * acts.length)];
        }
      });
      setActivities(newActs);
    }, 2500);
    return () => clearInterval(interval);
  }, [deskAgents]);

  const workingCount = deskAgents.filter((a) => a.status === "working").length;
  const idleCount = deskAgents.filter((a) => a.status === "idle").length;

  return (
    <div className="p-4 md:p-6 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-1 flex items-center gap-2">
            <Monitor className="w-7 h-7 text-emerald-400" />
            デジタルオフィス
          </h1>
          <p className="text-gray-400 text-sm">
            各エージェントの作業状況をリアルタイムで確認
          </p>
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 flex items-center gap-2">
          <Clock className="w-4 h-4 text-emerald-400" />
          <span className="font-mono text-sm text-emerald-400">
            {time.toLocaleTimeString("ja-JP")}
          </span>
        </div>
      </div>

      {/* Quick status bar */}
      <div className="flex gap-3 mb-5 flex-wrap">
        <span className="text-xs bg-green-500/15 text-green-400 px-2.5 py-1 rounded-full flex items-center gap-1">
          <Activity className="w-3 h-3" /> 作業中 {workingCount}
        </span>
        <span className="text-xs bg-amber-500/15 text-amber-400 px-2.5 py-1 rounded-full flex items-center gap-1">
          <Coffee className="w-3 h-3" /> 待機中 {idleCount}
        </span>
        <span className="text-xs bg-gray-500/15 text-gray-400 px-2.5 py-1 rounded-full">
          オフライン {deskAgents.filter((a) => a.status === "offline").length}
        </span>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-5">
        {/* Office floor */}
        <div className="xl:col-span-3">
          <div className="bg-gray-950 border border-gray-800 rounded-xl p-6 relative overflow-hidden">
            {/* Pixel floor pattern */}
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage:
                  "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            />

            {/* Room label */}
            <div className="absolute top-3 left-4 text-[10px] text-gray-700 font-mono tracking-wider">
              MISSION CONTROL — MAIN FLOOR
            </div>

            {/* Desks grid — 2 rows of 4 */}
            <div className="relative grid grid-cols-2 md:grid-cols-4 gap-5 pt-6">
              {deskAgents.map((agent) => (
                <DeskUnit
                  key={agent.id}
                  agent={agent}
                  activity={activities[agent.id]}
                  selected={selected?.id === agent.id}
                  onClick={() =>
                    setSelected(selected?.id === agent.id ? null : agent)
                  }
                />
              ))}
            </div>

            {/* Decorations */}
            <div className="flex items-center justify-center gap-8 mt-8 pt-4 border-t border-gray-900">
              <span className="text-[10px] text-gray-800 flex items-center gap-1">
                ☕ Coffee Area
              </span>
              <span className="text-[10px] text-gray-800">|</span>
              <span className="text-[10px] text-gray-800 flex items-center gap-1">
                🪴 Lounge
              </span>
              <span className="text-[10px] text-gray-800">|</span>
              <span className="text-[10px] text-gray-800 flex items-center gap-1">
                📋 Meeting Room
              </span>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Selected detail */}
          {selected ? (
            <div
              className="bg-gray-900/60 border rounded-xl p-4"
              style={{ borderColor: selected.color + "40" }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                  style={{ backgroundColor: selected.color + "20" }}
                >
                  {selected.emoji}
                </div>
                <div>
                  <h3 className="font-bold text-white">{selected.name}</h3>
                  <p className="text-xs" style={{ color: selected.color }}>
                    {selected.role} — {selected.nameJa}
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">ステータス</span>
                  <span className={statusLabels[selected.status].color}>
                    {statusLabels[selected.status].label}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">タイプ</span>
                  <span className="text-gray-300">
                    {selected.type === "human"
                      ? "Human"
                      : selected.type === "main"
                      ? "Main Agent"
                      : "Sub Agent"}
                  </span>
                </div>
                {selected.currentTask && (
                  <div className="pt-2 border-t border-gray-800">
                    <span className="text-xs text-gray-500 block mb-1">
                      現在のタスク
                    </span>
                    <p className="text-xs text-blue-400">
                      {selected.currentTask}
                    </p>
                  </div>
                )}
                {activities[selected.id] && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">アクティビティ</span>
                    <span className="text-emerald-400 text-xs">
                      {activities[selected.id]}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-4 text-center">
              <Monitor className="w-8 h-8 text-gray-700 mx-auto mb-2" />
              <p className="text-xs text-gray-600">
                デスクをクリックして詳細表示
              </p>
            </div>
          )}

          {/* All agents status list */}
          <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-gray-300 mb-3">
              全メンバーステータス
            </h3>
            <div className="space-y-2">
              {deskAgents.map((agent) => {
                const stat = statusLabels[agent.status];
                return (
                  <div
                    key={agent.id}
                    onClick={() =>
                      setSelected(selected?.id === agent.id ? null : agent)
                    }
                    className={`flex items-center gap-2.5 p-2 rounded-lg cursor-pointer transition-all ${
                      selected?.id === agent.id
                        ? "bg-gray-800"
                        : "hover:bg-gray-800/60"
                    }`}
                  >
                    <span className="text-lg">{agent.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-medium text-white">
                          {agent.name}
                        </span>
                        {agent.type === "main" && (
                          <span className="text-[9px] px-1 py-0.5 bg-violet-500/20 text-violet-300 rounded">
                            MAIN
                          </span>
                        )}
                        {agent.type === "human" && (
                          <span className="text-[9px] px-1 py-0.5 bg-cyan-500/20 text-cyan-300 rounded">
                            HUMAN
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-gray-600">
                        {agent.role}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${stat.dot}`}
                      />
                      <span className={`text-[10px] ${stat.color}`}>
                        {stat.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Desk Unit Component ──────────────────────────── */
function DeskUnit({
  agent,
  activity,
  selected,
  onClick,
}: {
  agent: DeskAgent;
  activity?: string;
  selected: boolean;
  onClick: () => void;
}) {
  const isActive = agent.status === "working" || agent.status === "thinking";
  const stat = statusLabels[agent.status];

  return (
    <div
      onClick={onClick}
      className={`relative rounded-xl p-3 cursor-pointer transition-all group ${
        selected
          ? "bg-gray-800 ring-1"
          : "bg-gray-900/80 hover:bg-gray-800/80"
      }`}
      style={{
        outline: selected ? `1px solid ${agent.color}` : undefined,
        boxShadow: selected ? `0 0 20px ${agent.color}15` : undefined,
      }}
    >
      {/* Desk surface */}
      <div className="bg-amber-900/30 border border-amber-800/30 rounded-lg p-3 mb-2 relative">
        {/* Monitor */}
        <div className="mx-auto w-full max-w-[100px]">
          {/* Screen */}
          <div
            className={`h-14 rounded-t-md border-2 relative overflow-hidden ${
              isActive
                ? "border-gray-600"
                : "border-gray-800"
            }`}
            style={{
              backgroundColor: isActive ? agent.screenColor + "30" : "#111",
            }}
          >
            {isActive && (
              <>
                {/* Code lines animation */}
                <div className="absolute inset-0 p-1.5 space-y-1">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="h-1 rounded-full animate-pulse"
                      style={{
                        backgroundColor: agent.screenColor + "60",
                        width: `${40 + Math.random() * 50}%`,
                        animationDelay: `${i * 0.3}s`,
                        animationDuration: "2s",
                      }}
                    />
                  ))}
                </div>
                {/* Screen glow */}
                <div
                  className="absolute -inset-1 rounded-md blur-md opacity-20"
                  style={{ backgroundColor: agent.screenColor }}
                />
              </>
            )}
            {agent.status === "offline" && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-700" />
              </div>
            )}
          </div>
          {/* Monitor stand */}
          <div className="mx-auto w-4 h-2 bg-gray-700 rounded-b" />
          <div className="mx-auto w-8 h-1 bg-gray-700 rounded-b" />
        </div>

        {/* Keyboard */}
        {isActive && (
          <div className="mx-auto mt-1 w-12 h-2 bg-gray-700 rounded-sm relative">
            {activity === "typing" && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex gap-0.5">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-1 h-1 rounded-full animate-bounce"
                    style={{
                      backgroundColor: agent.color,
                      animationDelay: `${i * 0.15}s`,
                      animationDuration: "0.6s",
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Agent avatar */}
      <div className="flex flex-col items-center">
        {/* Chair + avatar area */}
        <div className="relative">
          {/* Avatar */}
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center text-lg border-2 transition-all ${
              isActive
                ? "border-opacity-60"
                : agent.status === "idle"
                ? "border-opacity-30"
                : "border-opacity-10 grayscale opacity-50"
            }`}
            style={{
              borderColor: agent.color,
              backgroundColor: agent.color + "15",
            }}
          >
            {agent.emoji}
          </div>
          {/* Status dot */}
          <div
            className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-gray-900 ${stat.dot}`}
          />

          {/* Thinking bubble */}
          {activity === "thinking" && (
            <div className="absolute -top-5 -right-2 flex gap-0.5 items-end">
              <div className="w-1 h-1 rounded-full bg-blue-400 opacity-60 animate-pulse" />
              <div
                className="w-1.5 h-1.5 rounded-full bg-blue-400 opacity-80 animate-pulse"
                style={{ animationDelay: "0.2s" }}
              />
              <div
                className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"
                style={{ animationDelay: "0.4s" }}
              />
            </div>
          )}
        </div>

        {/* Name */}
        <div className="mt-1.5 text-center">
          <p className="text-[11px] font-medium text-white leading-tight">
            {agent.name}
          </p>
          <p className="text-[9px] text-gray-600">{agent.role}</p>
        </div>

        {/* Current task (if working) */}
        {agent.currentTask && isActive && (
          <div className="mt-1 flex items-center gap-0.5 text-[9px] text-emerald-500 max-w-full">
            <Loader2
              className="w-2.5 h-2.5 animate-spin flex-shrink-0"
              style={{ animationDuration: "3s" }}
            />
            <span className="truncate">{agent.currentTask}</span>
          </div>
        )}
      </div>
    </div>
  );
}
