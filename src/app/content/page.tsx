"use client";

import { useState, useRef, Fragment } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import {
  Plus,
  FileText,
  Video,
  Mic,
  Twitter,
  X,
  Edit3,
  Trash2,
  Image as ImageIcon,
  ChevronDown,
  Tag,
  Calendar,
  Clock,
  Eye,
  BarChart3,
} from "lucide-react";
import { useMockData, ContentItem } from "@/lib/mock-data";

/* ── Column definitions ─────────────────────────────── */
const stages = [
  {
    id: "ideas" as const,
    title: "Ideas",
    subtitle: "アイデアストック",
    color: "border-violet-500",
    bg: "bg-violet-500/20",
    dot: "bg-violet-400",
  },
  {
    id: "script" as const,
    title: "Script",
    subtitle: "スクリプト作成中",
    color: "border-amber-500",
    bg: "bg-amber-500/20",
    dot: "bg-amber-400",
  },
  {
    id: "thumbnail" as const,
    title: "Thumbnail",
    subtitle: "サムネイル生成中",
    color: "border-pink-500",
    bg: "bg-pink-500/20",
    dot: "bg-pink-400",
  },
  {
    id: "filming" as const,
    title: "Filming",
    subtitle: "撮影待ち",
    color: "border-cyan-500",
    bg: "bg-cyan-500/20",
    dot: "bg-cyan-400",
  },
  {
    id: "editing" as const,
    title: "Editing",
    subtitle: "編集中",
    color: "border-orange-500",
    bg: "bg-orange-500/20",
    dot: "bg-orange-400",
  },
  {
    id: "published" as const,
    title: "Published",
    subtitle: "公開済み",
    color: "border-green-500",
    bg: "bg-green-500/20",
    dot: "bg-green-400",
  },
];

const typeConfig: Record<
  ContentItem["type"],
  { icon: typeof FileText; color: string; label: string }
> = {
  blog: { icon: FileText, color: "text-blue-400", label: "ブログ" },
  tweet: { icon: Twitter, color: "text-cyan-400", label: "ツイート" },
  video: { icon: Video, color: "text-red-400", label: "動画" },
  article: { icon: FileText, color: "text-emerald-400", label: "記事" },
  podcast: { icon: Mic, color: "text-purple-400", label: "ポッドキャスト" },
};

