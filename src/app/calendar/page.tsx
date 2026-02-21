"use client";

import { useState, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  Bot,
  User,
  Timer,
  CheckCircle2,
  Circle,
  Loader2,
  XCircle,
  Flag,
  Bell,
  Repeat,
  Calendar as CalIcon,
  Zap,
  X,
  Trash2,
} from "lucide-react";
import { useMockData, Event } from "@/lib/mock-data";

/* ── Category config ──────────────────────────────── */
const catConfig: Record<
  Event["category"],
  { icon: typeof Timer; label: string; color: string; bg: string }
> = {
  task: { icon: Timer, label: "タスク", color: "text-blue-400", bg: "bg-blue-500/15" },
  cron: { icon: Repeat, label: "Cron", color: "text-violet-400", bg: "bg-violet-500/15" },
  meeting: { icon: CalIcon, label: "ミーティング", color: "text-cyan-400", bg: "bg-cyan-500/15" },
  reminder: { icon: Bell, label: "リマインダー", color: "text-pink-400", bg: "bg-pink-500/15" },
  milestone: { icon: Flag, label: "マイルストーン", color: "text-amber-400", bg: "bg-amber-500/15" },
};

const statusConfig: Record<string, { icon: typeof Circle; label: string; color: string }> = {
  scheduled: { icon: Circle, label: "予定", color: "text-gray-400" },
  running: { icon: Loader2, label: "実行中", color: "text-blue-400" },
  completed: { icon: CheckCircle2, label: "完了", color: "text-green-400" },
  failed: { icon: XCircle, label: "失敗", color: "text-red-400" },
};

const weekdays = ["日", "月", "火", "水", "木", "金", "土"];
const monthNames = [
  "1月", "2月", "3月", "4月", "5月", "6月",
  "7月", "8月", "9月", "10月", "11月", "12月",
];

