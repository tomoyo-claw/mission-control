"use client";

import { useState } from "react";
import {
  Bot,
  User,
  Crown,
  Code,
  Pen,
  Palette,
  Search,
  Shield,
  BarChart3,
  Zap,
  Clock,
  CheckCircle2,
  Circle,
  Loader2,
  ChevronRight,
  Users,
  Activity,
  Cpu,
} from "lucide-react";

/* ── Agent type ───────────────────────────────────── */
interface Agent {
  id: string;
  name: string;
  nameJa: string;
  role: string;
  roleJa: string;
  icon: typeof Bot;
  color: string;
  bg: string;
  border: string;
  status: "online" | "idle" | "scheduled" | "offline";
  type: "main" | "sub";
  description: string;
  skills: string[];
  currentTask?: string;
  lastActive: number;
  tasksCompleted: number;
  uptime?: string;
}

const agents: Agent[] = [
  {
    id: "tomoyo",
    name: "Tomoyo",
    nameJa: "智代",
    role: "Main Agent — Commander",
    roleJa: "メインエージェント — 統括",
    icon: Crown,
    color: "text-violet-400",
    bg: "bg-violet-500/15",
    border: "border-violet-500/40",
    status: "online",
    type: "main",
    description:
      "坂上智代。全体の統括と意思決定を担当。Zakとの直接対話、タスク管理、メモリ管理、サブエージェントの起動と監視を行う。",
    skills: ["タスク管理", "意思決定", "メモリ管理", "対話", "コード", "リサーチ"],
    currentTask: "Mission Control UI改善",
    lastActive: Date.now(),
    tasksCompleted: 12,
    uptime: "稼働中",
  },
  {
    id: "dev",
    name: "Dev",
    nameJa: "開発者",
    role: "Sub-Agent — Developer",
    roleJa: "サブエージェント — 開発",
    icon: Code,
    color: "text-blue-400",
    bg: "bg-blue-500/15",
    border: "border-blue-500/40",
    status: "scheduled",
    type: "sub",
    description:
      "コーディング、デバッグ、アーキテクチャ設計を担当。複雑な実装タスクやコードレビューを独立セッションで実行。",
    skills: ["TypeScript", "React", "Next.js", "Solidity", "Node.js", "テスト"],
    lastActive: Date.now() - 30 * 60 * 1000,
    tasksCompleted: 5,
  },
  {
    id: "writer",
    name: "Writer",
    nameJa: "ライター",
    role: "Sub-Agent — Content Writer",
    roleJa: "サブエージェント — コンテンツ作成",
    icon: Pen,
    color: "text-emerald-400",
    bg: "bg-emerald-500/15",
    border: "border-emerald-500/40",
    status: "scheduled",
    type: "sub",
    description:
      "ブログ記事、ツイート、スクリプト、ドキュメントの執筆を担当。SEO最適化やトーン調整も行う。",
    skills: ["ブログ執筆", "ツイート", "スクリプト", "SEO", "翻訳", "校正"],
    lastActive: Date.now() - 2 * 60 * 60 * 1000,
    tasksCompleted: 3,
  },
  {
    id: "designer",
    name: "Designer",
    nameJa: "デザイナー",
    role: "Sub-Agent — UI/UX Designer",
    roleJa: "サブエージェント — デザイン",
    icon: Palette,
    color: "text-pink-400",
    bg: "bg-pink-500/15",
    border: "border-pink-500/40",
    status: "offline",
    type: "sub",
    description:
      "UIデザイン、サムネイル生成、カラーパレット設計を担当。ピクセルアートやビジュアルアセットの作成も行う。",
    skills: ["UI設計", "サムネイル", "カラー設計", "ピクセルアート", "レイアウト"],
    lastActive: Date.now() - 6 * 60 * 60 * 1000,
    tasksCompleted: 2,
  },
  {
    id: "researcher",
    name: "Researcher",
    nameJa: "リサーチャー",
    role: "Sub-Agent — Research & Analysis",
    roleJa: "サブエージェント — リサーチ",
    icon: Search,
    color: "text-amber-400",
    bg: "bg-amber-500/15",
    border: "border-amber-500/40",
    status: "scheduled",
    type: "sub",
    description:
      "Web検索、X(Twitter)リサーチ、市場分析、技術調査を担当。DeFi/AI/Web3領域の情報収集と要約。",
    skills: ["Web検索", "X分析", "市場調査", "DeFi", "AI動向", "レポート"],
    lastActive: Date.now() - 1 * 60 * 60 * 1000,
    tasksCompleted: 4,
  },
  {
    id: "security",
    name: "Guardian",
    nameJa: "ガーディアン",
    role: "Sub-Agent — Security & Monitoring",
    roleJa: "サブエージェント — セキュリティ",
    icon: Shield,
    color: "text-red-400",
    bg: "bg-red-500/15",
    border: "border-red-500/40",
    status: "scheduled",
    type: "sub",
    description:
      "セキュリティ監視、コード脆弱性チェック、プライバシー保護を担当。外部送信の検証やデータ保護ポリシーの遵守。",
    skills: ["脆弱性チェック", "プライバシー", "監視", "監査", "アラート"],
    lastActive: Date.now() - 4 * 60 * 60 * 1000,
    tasksCompleted: 1,
  },
  {
    id: "analyst",
    name: "Analyst",
    nameJa: "アナリスト",
    role: "Sub-Agent — Data Analyst",
    roleJa: "サブエージェント — データ分析",
    icon: BarChart3,
    color: "text-cyan-400",
    bg: "bg-cyan-500/15",
    border: "border-cyan-500/40",
    status: "offline",
    type: "sub",
    description:
      "オンチェーンデータ分析、パフォーマンス測定、レポート生成を担当。Allium APIやDune等を活用。",
    skills: ["オンチェーン分析", "レポート", "Allium API", "統計", "可視化"],
    lastActive: Date.now() - 12 * 60 * 60 * 1000,
    tasksCompleted: 0,
  },
];

