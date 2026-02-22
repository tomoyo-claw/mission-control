# Task Search & Filter Design Spec
_Researched by Codex/Tomoyo, implemented by Claude_

## 1. Current State
- `src/app/tasks/page.tsx` — client component, tasks from `useMockData()` hook
- Kanban board with 3 columns: todo / inprogress / done
- No search or filter functionality
- `Task` type has: title, description, status, priority, assignee, order

## 2. What to Add

### Search bar + filter controls (add below the existing header/stats bar)
```tsx
<div className="flex gap-2 mb-4">
  {/* Search */}
  <input
    type="text" placeholder="タスクを検索..."
    value={search} onChange={e => setSearch(e.target.value)}
    className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-gray-500"
  />
  {/* Assignee filter */}
  <select value={filterAssignee} onChange={e => setFilterAssignee(e.target.value)}
    className="bg-gray-800 border border-gray-700 rounded-lg px-2 py-1.5 text-sm text-gray-300 focus:outline-none">
    <option value="">全員</option>
    <option value="ai">AI</option>
    <option value="zak">Zak</option>
  </select>
  {/* Priority filter */}
  <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)}
    className="bg-gray-800 border border-gray-700 rounded-lg px-2 py-1.5 text-sm text-gray-300 focus:outline-none">
    <option value="">全優先度</option>
    <option value="high">High</option>
    <option value="medium">Medium</option>
    <option value="low">Low</option>
  </select>
</div>
```

### State
```ts
const [search, setSearch] = useState("")
const [filterAssignee, setFilterAssignee] = useState("")
const [filterPriority, setFilterPriority] = useState("")
```

### Filtered tasks
Replace direct usage of `tasks` array for column rendering with:
```ts
const filteredTasks = tasks.filter(t => {
  if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false
  if (filterAssignee && t.assignee !== filterAssignee) return false
  if (filterPriority && t.priority !== filterPriority) return false
  return true
})
```
Use `filteredTasks` when mapping tasks into columns.

## 3. Files to Change
1. `src/app/tasks/page.tsx` — add state, filter bar UI, filtered tasks logic

## 4. Implementation Notes
- Keep the kanban board structure intact — just filter what's shown in each column
- Show a "X件表示中" count when filters are active
- No URL params needed for now (keep it simple, client-side only)
- Commit: `feat(tasks): add search and filter bar to tasks page`
