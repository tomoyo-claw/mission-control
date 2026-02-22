# clearAll Mutation + Bulk Delete Button Design Spec
_Researched by Codex, implemented by Claude_

## 1. Current State
- `convex/tasks.ts` has: `list`, `pendingAI`, `create`, `update`, `remove` (single by id)
- `src/app/tasks/page.tsx` uses `useMutation(api.tasks.remove)` for per-card delete
- Delete button appears on card hover with a confirmation state (trash icon → confirm)
- Header area has: title "Tasks", stats bar, "+ Add Task" button
- Style pattern: danger actions use `text-red-400 hover:text-red-300`

## 2. What to Add

### `convex/tasks.ts` — new clearAll mutation
```ts
export const clearAll = mutation({
  args: {},
  handler: async (ctx) => {
    const tasks = await ctx.db.query("tasks").collect();
    await Promise.all(tasks.map(task => ctx.db.delete(task._id)));
    return tasks.length;
  },
});
```

### `src/app/tasks/page.tsx` — Clear All button
- Import: `useMutation(api.tasks.clearAll)`
- Add button in header, next to "Add Task" button
- Only visible when `tasks.length > 0`
- On click: `window.confirm('全タスクを削除しますか？この操作は取り消せません。')` then call mutation
- Style: `text-red-400 hover:text-red-300 border border-red-800 hover:border-red-600 px-3 py-1.5 rounded text-sm flex items-center gap-1.5`
- Icon: `<Trash2 size={14} />`
- Label: "Clear All"

## 3. Files to Change
1. `convex/tasks.ts` — add clearAll mutation
2. `src/app/tasks/page.tsx` — add button + import + mutation hook

## 4. Implementation Steps
1. Add `clearAll` mutation at end of `convex/tasks.ts`
2. In page.tsx: add `useMutation(api.tasks.clearAll)` hook
3. Add button in JSX header section, conditionally rendered
4. Commit: `feat(tasks): add clearAll mutation and bulk delete button`