/* ── Main ─────────────────────────────────────────── */
export default function CalendarPage() {
  const { events } = useMockData();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<number | null>(new Date().getDate());
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [filterCat, setFilterCat] = useState<string>("");

  const today = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) calendarDays.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarDays.push(d);

  const isToday = (day: number) =>
    day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  const getEventsForDay = (day: number) => {
    const start = new Date(year, month, day, 0, 0, 0).getTime();
    const end = new Date(year, month, day, 23, 59, 59).getTime();
    return events.filter(
      (e) =>
        (e.startDate >= start && e.startDate <= end) ||
        (e.endDate >= start && e.endDate <= end) ||
        (e.startDate <= start && e.endDate >= end)
    );
  };

  const selectedDayEvents = useMemo(() => {
    if (!selectedDay) return [];
    let evts = getEventsForDay(selectedDay);
    if (filterCat) evts = evts.filter((e) => e.category === filterCat);
    return evts.sort((a, b) => a.startDate - b.startDate);
  }, [selectedDay, events, filterCat, month, year]);

  // Timeline: today's events for the right panel
  const todayAllEvents = useMemo(
    () =>
      events
        .filter((e) => {
          const s = new Date(e.startDate);
          return (
            s.getDate() === today.getDate() &&
            s.getMonth() === today.getMonth() &&
            s.getFullYear() === today.getFullYear()
          );
        })
        .sort((a, b) => a.startDate - b.startDate),
    [events]
  );

  // Upcoming (future)
  const upcoming = useMemo(
    () =>
      events
        .filter((e) => e.startDate > Date.now())
        .sort((a, b) => a.startDate - b.startDate)
        .slice(0, 6),
    [events]
  );

  // Stats
  const cronCount = events.filter((e) => e.category === "cron").length;
  const taskCount = events.filter((e) => e.category === "task").length;
  const runningCount = events.filter((e) => e.status === "running").length;
  const completedCount = events.filter((e) => e.status === "completed").length;

  const nav = (dir: "prev" | "next") => {
    setCurrentDate((p) => {
      const d = new Date(p);
      d.setMonth(d.getMonth() + (dir === "prev" ? -1 : 1));
      return d;
    });
    setSelectedDay(null);
  };

  const fmtTime = (ts: number) =>
    new Date(ts).toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" });

  const fmtDate = (ts: number) =>
    new Date(ts).toLocaleDateString("ja-JP", { month: "short", day: "numeric" });

  return (
    <div className="p-4 md:p-6 min-h-screen">
      {/* Header */}
      <div className="mb-5">
        <h1 className="text-2xl md:text-3xl font-bold mb-1 flex items-center gap-2">
          <CalIcon className="w-7 h-7 text-blue-400" />
          カレンダー
        </h1>
        <p className="text-gray-400 text-sm">
          スケジュール・タスク・Cronジョブを一覧管理
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <MiniStat icon={<Timer className="w-4 h-4" />} label="タスク" value={taskCount} color="text-blue-400" />
        <MiniStat icon={<Repeat className="w-4 h-4" />} label="Cronジョブ" value={cronCount} color="text-violet-400" />
        <MiniStat icon={<Zap className="w-4 h-4" />} label="実行中" value={runningCount} color="text-amber-400" />
        <MiniStat icon={<CheckCircle2 className="w-4 h-4" />} label="完了" value={completedCount} color="text-green-400" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-5">
        {/* Calendar grid */}
        <div className="xl:col-span-3">
          <div className="bg-gray-900/60 border border-gray-800 rounded-xl overflow-hidden">
            {/* Month nav */}
            <div className="px-5 py-3 border-b border-gray-800 flex items-center justify-between">
              <h2 className="text-lg font-semibold">
                {year}年{monthNames[month]}
              </h2>
              <div className="flex items-center gap-1.5">
                <button onClick={() => nav("prev")} className="p-1.5 hover:bg-gray-800 rounded-lg">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setCurrentDate(new Date());
                    setSelectedDay(new Date().getDate());
                  }}
                  className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 rounded-lg"
                >
                  今日
                </button>
                <button onClick={() => nav("next")} className="p-1.5 hover:bg-gray-800 rounded-lg">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Category filter */}
            <div className="px-5 py-2 border-b border-gray-800/50 flex gap-1.5 flex-wrap">
              <FilterChip active={!filterCat} onClick={() => setFilterCat("")} label="すべて" />
              {(Object.keys(catConfig) as Event["category"][]).map((cat) => {
                const c = catConfig[cat];
                return (
                  <FilterChip
                    key={cat}
                    active={filterCat === cat}
                    onClick={() => setFilterCat(filterCat === cat ? "" : cat)}
                    label={c.label}
                    color={c.color}
                  />
                );
              })}
            </div>

            <div className="p-4">
              {/* Weekday headers */}
              <div className="grid grid-cols-7 gap-1 mb-1">
                {weekdays.map((d) => (
                  <div key={d} className="text-center text-xs font-medium text-gray-500 py-1">
                    {d}
                  </div>
                ))}
              </div>

              {/* Days */}
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, i) => {
                  if (!day)
                    return <div key={i} className="h-20 md:h-24" />;

                  let dayEvents = getEventsForDay(day);
                  if (filterCat) dayEvents = dayEvents.filter((e) => e.category === filterCat);
                  const current = isToday(day);
                  const selected = selectedDay === day;

                  return (
                    <div
                      key={day}
                      onClick={() => setSelectedDay(day)}
                      className={`h-20 md:h-24 p-1.5 rounded-lg border cursor-pointer transition-all ${
                        selected
                          ? "border-blue-500 bg-blue-500/10"
                          : current
                          ? "border-blue-700 bg-blue-900/30"
                          : "border-gray-800 hover:border-gray-700 hover:bg-gray-800/40"
                      }`}
                    >
                      <div
                        className={`text-xs font-medium mb-1 ${
                          current
                            ? "text-blue-300"
                            : selected
                            ? "text-white"
                            : "text-gray-400"
                        }`}
                      >
                        {current ? (
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white text-[10px]">
                            {day}
                          </span>
                        ) : (
                          day
                        )}
                      </div>
                      <div className="space-y-0.5 overflow-hidden">
                        {dayEvents.slice(0, 3).map((ev) => (
                          <div
                            key={ev._id}
                            className="text-[10px] leading-tight px-1 py-0.5 rounded truncate"
                            style={{
                              backgroundColor: ev.color + "25",
                              color: ev.color,
                            }}
                          >
                            {ev.category === "cron" && "⟳ "}
                            {ev.title}
                          </div>
                        ))}
                        {dayEvents.length > 3 && (
                          <div className="text-[10px] text-gray-600 pl-1">
                            +{dayEvents.length - 3}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Selected day detail */}
          {selectedDay && (
            <div className="mt-4 bg-gray-900/60 border border-gray-800 rounded-xl p-4">
              <h3 className="text-sm font-semibold mb-3 text-gray-300">
                {month + 1}月{selectedDay}日
                {isToday(selectedDay) && (
                  <span className="ml-2 text-xs text-blue-400 bg-blue-500/15 px-2 py-0.5 rounded-full">
                    今日
                  </span>
                )}
                <span className="ml-2 text-xs text-gray-600">{selectedDayEvents.length}件</span>
              </h3>

              {selectedDayEvents.length > 0 ? (
                <div className="space-y-2">
                  {selectedDayEvents.map((ev) => (
                    <EventRow
                      key={ev._id}
                      event={ev}
                      onClick={() => setSelectedEvent(ev)}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-600 py-4 text-center">この日のイベントはありません</p>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Running now */}
          {runningCount > 0 && (
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-blue-300 mb-2 flex items-center gap-1.5">
                <Loader2 className="w-4 h-4 animate-spin" style={{ animationDuration: "3s" }} />
                実行中
              </h3>
              <div className="space-y-2">
                {events
                  .filter((e) => e.status === "running")
                  .map((ev) => (
                    <EventRow key={ev._id} event={ev} compact onClick={() => setSelectedEvent(ev)} />
                  ))}
              </div>
            </div>
          )}

          {/* Upcoming */}
          <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-gray-300 mb-3">今後の予定</h3>
            {upcoming.length > 0 ? (
              <div className="space-y-2">
                {upcoming.map((ev) => (
                  <div
                    key={ev._id}
                    onClick={() => setSelectedEvent(ev)}
                    className="cursor-pointer group"
                  >
                    <div className="flex items-start gap-2">
                      <div
                        className="w-1 h-full min-h-[32px] rounded-full flex-shrink-0 mt-0.5"
                        style={{ backgroundColor: ev.color }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-white truncate group-hover:text-blue-300 transition-colors">
                          {ev.title}
                        </p>
                        <div className="flex items-center gap-2 text-[10px] text-gray-500 mt-0.5">
                          <span>{fmtDate(ev.startDate)}</span>
                          <span>{fmtTime(ev.startDate)}</span>
                          {ev.assignee && (
                            <span className="flex items-center gap-0.5">
                              {ev.assignee === "ai" ? <Bot className="w-3 h-3" /> : <User className="w-3 h-3" />}
                              {ev.assignee === "ai" ? "AI" : "Zak"}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-600">予定なし</p>
            )}
          </div>

          {/* Cron summary */}
          <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-1.5">
              <Repeat className="w-4 h-4 text-violet-400" />
              Cronジョブ
            </h3>
            {events.filter((e) => e.category === "cron").length > 0 ? (
              <div className="space-y-2">
                {events
                  .filter((e) => e.category === "cron")
                  .map((ev) => (
                    <div key={ev._id} className="flex items-center justify-between text-xs">
                      <span className="text-gray-300 truncate flex-1">{ev.title}</span>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {ev.recurring && (
                          <span className="text-violet-400 bg-violet-500/15 px-1.5 py-0.5 rounded text-[10px]">
                            {ev.recurring}
                          </span>
                        )}
                        {ev.status && (
                          <StatusDot status={ev.status} />
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-xs text-gray-600">Cronジョブなし</p>
            )}
          </div>

          {/* Legend */}
          <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-4">
            <h3 className="text-xs font-medium text-gray-500 mb-2">カテゴリ</h3>
            <div className="space-y-1.5">
              {(Object.entries(catConfig) as [Event["category"], typeof catConfig[Event["category"]]][]).map(
                ([key, cfg]) => {
                  const Icon = cfg.icon;
                  return (
                    <div key={key} className="flex items-center gap-2 text-xs">
                      <Icon className={`w-3.5 h-3.5 ${cfg.color}`} />
                      <span className="text-gray-400">{cfg.label}</span>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Event detail modal */}
      {selectedEvent && (
        <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}
    </div>
  );
}

/* ── Stat Card ────────────────────────────────────── */
function MiniStat({
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

/* ── Filter Chip ──────────────────────────────────── */
function FilterChip({
  active,
  onClick,
  label,
  color,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  color?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-2.5 py-1 text-[11px] rounded-full transition-colors ${
        active
          ? "bg-blue-600 text-white"
          : "bg-gray-800 text-gray-400 hover:bg-gray-700"
      }`}
    >
      {label}
    </button>
  );
}

/* ── Event Row ────────────────────────────────────── */
function EventRow({
  event,
  compact,
  onClick,
}: {
  event: Event;
  compact?: boolean;
  onClick?: () => void;
}) {
  const cat = catConfig[event.category];
  const CatIcon = cat.icon;
  const stat = event.status ? statusConfig[event.status] : null;
  const StatIcon = stat?.icon || Circle;

  const fmtTime = (ts: number) =>
    new Date(ts).toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" });

  return (
    <div
      onClick={onClick}
      className={`flex items-start gap-2.5 p-2.5 rounded-lg border border-gray-800 hover:border-gray-700 cursor-pointer transition-all group ${
        event.status === "running" ? "bg-blue-500/5" : "bg-gray-800/40"
      }`}
    >
      <div
        className="w-1 rounded-full flex-shrink-0 self-stretch min-h-[28px]"
        style={{ backgroundColor: event.color }}
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <CatIcon className={`w-3.5 h-3.5 flex-shrink-0 ${cat.color}`} />
          <span className="text-xs font-medium text-white truncate group-hover:text-blue-300 transition-colors">
            {event.title}
          </span>
        </div>
        {!compact && event.description && (
          <p className="text-[10px] text-gray-500 line-clamp-1 pl-5 mb-1">{event.description}</p>
        )}
        <div className="flex items-center gap-2 pl-5 text-[10px] text-gray-500">
          <span>{fmtTime(event.startDate)}</span>
          {event.recurring && (
            <span className="text-violet-400">⟳ {event.recurring}</span>
          )}
          {event.assignee && (
            <span className="flex items-center gap-0.5">
              {event.assignee === "ai" ? (
                <Bot className="w-3 h-3 text-violet-400" />
              ) : (
                <User className="w-3 h-3 text-cyan-400" />
              )}
              {event.assignee === "ai" ? "AI" : "Zak"}
            </span>
          )}
        </div>
      </div>
      {stat && (
        <div className="flex-shrink-0">
          <StatIcon
            className={`w-4 h-4 ${stat.color} ${
              event.status === "running" ? "animate-spin" : ""
            }`}
            style={event.status === "running" ? { animationDuration: "3s" } : {}}
          />
        </div>
      )}
    </div>
  );
}

/* ── Status Dot ───────────────────────────────────── */
function StatusDot({ status }: { status: string }) {
  const cfg = statusConfig[status];
  if (!cfg) return null;
  const Icon = cfg.icon;
  return (
    <Icon
      className={`w-3.5 h-3.5 ${cfg.color} ${status === "running" ? "animate-spin" : ""}`}
      style={status === "running" ? { animationDuration: "3s" } : {}}
    />
  );
}

/* ── Event Modal ──────────────────────────────────── */
function EventModal({ event, onClose }: { event: Event; onClose: () => void }) {
  const cat = catConfig[event.category];
  const CatIcon = cat.icon;
  const stat = event.status ? statusConfig[event.status] : null;

  const fmtFull = (ts: number) =>
    new Date(ts).toLocaleString("ja-JP", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-start justify-between px-5 py-4 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: event.color }}
            />
            <h2 className="text-lg font-bold text-white">{event.title}</h2>
          </div>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4 space-y-4">
          {event.description && (
            <p className="text-sm text-gray-300">{event.description}</p>
          )}

          <div className="grid grid-cols-2 gap-3 text-sm">
            {/* Category */}
            <div>
              <span className="text-xs text-gray-500 block mb-1">カテゴリ</span>
              <div className={`flex items-center gap-1.5 ${cat.color}`}>
                <CatIcon className="w-4 h-4" />
                {cat.label}
              </div>
            </div>

            {/* Status */}
            {stat && (
              <div>
                <span className="text-xs text-gray-500 block mb-1">ステータス</span>
                <div className={`flex items-center gap-1.5 ${stat.color}`}>
                  <stat.icon className="w-4 h-4" />
                  {stat.label}
                </div>
              </div>
            )}

            {/* Assignee */}
            {event.assignee && (
              <div>
                <span className="text-xs text-gray-500 block mb-1">担当者</span>
                <div className="flex items-center gap-1.5">
                  {event.assignee === "ai" ? (
                    <>
                      <Bot className="w-4 h-4 text-violet-400" />
                      <span className="text-violet-300">智代 (AI)</span>
                    </>
                  ) : (
                    <>
                      <User className="w-4 h-4 text-cyan-400" />
                      <span className="text-cyan-300">Zak</span>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Recurring */}
            {event.recurring && (
              <div>
                <span className="text-xs text-gray-500 block mb-1">繰り返し</span>
                <div className="flex items-center gap-1.5 text-violet-300">
                  <Repeat className="w-4 h-4" />
                  {event.recurring}
                </div>
              </div>
            )}
          </div>

          {/* Times */}
          <div className="bg-gray-800 rounded-lg p-3 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">開始</span>
              <span className="text-gray-200">{fmtFull(event.startDate)}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">終了</span>
              <span className="text-gray-200">{fmtFull(event.endDate)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-gray-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
}