const statusConfig = {
  online: { label: "オンライン", color: "bg-green-500", text: "text-green-400" },
  idle: { label: "アイドル", color: "bg-yellow-500", text: "text-yellow-400" },
  scheduled: { label: "待機中", color: "bg-blue-500", text: "text-blue-400" },
  offline: { label: "オフライン", color: "bg-gray-600", text: "text-gray-500" },
};

/* ── Main ─────────────────────────────────────────── */
export default function TeamPage() {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

  const mainAgent = agents.find((a) => a.type === "main")!;
  const subAgents = agents.filter((a) => a.type === "sub");
  const onlineCount = agents.filter((a) => a.status === "online").length;
  const activeCount = agents.filter((a) => a.status !== "offline").length;
  const totalCompleted = agents.reduce((s, a) => s + a.tasksCompleted, 0);

  return (
    <div className="p-4 md:p-6 min-h-screen">
      {/* Header */}
      <div className="mb-5">
        <h1 className="text-2xl md:text-3xl font-bold mb-1 flex items-center gap-2">
          <Users className="w-7 h-7 text-violet-400" />
          チーム構造
        </h1>
        <p className="text-gray-400 text-sm">
          メインエージェントとサブエージェントの組織図
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <Stat icon={<Users className="w-4 h-4" />} label="総エージェント" value={agents.length} color="text-white" />
        <Stat icon={<Activity className="w-4 h-4" />} label="アクティブ" value={activeCount} color="text-green-400" />
        <Stat icon={<Cpu className="w-4 h-4" />} label="オンライン" value={onlineCount} color="text-blue-400" />
        <Stat icon={<CheckCircle2 className="w-4 h-4" />} label="完了タスク" value={totalCompleted} color="text-emerald-400" />
      </div>

      {/* Org chart style layout */}
      <div className="space-y-6">
        {/* Human + Main Agent */}
        <div className="flex flex-col items-center gap-4">
          {/* Zak */}
          <div className="bg-gray-900/60 border border-cyan-500/40 rounded-xl p-4 w-full max-w-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center">
                <User className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <h3 className="font-bold text-white">Zak</h3>
                <p className="text-xs text-cyan-400">Human — オーナー</p>
              </div>
              <div className="ml-auto flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-[10px] text-green-400">オンライン</span>
              </div>
            </div>
          </div>

          {/* Connector */}
          <div className="w-px h-6 bg-gray-700" />

          {/* Main agent */}
          <AgentCard
            agent={mainAgent}
            isMain
            onClick={() => setSelectedAgent(mainAgent)}
            selected={selectedAgent?.id === mainAgent.id}
          />

          {/* Connector */}
          <div className="w-px h-6 bg-gray-700" />
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Zap className="w-3 h-3" />
            サブエージェント ({subAgents.length})
          </div>
        </div>

        {/* Sub agents grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subAgents.map((agent) => (
            <AgentCard
              key={agent.id}
              agent={agent}
              onClick={() => setSelectedAgent(agent)}
              selected={selectedAgent?.id === agent.id}
            />
          ))}
        </div>
      </div>

      {/* Detail panel */}
      {selectedAgent && (
        <AgentDetail
          agent={selectedAgent}
          onClose={() => setSelectedAgent(null)}
        />
      )}
    </div>
  );
}

/* ── Stat ─────────────────────────────────────────── */
function Stat({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="bg-gray-800/80 border border-gray-700 rounded-lg px-4 py-3">
      <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
        {icon} {label}
      </div>
      <div className={`text-xl font-bold ${color}`}>{value}</div>
    </div>
  );
}

