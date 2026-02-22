"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import {
  Plus,
  X,
  Trash2,
  Edit3,
  Bot,
  User,
  BarChart3,
  CheckCircle2,
  Circle,
  Loader2,
  Play,
  Zap,
  AlertCircle,
} from "lucide-react";
import { api } from "../../../convex/_generated/api";
import { useMockData, Task } from "@/lib/mock-data";

/* ── Columns ──────────────────────────────────────── */
const columns = [
  {
    id: "todo" as const,
    title: "Todo",
    subtitle: "これからやる",
    color: "border-slate-500",
    bg: "bg-slate-500/15",
    dot: "bg-slate-400",
    icon: Circle,
  },
  {
    id: "inprogress" as const,
    title: "In Progress",
    subtitle: "進行中",
    color: "border-blue-500",
    bg: "bg-blue-500/15",
    dot: "bg-blue-400",
    icon: Loader2,
  },
  {
    id: "done" as const,
    title: "Done",
    subtitle: "完了",
    color: "border-green-500",
    bg: "bg-green-500/15",
    dot: "bg-green-400",
    icon: CheckCircle2,
  },
];

const priorityConfig = {
  high: { color: "bg-red-500", label: "高" },
  medium: { color: "bg-amber-500", label: "中" },
  low: { color: "bg-slate-500", label: "低" },
};

