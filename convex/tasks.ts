import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Query all tasks
export const getTasks = query({
  handler: async (ctx) => {
    const tasks = await ctx.db.query("tasks").order("asc").collect();
    
    // Get assignee information for each task
    const tasksWithAssignees = await Promise.all(
      tasks.map(async (task) => {
        if (task.assigneeId) {
          const assignee = await ctx.db.get(task.assigneeId);
          return { ...task, assignee };
        }
        return { ...task, assignee: null };
      })
    );
    
    return tasksWithAssignees;
  },
});

// Create a new task
export const createTask = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    status: v.union(v.literal("backlog"), v.literal("inprogress"), v.literal("review"), v.literal("done")),
    priority: v.union(v.literal("high"), v.literal("medium"), v.literal("low")),
    assigneeId: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    // Get the current max order for the status column
    const tasksInStatus = await ctx.db
      .query("tasks")
      .filter((q) => q.eq(q.field("status"), args.status))
      .collect();
    
    const maxOrder = Math.max(...tasksInStatus.map(t => t.order), 0);
    
    const now = Date.now();
    return await ctx.db.insert("tasks", {
      ...args,
      order: maxOrder + 1,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Update task status (for drag and drop)
export const updateTaskStatus = mutation({
  args: {
    id: v.id("tasks"),
    status: v.union(v.literal("backlog"), v.literal("inprogress"), v.literal("review"), v.literal("done")),
    order: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.id, {
      status: args.status,
      order: args.order,
      updatedAt: Date.now(),
    });
  },
});

// Update task
export const updateTask = mutation({
  args: {
    id: v.id("tasks"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    priority: v.optional(v.union(v.literal("high"), v.literal("medium"), v.literal("low"))),
    assigneeId: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    return await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});

// Delete task
export const deleteTask = mutation({
  args: { id: v.id("tasks") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});