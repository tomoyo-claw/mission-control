"use client";

import { useState } from "react";
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
} from "lucide-react";
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
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [quickAdd, setQuickAdd] = useState<string | null>(null);
  const [quickTitle, setQuickTitle] = useState("");
  const [quickAssignee, setQuickAssignee] = useState<"zak" | "ai">("ai");

  const handleDragEnd = (result: DropResult) => {
    const { destination, draggableId } = result;
    if (!destination) return;
    updateTask(draggableId, {
      status: destination.droppableId as Task["status"],
      order: destination.index,
    });
  };

  const handleQuickAdd = (status: Task["status"]) => {
    if (!quickTitle.trim()) return;
    createTask({
      title: quickTitle,
      status,
      priority: "medium",
      assignee: quickAssignee,
      order: tasks.filter((t) => t.status === status).length,
    });
    setQuickTitle("");
    setQuickAssignee("ai");
    setQuickAdd(null);
  };

  const byStatus = (status: string) =>
    tasks.filter((t) => t.status === status).sort((a, b) => a.order - b.order);

  const zakTasks = tasks.filter((t) => t.assignee === "zak" && t.status !== "done").length;
  const aiTasks = tasks.filter((t) => t.assignee === "ai" && t.status !== "done").length;

  return (
    <div className="p-4 md:p-6 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-1">タスクボード</h1>
        <p className="text-gray-400 text-sm">
          すべてのタスクと担当者を管理
        </p>
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
                              if (e.key === "Escape") setQuickAdd(null);
                            }}
                            placeholder="タスク名..."
                            className="w-full bg-gray-700 rounded px-3 py-2 text-sm text-white placeholder-gray-500 outline-none focus:ring-1 focus:ring-blue-500"
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
                              onClick={() => setQuickAdd(null)}
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
                              className={`bg-gray-800 p-3 rounded-lg border border-gray-700 hover:border-gray-500 cursor-pointer transition-all ${
                                snap.isDragging
                                  ? "rotate-1 shadow-xl shadow-black/40"
                                  : ""
                              }`}
                            >
                              <TaskCard task={task} />
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

      {/* Footer: assignee + date */}
      <div className="flex items-center justify-between pl-3.5">
        <AssigneeBadge assignee={task.assignee} />
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
  const [confirmDelete, setConfirmDelete] = useState(false);

  const save = () => {
    onSave({
      title,
      description: description || undefined,
      priority,
      assignee,
      status,
    });
    onClose();
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