/* ── Agent Card ───────────────────────────────────── */
function AgentCard({
  agent,
  isMain,
  onClick,
  selected,
}: {
  agent: Agent;
  isMain?: boolean;
  onClick: () => void;
  selected: boolean;
}) {
  const Icon = agent.icon;
  const stat = statusConfig[agent.status];

  const fmtActive = (ts: number) => {
    const diff = Date.now() - ts;
    if (diff < 60000) return "今";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}分前`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}時間前`;
    return `${Math.floor(diff / 86400000)}日前`;
  };

  return (
    <div
      onClick={onClick}
      className={`rounded-xl border p-4 cursor-pointer transition-all group ${
        selected
          ? `${agent.border} ${agent.bg}`
          : `border-gray-800 hover:${agent.border} bg-gray-900/60 hover:bg-gray-800/60`
      } ${isMain ? "w-full max-w-sm mx-auto" : ""}`}
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className={`w-11 h-11 rounded-xl ${agent.bg} flex items-center justify-center flex-shrink-0`}>
          <Icon className={`w-5 h-5 ${agent.color}`} />
        </div>

        <div className="flex-1 min-w-0">
          {/* Name + status */}
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="text-sm font-bold text-white">
              {agent.name}
              <span className="text-gray-500 font-normal ml-1 text-xs">
                {agent.nameJa}
              </span>
            </h3>
            {isMain && (
              <span className="text-[10px] px-1.5 py-0.5 bg-violet-500/20 text-violet-300 rounded">
                MAIN
              </span>
            )}
          </div>
          <p className="text-[11px] text-gray-500 mb-2">{agent.roleJa}</p>

          {/* Current task */}
          {agent.currentTask && (
            <div className="flex items-center gap-1 text-[11px] text-blue-400 mb-2">
              <Loader2 className="w-3 h-3 animate-spin" style={{ animationDuration: "3s" }} />
              {agent.currentTask}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center gap-3 text-[10px]">
            <span className="flex items-center gap-1">
              <div className={`w-1.5 h-1.5 rounded-full ${stat.color}`} />
              <span className={stat.text}>{stat.label}</span>
            </span>
            <span className="text-gray-600 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {fmtActive(agent.lastActive)}
            </span>
            <span className="text-gray-600 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              {agent.tasksCompleted}
            </span>
          </div>
        </div>

        <ChevronRight className={`w-4 h-4 flex-shrink-0 mt-1 transition-colors ${selected ? agent.color : "text-gray-700 group-hover:text-gray-500"}`} />
      </div>
    </div>
  );
}

/* ── Agent Detail ─────────────────────────────────── */
function AgentDetail({ agent, onClose }: { agent: Agent; onClose: () => void }) {
  const Icon = agent.icon;
  const stat = statusConfig[agent.status];

  return (
    <div className="mt-6 bg-gray-900/60 border border-gray-800 rounded-xl overflow-hidden">
      {/* Header */}
      <div className={`px-5 py-4 ${agent.bg} border-b border-gray-800 flex items-center justify-between`}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl bg-gray-900/50 flex items-center justify-center`}>
            <Icon className={`w-5 h-5 ${agent.color}`} />
          </div>
          <div>
            <h2 className="font-bold text-white">
              {agent.name} <span className="text-gray-400 font-normal">{agent.nameJa}</span>
            </h2>
            <p className="text-xs text-gray-400">{agent.role}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`flex items-center gap-1.5 text-xs ${stat.text}`}>
            <div className={`w-2 h-2 rounded-full ${stat.color}`} />
            {stat.label}
          </span>
          <button onClick={onClose} className="text-gray-500 hover:text-white text-xs ml-2">✕</button>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: description + skills */}
        <div className="space-y-4">
          <div>
            <h3 className="text-xs text-gray-500 mb-2">概要</h3>
            <p className="text-sm text-gray-300 leading-relaxed">{agent.description}</p>
          </div>

          <div>
            <h3 className="text-xs text-gray-500 mb-2">スキル</h3>
            <div className="flex flex-wrap gap-1.5">
              {agent.skills.map((skill) => (
                <span
                  key={skill}
                  className={`text-[11px] px-2 py-0.5 rounded-full ${agent.bg} ${agent.color}`}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right: stats */}
        <div className="space-y-3">
          <h3 className="text-xs text-gray-500 mb-2">パフォーマンス</h3>

          <div className="bg-gray-800 rounded-lg p-3 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">完了タスク</span>
              <span className="font-bold text-white">{agent.tasksCompleted}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">ステータス</span>
              <span className={`font-medium ${stat.text}`}>{stat.label}</span>
            </div>
            {agent.currentTask && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">現在のタスク</span>
                <span className="text-blue-400 text-xs">{agent.currentTask}</span>
              </div>
            )}
            {agent.uptime && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">稼働状況</span>
                <span className="text-green-400">{agent.uptime}</span>
              </div>
            )}
          </div>

          {/* Activation info for sub-agents */}
          {agent.type === "sub" && (
            <div className="bg-gray-800 rounded-lg p-3">
              <h4 className="text-xs text-gray-500 mb-2">起動方式</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                メインエージェント（智代）が必要に応じて <code className="bg-gray-700 px-1 rounded text-violet-300">sessions_spawn</code> で起動。
                タスク完了後に結果を報告して終了。
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