/* ── Main Page ────────────────────────────────────── */
export default function TasksPage() {
  const { tasks, updateTask, createTask, deleteTask } = useMockData();
  const clearAllTasks = useMutation(api.tasks.clearAll);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [quickAdd, setQuickAdd] = useState<string | null>(null);
  const [quickTitle, setQuickTitle] = useState("");
  const [quickAssignee, setQuickAssignee] = useState<"zak" | "ai">("ai");
  const [quickDueDate, setQuickDueDate] = useState("");
  const [isClearingAll, setIsClearingAll] = useState(false);
  const [promptModal, setPromptModal] = useState<{ taskId: string; title: string } | null>(null);
  const [promptText, setPromptText] = useState("");
  const [search, setSearch] = useState("");
  const [filterAssignee, setFilterAssignee] = useState("");
  const [filterPriority, setFilterPriority] = useState("");

  const handleDragEnd = (result: DropResult) => {
    const { destination, draggableId } = result;
    if (!destination) return;
    const newStatus = destination.droppableId as Task["status"];
    const task = tasks.find((t) => t._id === draggableId);

    // AI担当タスクがIn Progressに移動 → prompt入力を促す
    if (task && task.assignee === "ai" && newStatus === "inprogress" && task.status !== "inprogress") {
      if (task.prompt) {
        // promptが既にある → そのまま実行開始
        updateTask(draggableId, {
          status: newStatus,
          order: destination.index,
          aiStatus: "pending",
        });
      } else {
        // prompt未設定 → モーダルで入力
        updateTask(draggableId, { status: newStatus, order: destination.index });
        setPromptModal({ taskId: draggableId, title: task.title });
        setPromptText("");
      }
      return;
    }

    updateTask(draggableId, {
      status: newStatus,
      order: destination.index,
    });
  };

  const handlePromptSubmit = () => {
    if (!promptModal || !promptText.trim()) return;
    updateTask(promptModal.taskId, {
      prompt: promptText,
      aiStatus: "pending",
    });
    setPromptModal(null);
    setPromptText("");
  };

  const handleQuickAdd = (status: Task["status"]) => {
    if (!quickTitle.trim()) return;
    const dueDate = quickDueDate
      ? new Date(`${quickDueDate}T23:59:59`).getTime()
      : undefined;

    createTask({
      title: quickTitle,
      status,
      priority: "medium",
      assignee: quickAssignee,
      order: tasks.filter((t) => t.status === status).length,
      dueDate,
    });
    setQuickTitle("");
    setQuickAssignee("ai");
    setQuickDueDate("");
    setQuickAdd(null);
  };

  const handleClearAll = async () => {
    if (!tasks.length || isClearingAll) return;
    const confirmed = window.confirm('全タスクを削除しますか？この操作は取り消せません。');
    if (!confirmed) return;
    setIsClearingAll(true);
    try {
      await clearAllTasks({});
    } finally {
      setIsClearingAll(false);
    }
  };

  const filteredTasks = tasks.filter((t) => {
    if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterAssignee && t.assignee !== filterAssignee) return false;
    if (filterPriority && t.priority !== filterPriority) return false;
    return true;
  });

  const isFiltering = search || filterAssignee || filterPriority;

  const byStatus = (status: string) =>
    filteredTasks.filter((t) => t.status === status).sort((a, b) => a.order - b.order);

  const zakTasks = tasks.filter((t) => t.assignee === "zak" && t.status !== "done").length;
  const aiTasks = tasks.filter((t) => t.assignee === "ai" && t.status !== "done").length;

  return (
    <div className="p-4 md:p-6 min-h-screen">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
        <h1 className="text-2xl md:text-3xl font-bold mb-1">タスクボード</h1>
        <p className="text-gray-400 text-sm">
          すべてのタスクと担当者を管理
        </p>
        </div>
        {tasks.length > 0 && (
          <button
            onClick={() => void handleClearAll()}
            disabled={isClearingAll}
            className="text-red-400 hover:text-red-300 border border-red-800 hover:border-red-600 px-3 py-1.5 rounded text-sm flex items-center gap-1.5"
          >
            <Trash2 size={14} />
            {isClearingAll ? "Clearing..." : "Clear All"}
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <StatCard
          icon={<BarChart3 className="w-4 h-4" />}
          label="総タスク"
          value={tasks.length}
          color="text-white"
        />
        <StatCard
          icon={<User className="w-4 h-4" />}
          label="Zak 担当"
          value={zakTasks}
          color="text-cyan-400"
        />
        <StatCard
          icon={<Bot className="w-4 h-4" />}
          label="AI 担当"
          value={aiTasks}
          color="text-violet-400"
        />
        <StatCard
          icon={<CheckCircle2 className="w-4 h-4" />}
          label="完了"
          value={byStatus("done").length}
          color="text-green-400"
        />
      </div>

      {/* Search & Filter */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="タスクを検索..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-gray-500"
        />
        <select
          value={filterAssignee}
          onChange={(e) => setFilterAssignee(e.target.value)}
          className="bg-gray-800 border border-gray-700 rounded-lg px-2 py-1.5 text-sm text-gray-300 focus:outline-none"
        >
          <option value="">全員</option>
          <option value="ai">AI</option>
          <option value="zak">Zak</option>
        </select>
        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          className="bg-gray-800 border border-gray-700 rounded-lg px-2 py-1.5 text-sm text-gray-300 focus:outline-none"
        >
          <option value="">全優先度</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      {isFiltering && (
        <p className="text-xs text-gray-400 mb-3">{filteredTasks.length}件表示中</p>
      )}

      {/* Board */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {columns.map((col) => {
            const ColIcon = col.icon;
            return (
              <div
                key={col.id}
                className={`bg-gray-900/60 rounded-xl border ${col.color} flex flex-col max-h-[calc(100vh-260px)]`}
              >
                {/* Column header */}
                <div
                  className={`px-4 py-3 ${col.bg} rounded-t-xl border-b border-gray-800 flex items-center justify-between`}
                >
                  <div className="flex items-center gap-2">
                    <ColIcon className={`w-4 h-4 ${col.id === "inprogress" ? "animate-spin text-blue-400" : col.id === "done" ? "text-green-400" : "text-slate-400"}`} style={col.id === "inprogress" ? { animationDuration: "3s" } : {}} />
                    <span className="font-semibold text-sm">{col.title}</span>
                    <span className="text-xs text-gray-500">{col.subtitle}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400 bg-gray-800 px-2 py-0.5 rounded-full">
                      {byStatus(col.id).length}
                    </span>
                    <button
                      onClick={() => setQuickAdd(col.id)}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Cards */}
                <Droppable droppableId={col.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex-1 overflow-y-auto p-3 space-y-2 min-h-[120px] ${
                        snapshot.isDraggingOver ? "bg-gray-800/50" : ""
                      }`}
                    >
                      {/* Quick add */}
                      {quickAdd === col.id && (
                        <div className="bg-gray-800 p-3 rounded-lg border border-gray-600 space-y-2">
                          <input
                            autoFocus
                            value={quickTitle}
                            onChange={(e) => setQuickTitle(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleQuickAdd(col.id);
                              if (e.key === "Escape") {
                                setQuickDueDate("");
                                setQuickAdd(null);
                              }
                            }}
                            placeholder="タスク名..."
                            className="w-full bg-gray-700 rounded px-3 py-2 text-sm text-white placeholder-gray-500 outline-none focus:ring-1 focus:ring-blue-500"
                          />
                          <input
                            type="date"
                            value={quickDueDate}
                            onChange={(e) => setQuickDueDate(e.target.value)}
                            className="w-full bg-gray-700 rounded px-3 py-2 text-sm text-white outline-none focus:ring-1 focus:ring-blue-500 [color-scheme:dark]"
                          />
                          <div className="flex items-center gap-2">
                            {/* Assignee toggle */}
                            <div className="flex bg-gray-700 rounded-lg p-0.5 flex-1">
                              <button
                                onClick={() => setQuickAssignee("zak")}
                                className={`flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded text-xs transition-colors ${
                                  quickAssignee === "zak"
                                    ? "bg-cyan-600 text-white"
                                    : "text-gray-400 hover:text-white"
                                }`}
                              >
                                <User className="w-3 h-3" /> Zak
                              </button>
                              <button
                                onClick={() => setQuickAssignee("ai")}
                                className={`flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded text-xs transition-colors ${
                                  quickAssignee === "ai"
                                    ? "bg-violet-600 text-white"
                                    : "text-gray-400 hover:text-white"
                                }`}
                              >
                                <Bot className="w-3 h-3" /> AI
                              </button>
                            </div>
                            <button
                              onClick={() => handleQuickAdd(col.id)}
                              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded text-xs text-white"
                            >
                              追加
                            </button>
                            <button
                              onClick={() => {
                                setQuickDueDate("");
                                setQuickAdd(null);
                              }}
                              className="px-2 py-1.5 text-gray-400 hover:text-white text-xs"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      )}

                      {byStatus(col.id).map((task, idx) => (
                        <Draggable
                          key={task._id}
                          draggableId={task._id}
                          index={idx}
                        >
                          {(prov, snap) => (
                            <div
                              ref={prov.innerRef}
                              {...prov.draggableProps}
                              {...prov.dragHandleProps}
                              onClick={() => setEditingTask(task)}
                              className={`group relative bg-gray-800 p-3 rounded-lg border border-gray-700 hover:border-gray-500 cursor-pointer transition-all ${
                                snap.isDragging
                                  ? "rotate-1 shadow-xl shadow-black/40"
                                  : ""
                              }`}
                            >
                              <TaskCard task={task} />
                              <TaskDeleteButton taskId={task._id} onDelete={deleteTask} />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>

      {/* Prompt Modal */}
      {promptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md">
            <div className="px-6 py-4 border-b border-gray-800">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-violet-400" />
                <h2 className="text-lg font-bold">AIに実行指示</h2>
              </div>
              <p className="text-sm text-gray-400 mt-1">{promptModal.title}</p>
            </div>
            <div className="p-6 space-y-4">
              <textarea
                autoFocus
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handlePromptSubmit();
                  if (e.key === "Escape") setPromptModal(null);
                }}
                rows={4}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white outline-none resize-none focus:border-violet-500"
                placeholder="このタスクで何をすべきか指示を入力...&#10;例: Mission ControlのREADMEを書いて"
              />
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setPromptModal(null)}
                  className="px-4 py-2 text-sm text-gray-400 hover:text-white"
                >
                  スキップ
                </button>
                <button
                  onClick={handlePromptSubmit}
                  className="px-5 py-2 bg-violet-600 hover:bg-violet-700 rounded-lg text-sm text-white font-medium flex items-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  実行開始
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingTask && (
        <TaskModal
          task={editingTask}
          onClose={() => setEditingTask(null)}
          onSave={(updates) => {
            updateTask(editingTask._id, updates);
            setEditingTask({ ...editingTask, ...updates } as Task);
          }}
          onDelete={() => {
            deleteTask(editingTask._id);
            setEditingTask(null);
          }}
        />
      )}
    </div>
  );
}

/* ── Stat Card ────────────────────────────────────── */
function StatCard({
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
        {icon}
        {label}
      </div>
      <div className={`text-xl font-bold ${color}`}>{value}</div>
    </div>
  );
}

/* ── Task Card ────────────────────────────────────── */
function TaskCard({ task }: { task: Task }) {
  const prio = priorityConfig[task.priority];
  const dueDateLabel =
    task.dueDate !== undefined
      ? new Date(task.dueDate).toLocaleDateString("ja-JP", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : null;
  const isOverdue =
    task.dueDate !== undefined &&
    task.status !== "done" &&
    task.dueDate < Date.now();

  return (
    <div className="space-y-2">
      {/* Title + priority */}
      <div className="flex items-start gap-2">
        <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${prio.color}`} />
        <h3 className="text-sm font-medium text-white leading-snug line-clamp-2 flex-1">
          {task.title}
        </h3>
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-xs text-gray-400 line-clamp-2 pl-3.5">
          {task.description}
        </p>
      )}
      {dueDateLabel && (
        <p className={`text-xs pl-3.5 ${isOverdue ? "text-red-400" : "text-gray-400"}`}>
          Due {dueDateLabel}
        </p>
      )}

      {/* Footer: assignee + AI status + date */}
      <div className="flex items-center justify-between pl-3.5">
        <div className="flex items-center gap-1.5">
          <AssigneeBadge assignee={task.assignee} />
          {task.assignee === "ai" && task.aiStatus && task.aiStatus !== "idle" && (
            <AIStatusBadge status={task.aiStatus} />
          )}
        </div>
        <span className="text-[10px] text-gray-600">
          {new Date(task.updatedAt).toLocaleDateString("ja-JP", {
            month: "short",
            day: "numeric",
          })}
        </span>
      </div>
    </div>
  );
}

/* ── Assignee Badge ───────────────────────────────── */
function AssigneeBadge({ assignee }: { assignee: "zak" | "ai" }) {
  if (assignee === "zak") {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-400">
        <User className="w-3 h-3" />
        Zak
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-violet-500/15 text-violet-400">
      <Bot className="w-3 h-3" />
      智代
    </span>
  );
}

/* ── AI Status Badge ──────────────────────────────── */
function AIStatusBadge({ status }: { status: string }) {
  const config: Record<string, { icon: React.ReactNode; label: string; cls: string }> = {
    pending: { icon: <Circle className="w-3 h-3" />, label: "待機", cls: "bg-amber-500/15 text-amber-400" },
    running: { icon: <Loader2 className="w-3 h-3 animate-spin" />, label: "実行中", cls: "bg-blue-500/15 text-blue-400" },
    completed: { icon: <CheckCircle2 className="w-3 h-3" />, label: "完了", cls: "bg-green-500/15 text-green-400" },
    failed: { icon: <AlertCircle className="w-3 h-3" />, label: "失敗", cls: "bg-red-500/15 text-red-400" },
  };
  const c = config[status];
  if (!c) return null;
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full ${c.cls}`}>
      {c.icon} {c.label}
    </span>
  );
}

/* ── Task Delete Button (card hover) ──────────────── */
function TaskDeleteButton({
  taskId,
  onDelete,
}: {
  taskId: string;
  onDelete: (id: string) => void;
}) {
  const [confirm, setConfirm] = useState(false);

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        if (confirm) {
          onDelete(taskId);
        } else {
          setConfirm(true);
          setTimeout(() => setConfirm(false), 2000);
        }
      }}
      className={`absolute top-2 right-2 p-1.5 rounded-md transition-all ${
        confirm
          ? "bg-red-600 text-white opacity-100"
          : "text-gray-500 hover:text-red-400 hover:bg-gray-700 opacity-0 group-hover:opacity-100"
      }`}
      title={confirm ? "もう一度クリックで削除" : "削除"}
    >
      <Trash2 className="w-3.5 h-3.5" />
    </button>
  );
}

/* ── Task Edit Modal ──────────────────────────────── */
function TaskModal({
  task,
  onClose,
  onSave,
  onDelete,
}: {
  task: Task;
  onClose: () => void;
  onSave: (updates: Partial<Task>) => void;
  onDelete: () => void;
}) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [priority, setPriority] = useState(task.priority);
  const [assignee, setAssignee] = useState(task.assignee);
  const [status, setStatus] = useState(task.status);
  const [prompt, setPrompt] = useState(task.prompt || "");
  const [confirmDelete, setConfirmDelete] = useState(false);

  const save = () => {
    onSave({
      title,
      description: description || undefined,
      priority,
      assignee,
      status,
      prompt: prompt || undefined,
    });
    onClose();
  };

  const triggerAI = () => {
    onSave({
      prompt: prompt || undefined,
      aiStatus: "pending",
      status: "inprogress",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
          <h2 className="text-lg font-bold">タスク編集</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (confirmDelete) onDelete();
                else {
                  setConfirmDelete(true);
                  setTimeout(() => setConfirmDelete(false), 3000);
                }
              }}
              className={`p-2 rounded-lg transition-colors ${
                confirmDelete
                  ? "bg-red-600 text-white"
                  : "text-gray-400 hover:text-red-400 hover:bg-gray-800"
              }`}
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* Title */}
          <div>
            <label className="text-xs text-gray-400 mb-1 block">タイトル</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-xs text-gray-400 mb-1 block">詳細</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white outline-none resize-none focus:border-blue-500"
              placeholder="タスクの詳細..."
            />
          </div>

          {/* Assignee */}
          <div>
            <label className="text-xs text-gray-400 mb-1 block">担当者</label>
            <div className="flex bg-gray-800 rounded-lg p-1 border border-gray-700">
              <button
                onClick={() => setAssignee("zak")}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                  assignee === "zak"
                    ? "bg-cyan-600 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <User className="w-4 h-4" />
                Zak
              </button>
              <button
                onClick={() => setAssignee("ai")}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                  assignee === "ai"
                    ? "bg-violet-600 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <Bot className="w-4 h-4" />
                智代 (AI)
              </button>
            </div>
          </div>

          {/* Priority + Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">優先度</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Task["priority"])}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
              >
                <option value="high">🔴 高</option>
                <option value="medium">🟡 中</option>
                <option value="low">⚪ 低</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">ステータス</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as Task["status"])}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
              >
                {columns.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title} — {c.subtitle}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* AI Prompt (AI担当のみ) */}
          {assignee === "ai" && (
            <div>
              <label className="text-xs text-gray-400 mb-1 flex items-center gap-1.5">
                <Zap className="w-3 h-3 text-violet-400" />
                AI実行指示
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={3}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white outline-none resize-none focus:border-violet-500"
                placeholder="AIへの指示を入力...&#10;例: READMEを書いて、テストを追加して"
              />
              {task.aiStatus && task.aiStatus !== "idle" && (
                <div className="mt-2 flex items-center gap-2">
                  <AIStatusBadge status={task.aiStatus} />
                  {task.aiResult && (
                    <span className="text-xs text-gray-400 truncate">{task.aiResult}</span>
                  )}
                </div>
              )}
              {(!task.aiStatus || task.aiStatus === "idle" || task.aiStatus === "failed") && prompt.trim() && (
                <button
                  onClick={triggerAI}
                  className="mt-2 px-4 py-1.5 bg-violet-600 hover:bg-violet-700 rounded-lg text-xs text-white font-medium flex items-center gap-1.5"
                >
                  <Play className="w-3 h-3" />
                  AIで実行
                </button>
              )}
            </div>
          )}

          {/* Meta */}
          <div className="text-xs text-gray-500 flex gap-4 pt-1">
            <span>作成: {new Date(task.createdAt).toLocaleDateString("ja-JP")}</span>
            <span>更新: {new Date(task.updatedAt).toLocaleDateString("ja-JP")}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-800">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            キャンセル
          </button>
          <button
            onClick={save}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm text-white font-medium transition-colors"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
}
