"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import {
  Search,
  Plus,
  Edit3,
  Trash2,
  Tag,
  Calendar,
  FileText,
  Brain,
  Book,
  Clock,
  X,
  ChevronRight,
  Hash,
  Sparkles,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useMockData, Note } from "@/lib/mock-data";

/* ── Highlight helper ─────────────────────────────── */
function highlightText(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  const parts = text.split(regex);
  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark key={i} className="bg-amber-500/30 text-amber-200 rounded px-0.5">
        {part}
      </mark>
    ) : (
      part
    )
  );
}

/* ── Category config ──────────────────────────────── */
const categoryConfig: Record<string, { icon: typeof Brain; color: string; bg: string }> = {
  "long-term": { icon: Brain, color: "text-violet-400", bg: "bg-violet-500/15" },
  daily: { icon: Calendar, color: "text-blue-400", bg: "bg-blue-500/15" },
  project: { icon: Book, color: "text-emerald-400", bg: "bg-emerald-500/15" },
  reference: { icon: FileText, color: "text-amber-400", bg: "bg-amber-500/15" },
};

/* ── Main Page ────────────────────────────────────── */
export default function MemoryPage() {
  const { notes, createNote, updateNote, deleteNote } = useMockData();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showNewForm, setShowNewForm] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut: Cmd/Ctrl+K to focus search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchRef.current?.focus();
      }
      if (e.key === "Escape") {
        setSearchTerm("");
        searchRef.current?.blur();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // All tags
  const allTags = useMemo(() => {
    const set = new Set<string>();
    notes.forEach((n) => n.tags.forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, [notes]);

  // Filter + search
  const filtered = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return notes
      .filter((note) => {
        const matchSearch =
          !q ||
          note.title.toLowerCase().includes(q) ||
          note.content.toLowerCase().includes(q) ||
          note.tags.some((t) => t.toLowerCase().includes(q));
        const matchTag = !selectedTag || note.tags.includes(selectedTag);
        return matchSearch && matchTag;
      })
      .sort((a, b) => b.updatedAt - a.updatedAt);
  }, [notes, searchTerm, selectedTag]);

  // Search result count + snippet
  const getSnippet = (content: string, query: string): string => {
    if (!query.trim()) {
      return content.replace(/^#+ .*/gm, "").trim().slice(0, 120);
    }
    const idx = content.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return content.slice(0, 120);
    const start = Math.max(0, idx - 40);
    const end = Math.min(content.length, idx + query.length + 80);
    return (start > 0 ? "..." : "") + content.slice(start, end) + (end < content.length ? "..." : "");
  };

  const getCategoryForNote = (note: Note): string => {
    if (note.tags.includes("long-term")) return "long-term";
    if (note.tags.includes("daily")) return "daily";
    if (note.tags.includes("project")) return "project";
    return "reference";
  };

  return (
    <div className="p-4 md:p-6 min-h-screen flex flex-col">
      {/* Header */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            <Brain className="w-7 h-7 text-violet-400" />
            メモリ
          </h1>
          <button
            onClick={() => {
              setShowNewForm(true);
              setSelectedNote(null);
              setIsEditing(false);
            }}
            className="flex items-center gap-1.5 px-3 py-2 bg-violet-600 hover:bg-violet-700 rounded-lg text-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            新規メモリ
          </button>
        </div>
        <p className="text-gray-400 text-sm">
          ナレッジベース — すべての記憶を検索・閲覧
        </p>
      </div>

      {/* Search bar */}
      <div className="mb-4 space-y-3">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            ref={searchRef}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="メモリを検索...  ⌘K"
            className="w-full pl-10 pr-10 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white placeholder-gray-500 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setSelectedTag("")}
            className={`px-2.5 py-1 text-xs rounded-full transition-colors ${
              !selectedTag
                ? "bg-violet-600 text-white"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200"
            }`}
          >
            すべて
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(selectedTag === tag ? "" : tag)}
              className={`px-2.5 py-1 text-xs rounded-full transition-colors flex items-center gap-1 ${
                selectedTag === tag
                  ? "bg-violet-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200"
              }`}
            >
              <Hash className="w-3 h-3" />
              {tag}
            </button>
          ))}
        </div>

        {/* Result count */}
        {searchTerm && (
          <p className="text-xs text-gray-500">
            <Sparkles className="w-3 h-3 inline mr-1" />
            {filtered.length} 件のメモリがヒット
          </p>
        )}
      </div>

      {/* Main area */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-5 gap-4 min-h-0">
        {/* List */}
        <div className="lg:col-span-2 bg-gray-900/60 border border-gray-800 rounded-xl flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto divide-y divide-gray-800/60">
            {filtered.map((note) => {
              const cat = getCategoryForNote(note);
              const cfg = categoryConfig[cat];
              const CatIcon = cfg.icon;
              const isSelected = selectedNote?._id === note._id;

              return (
                <div
                  key={note._id}
                  onClick={() => {
                    setSelectedNote(note);
                    setIsEditing(false);
                    setShowNewForm(false);
                  }}
                  className={`px-4 py-3.5 cursor-pointer transition-all group ${
                    isSelected
                      ? "bg-violet-500/10 border-l-2 border-violet-500"
                      : "border-l-2 border-transparent hover:bg-gray-800/60"
                  }`}
                >
                  {/* Title row */}
                  <div className="flex items-start gap-2 mb-1.5">
                    <CatIcon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${cfg.color}`} />
                    <h3 className="text-sm font-medium text-white leading-snug flex-1 line-clamp-2">
                      {searchTerm ? highlightText(note.title, searchTerm) : note.title}
                    </h3>
                    <ChevronRight
                      className={`w-4 h-4 flex-shrink-0 transition-colors ${
                        isSelected ? "text-violet-400" : "text-gray-700 group-hover:text-gray-500"
                      }`}
                    />
                  </div>

                  {/* Snippet */}
                  <p className="text-xs text-gray-500 line-clamp-2 pl-6 mb-2">
                    {searchTerm
                      ? highlightText(getSnippet(note.content, searchTerm), searchTerm)
                      : getSnippet(note.content, "")}
                  </p>

                  {/* Tags + date */}
                  <div className="flex items-center justify-between pl-6">
                    <div className="flex gap-1">
                      {note.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className={`text-[10px] px-1.5 py-0.5 rounded ${cfg.bg} ${cfg.color}`}
                        >
                          {tag}
                        </span>
                      ))}
                      {note.tags.length > 3 && (
                        <span className="text-[10px] text-gray-600">
                          +{note.tags.length - 3}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-gray-600 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(note.updatedAt).toLocaleDateString("ja-JP", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              );
            })}

            {filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-gray-600">
                <Search className="w-10 h-10 mb-3 opacity-40" />
                <p className="text-sm">メモリが見つかりません</p>
              </div>
            )}
          </div>
        </div>

        {/* Content pane */}
        <div className="lg:col-span-3 bg-gray-900/60 border border-gray-800 rounded-xl flex flex-col overflow-hidden">
          {selectedNote && !showNewForm ? (
            <NoteView
              note={selectedNote}
              isEditing={isEditing}
              searchTerm={searchTerm}
              onEdit={() => setIsEditing(true)}
              onCancelEdit={() => setIsEditing(false)}
              onSave={(updates) => {
                updateNote(selectedNote._id, updates);
                setSelectedNote({ ...selectedNote, ...updates, updatedAt: Date.now() });
                setIsEditing(false);
              }}
              onDelete={() => {
                deleteNote(selectedNote._id);
                setSelectedNote(null);
              }}
            />
          ) : showNewForm ? (
            <NewNoteForm
              onCancel={() => setShowNewForm(false)}
              onCreate={(data) => {
                createNote(data);
                setShowNewForm(false);
              }}
            />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-600 p-8">
              <Brain className="w-16 h-16 mb-4 opacity-20" />
              <p className="text-lg mb-1">メモリを選択</p>
              <p className="text-sm text-gray-700">
                左のリストからドキュメントを選ぶか、新規作成
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Note View / Edit ─────────────────────────────── */
function NoteView({
  note,
  isEditing,
  searchTerm,
  onEdit,
  onCancelEdit,
  onSave,
  onDelete,
}: {
  note: Note;
  isEditing: boolean;
  searchTerm: string;
  onEdit: () => void;
  onCancelEdit: () => void;
  onSave: (updates: Partial<Note>) => void;
  onDelete: () => void;
}) {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [tagsInput, setTagsInput] = useState(note.tags.join(", "));
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Sync when note changes
  useMemo(() => {
    setTitle(note.title);
    setContent(note.content);
    setTagsInput(note.tags.join(", "));
  }, [note._id]);

  return (
    <>
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-800 flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-lg font-bold bg-transparent outline-none text-white border-b border-gray-700 pb-1 focus:border-violet-500"
            />
          ) : (
            <h2 className="text-lg font-bold text-white leading-snug">
              {note.title}
            </h2>
          )}
          <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              作成: {new Date(note.createdAt).toLocaleDateString("ja-JP")}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              更新: {new Date(note.updatedAt).toLocaleDateString("ja-JP")}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          {!isEditing && (
            <button
              onClick={onEdit}
              className="p-2 text-gray-500 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            >
              <Edit3 className="w-4 h-4" />
            </button>
          )}
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
                : "text-gray-500 hover:text-red-400 hover:bg-gray-800"
            }`}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {isEditing ? (
          <div className="p-5 space-y-4">
            <div>
              <label className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                <Tag className="w-3 h-3" /> タグ（カンマ区切り）
              </label>
              <input
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-violet-500"
                placeholder="long-term, project, memo..."
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">
                コンテンツ（Markdown）
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={20}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-sm text-white outline-none resize-none focus:border-violet-500 font-mono leading-relaxed"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={onCancelEdit}
                className="px-4 py-2 text-sm text-gray-400 hover:text-white"
              >
                キャンセル
              </button>
              <button
                onClick={() =>
                  onSave({
                    title,
                    content,
                    tags: tagsInput.split(",").map((t) => t.trim()).filter(Boolean),
                  })
                }
                className="px-5 py-2 bg-violet-600 hover:bg-violet-700 rounded-lg text-sm text-white font-medium"
              >
                保存
              </button>
            </div>
          </div>
        ) : (
          <div className="p-5">
            {/* Tags */}
            {note.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-5">
                {note.tags.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1 px-2 py-0.5 bg-violet-500/15 text-violet-300 text-xs rounded-full"
                  >
                    <Hash className="w-3 h-3" />
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Rendered markdown */}
            <article className="prose prose-invert max-w-none">
              <ReactMarkdown
                components={{
                  h1: ({ children }) => (
                    <h1 className="text-2xl font-bold mb-4 mt-6 text-white border-b border-gray-800 pb-2">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-xl font-bold mb-3 mt-5 text-white flex items-center gap-2">
                      <span className="w-1 h-5 bg-violet-500 rounded-full" />
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-base font-semibold mb-2 mt-4 text-gray-200">
                      {children}
                    </h3>
                  ),
                  p: ({ children }) => (
                    <p className="mb-3 text-gray-300 leading-relaxed text-sm">
                      {children}
                    </p>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc pl-5 mb-4 text-gray-300 text-sm space-y-1">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal pl-5 mb-4 text-gray-300 text-sm space-y-1">
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => (
                    <li className="leading-relaxed">{children}</li>
                  ),
                  code: ({ children, className }) => {
                    const isBlock = className?.includes("language-");
                    if (isBlock) {
                      return (
                        <code className="text-sm text-green-300">{children}</code>
                      );
                    }
                    return (
                      <code className="bg-gray-800 px-1.5 py-0.5 rounded text-violet-300 text-xs">
                        {children}
                      </code>
                    );
                  },
                  pre: ({ children }) => (
                    <pre className="bg-gray-950 border border-gray-800 p-4 rounded-lg overflow-x-auto mb-4 text-sm">
                      {children}
                    </pre>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-3 border-violet-500 pl-4 italic text-gray-400 mb-4 bg-violet-500/5 py-2 rounded-r-lg">
                      {children}
                    </blockquote>
                  ),
                  strong: ({ children }) => (
                    <strong className="text-white font-semibold">{children}</strong>
                  ),
                  a: ({ children, href }) => (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-violet-400 hover:text-violet-300 underline underline-offset-2"
                    >
                      {children}
                    </a>
                  ),
                  hr: () => <hr className="border-gray-800 my-6" />,
                }}
              >
                {note.content}
              </ReactMarkdown>
            </article>
          </div>
        )}
      </div>
    </>
  );
}

/* ── New Note Form ────────────────────────────────── */
function NewNoteForm({
  onCancel,
  onCreate,
}: {
  onCancel: () => void;
  onCreate: (data: Omit<Note, "_id" | "createdAt" | "updatedAt">) => void;
}) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tagsInput, setTagsInput] = useState("");

  return (
    <div className="p-5 space-y-4 flex-1 flex flex-col">
      <h2 className="text-lg font-bold flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-violet-400" />
        新しいメモリ
      </h2>

      <input
        autoFocus
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="タイトル"
        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:border-violet-500"
      />

      <input
        value={tagsInput}
        onChange={(e) => setTagsInput(e.target.value)}
        placeholder="タグ（カンマ区切り）: long-term, project, memo..."
        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:border-violet-500"
      />

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Markdown でメモリを記述..."
        className="flex-1 w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-sm text-white outline-none resize-none focus:border-violet-500 font-mono leading-relaxed min-h-[300px]"
      />

      <div className="flex justify-end gap-2">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-sm text-gray-400 hover:text-white"
        >
          キャンセル
        </button>
        <button
          onClick={() => {
            if (!title.trim() || !content.trim()) return;
            onCreate({
              title,
              content,
              tags: tagsInput.split(",").map((t) => t.trim()).filter(Boolean),
              createdBy: "1",
            });
          }}
          className="px-5 py-2 bg-violet-600 hover:bg-violet-700 rounded-lg text-sm text-white font-medium"
        >
          作成
        </button>
      </div>
    </div>
  );
}