/* ── Main Page ──────────────────────────────────────── */
export default function ContentPage() {
  const { content, updateContent, createContent, deleteContent } =
    useMockData();

  const [editingItem, setEditingItem] = useState<ContentItem | null>(null);
  const [quickAdd, setQuickAdd] = useState<string | null>(null);
  const [quickTitle, setQuickTitle] = useState("");
  const [quickType, setQuickType] = useState<ContentItem["type"]>("video");

  /* drag */
  const handleDragEnd = (result: DropResult) => {
    const { destination, draggableId } = result;
    if (!destination) return;
    updateContent(draggableId, {
      stage: destination.droppableId as ContentItem["stage"],
      order: destination.index,
    });
  };

  /* quick add */
  const handleQuickAdd = (stage: ContentItem["stage"]) => {
    if (!quickTitle.trim()) return;
    createContent({
      title: quickTitle,
      type: quickType,
      stage,
      order: content.filter((c) => c.stage === stage).length,
    });
    setQuickTitle("");
    setQuickType("video");
    setQuickAdd(null);
  };

  const byStage = (stage: string) =>
    content.filter((i) => i.stage === stage).sort((a, b) => a.order - b.order);

  /* stats */
  const total = content.length;
  const inProgress = content.filter(
    (c) => !["ideas", "published"].includes(c.stage)
  ).length;
  const bottleneck = stages
    .filter((s) => s.id !== "published" && s.id !== "ideas")
    .reduce(
      (max, s) => {
        const count = byStage(s.id).length;
        return count > max.count ? { stage: s.title, count } : max;
      },
      { stage: "", count: 0 }
    );

  return (
    <div className="p-4 md:p-6 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-1">
          コンテンツパイプライン
        </h1>
        <p className="text-gray-400 text-sm">
          アイデアから公開まで — 全ステージを一目で管理
        </p>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <Stat icon={<BarChart3 className="w-4 h-4" />} label="総コンテンツ" value={total} color="text-white" />
        <Stat icon={<Clock className="w-4 h-4" />} label="制作中" value={inProgress} color="text-amber-400" />
        <Stat icon={<Eye className="w-4 h-4" />} label="公開済み" value={byStage("published").length} color="text-green-400" />
        {bottleneck.count > 0 && (
          <Stat
            icon={<BarChart3 className="w-4 h-4" />}
            label="ボトルネック"
            value={bottleneck.stage}
            sub={`${bottleneck.count}件`}
            color="text-red-400"
          />
        )}
      </div>

      {/* Board */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4 snap-x">
          {stages.map((col) => (
            <div
              key={col.id}
              className={`flex-shrink-0 w-[280px] bg-gray-900/60 rounded-xl border ${col.color} flex flex-col max-h-[calc(100vh-220px)]`}
            >
              {/* Column header */}
              <div className={`px-4 py-3 ${col.bg} rounded-t-xl border-b border-gray-800 flex items-center justify-between`}>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${col.dot}`} />
                  <span className="font-semibold text-sm">{col.title}</span>
                  <span className="text-xs text-gray-400">
                    {col.subtitle}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 bg-gray-800 px-2 py-0.5 rounded-full">
                    {byStage(col.id).length}
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
                    className={`flex-1 overflow-y-auto p-3 space-y-2 ${
                      snapshot.isDraggingOver ? "bg-gray-800/50" : ""
                    }`}
                  >
                    {/* Quick add form */}
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
                          placeholder="タイトル..."
                          className="w-full bg-gray-700 rounded px-3 py-2 text-sm text-white placeholder-gray-500 outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        <div className="flex gap-2">
                          <select
                            value={quickType}
                            onChange={(e) =>
                              setQuickType(
                                e.target.value as ContentItem["type"]
                              )
                            }
                            className="flex-1 bg-gray-700 rounded px-2 py-1.5 text-xs text-white outline-none"
                          >
                            {Object.entries(typeConfig).map(([k, v]) => (
                              <option key={k} value={k}>
                                {v.label}
                              </option>
                            ))}
                          </select>
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

                    {byStage(col.id).map((item, idx) => (
                      <Draggable
                        key={item._id}
                        draggableId={item._id}
                        index={idx}
                      >
                        {(prov, snap) => (
                          <div
                            ref={prov.innerRef}
                            {...prov.draggableProps}
                            {...prov.dragHandleProps}
                            onClick={() => setEditingItem(item)}
                            className={`bg-gray-800 p-3 rounded-lg border border-gray-700 hover:border-gray-500 cursor-pointer transition-all ${
                              snap.isDragging
                                ? "rotate-1 shadow-xl shadow-black/40"
                                : ""
                            }`}
                          >
                            <ContentCard item={item} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      {/* Detail / Edit Modal */}
      {editingItem && (
        <DetailModal
          item={editingItem}
          onClose={() => setEditingItem(null)}
          onSave={(updates) => {
            updateContent(editingItem._id, updates);
            setEditingItem({ ...editingItem, ...updates } as ContentItem);
          }}
          onDelete={() => {
            deleteContent(editingItem._id);
            setEditingItem(null);
          }}
        />
      )}
    </div>
  );
}

/* ── Stat Card ──────────────────────────────────────── */
function Stat({
  icon,
  label,
  value,
  sub,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
  color: string;
}) {
  return (
    <div className="bg-gray-800/80 border border-gray-700 rounded-lg px-4 py-3">
      <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
        {icon}
        {label}
      </div>
      <div className={`text-lg font-bold ${color}`}>
        {value}
        {sub && <span className="text-xs font-normal text-gray-400 ml-1">{sub}</span>}
      </div>
    </div>
  );
}

/* ── Content Card (in column) ───────────────────────── */
function ContentCard({ item }: { item: ContentItem }) {
  const cfg = typeConfig[item.type];
  const Icon = cfg.icon;

  return (
    <div className="space-y-2">
      {/* Thumbnail preview */}
      {item.thumbnailUrl && (
        <div className="rounded-md overflow-hidden -mx-1 -mt-1 mb-2">
          <img
            src={item.thumbnailUrl}
            alt=""
            className="w-full h-28 object-cover"
          />
        </div>
      )}

      {/* Type badge + title */}
      <div className="flex items-start gap-2">
        <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${cfg.color}`} />
        <h3 className="text-sm font-medium text-white leading-snug line-clamp-2">
          {item.title}
        </h3>
      </div>

      {/* Description */}
      {item.description && (
        <p className="text-xs text-gray-400 line-clamp-2">{item.description}</p>
      )}

      {/* Script indicator */}
      {item.script && (
        <div className="flex items-center gap-1 text-xs text-amber-400/80">
          <FileText className="w-3 h-3" />
          スクリプトあり
        </div>
      )}

      {/* Tags */}
      {item.tags && item.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {item.tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] px-1.5 py-0.5 bg-gray-700 text-gray-300 rounded"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-[10px] text-gray-500 pt-1">
        <span className={`px-1.5 py-0.5 rounded ${cfg.color} bg-opacity-20`} style={{ backgroundColor: cfg.color.replace("text-", "") + "15" }}>
          {cfg.label}
        </span>
        {item.dueDate && (
          <span
            className={
              item.dueDate < Date.now() ? "text-red-400" : "text-gray-500"
            }
          >
            {new Date(item.dueDate).toLocaleDateString("ja-JP", {
              month: "short",
              day: "numeric",
            })}
          </span>
        )}
      </div>
    </div>
  );
}

/* ── Detail / Edit Modal ────────────────────────────── */
function DetailModal({
  item,
  onClose,
  onSave,
  onDelete,
}: {
  item: ContentItem;
  onClose: () => void;
  onSave: (updates: Partial<ContentItem>) => void;
  onDelete: () => void;
}) {
  const [tab, setTab] = useState<"overview" | "script" | "thumbnail">(
    "overview"
  );
  const [title, setTitle] = useState(item.title);
  const [description, setDescription] = useState(item.description || "");
  const [script, setScript] = useState(item.script || "");
  const [thumbnailUrl, setThumbnailUrl] = useState(item.thumbnailUrl || "");
  const [type, setType] = useState(item.type);
  const [stage, setStage] = useState(item.stage);
  const [tagsInput, setTagsInput] = useState((item.tags || []).join(", "));
  const [confirmDelete, setConfirmDelete] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const save = () => {
    onSave({
      title,
      description: description || undefined,
      script: script || undefined,
      thumbnailUrl: thumbnailUrl || undefined,
      type,
      stage,
      tags: tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setThumbnailUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-lg font-bold bg-transparent outline-none text-white w-full"
              placeholder="タイトル"
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (confirmDelete) {
                  onDelete();
                } else {
                  setConfirmDelete(true);
                  setTimeout(() => setConfirmDelete(false), 3000);
                }
              }}
              className={`p-2 rounded-lg transition-colors ${
                confirmDelete
                  ? "bg-red-600 text-white"
                  : "text-gray-400 hover:text-red-400 hover:bg-gray-800"
              }`}
              title={confirmDelete ? "もう一度クリックで削除" : "削除"}
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

        {/* Tabs */}
        <div className="flex border-b border-gray-800 px-6">
          {(
            [
              ["overview", "概要"],
              ["script", "スクリプト"],
              ["thumbnail", "サムネイル"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                tab === key
                  ? "border-blue-500 text-white"
                  : "border-transparent text-gray-400 hover:text-gray-200"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {tab === "overview" && (
            <>
              {/* Type & Stage */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">
                    タイプ
                  </label>
                  <select
                    value={type}
                    onChange={(e) =>
                      setType(e.target.value as ContentItem["type"])
                    }
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
                  >
                    {Object.entries(typeConfig).map(([k, v]) => (
                      <option key={k} value={k}>
                        {v.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">
                    ステージ
                  </label>
                  <select
                    value={stage}
                    onChange={(e) =>
                      setStage(e.target.value as ContentItem["stage"])
                    }
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
                  >
                    {stages.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.title} — {s.subtitle}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-xs text-gray-400 mb-1 block">
                  概要・メモ
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white outline-none resize-none focus:border-blue-500"
                  placeholder="コンテンツの概要やメモ..."
                />
              </div>

              {/* Tags */}
              <div>
                <label className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  タグ（カンマ区切り）
                </label>
                <input
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
                  placeholder="AI, tutorial, DeFi..."
                />
              </div>

              {/* Meta info */}
              <div className="text-xs text-gray-500 flex gap-4 pt-2">
                <span>
                  作成:{" "}
                  {new Date(item.createdAt).toLocaleDateString("ja-JP")}
                </span>
                <span>
                  更新:{" "}
                  {new Date(item.updatedAt).toLocaleDateString("ja-JP")}
                </span>
              </div>
            </>
          )}

          {tab === "script" && (
            <div className="space-y-2">
              <label className="text-xs text-gray-400 flex items-center gap-1">
                <Edit3 className="w-3 h-3" />
                フルスクリプト（Markdown対応）
              </label>
              <textarea
                value={script}
                onChange={(e) => setScript(e.target.value)}
                rows={18}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-sm text-white outline-none resize-none focus:border-blue-500 font-mono leading-relaxed"
                placeholder="# タイトル&#10;&#10;## イントロ&#10;...&#10;&#10;## 本編&#10;...&#10;&#10;## まとめ&#10;..."
              />
              <p className="text-[10px] text-gray-600">
                ヒント: Markdown記法でセクション分けすると見やすい
              </p>
            </div>
          )}

          {tab === "thumbnail" && (
            <div className="space-y-4">
              {/* Current thumbnail */}
              {thumbnailUrl ? (
                <div className="relative group">
                  <img
                    src={thumbnailUrl}
                    alt="Thumbnail"
                    className="w-full rounded-xl border border-gray-700 max-h-80 object-cover"
                  />
                  <button
                    onClick={() => setThumbnailUrl("")}
                    className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-lg text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-700 rounded-xl p-12 text-center">
                  <ImageIcon className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400 text-sm mb-1">
                    サムネイルが未設定
                  </p>
                  <p className="text-gray-600 text-xs">
                    画像をアップロードまたはURLを入力
                  </p>
                </div>
              )}

              {/* Upload / URL */}
              <div className="flex gap-3">
                <button
                  onClick={() => fileRef.current?.click()}
                  className="flex-1 flex items-center justify-center gap-2 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-750 hover:text-white transition-colors"
                >
                  <ImageIcon className="w-4 h-4" />
                  画像をアップロード
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">
                  画像URL
                </label>
                <input
                  value={thumbnailUrl}
                  onChange={(e) => setThumbnailUrl(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
                  placeholder="https://..."
                />
              </div>
            </div>
          )}
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
            onClick={() => {
              save();
              onClose();
            }}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm text-white font-medium transition-colors"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
}
