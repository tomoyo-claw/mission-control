import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("tasks").collect();
  },
});

export const pendingAI = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("tasks")
      .withIndex("by_aiStatus", (q) => q.eq("aiStatus", "pending"))
      .collect();
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    status: v.union(v.literal("todo"), v.literal("inprogress"), v.literal("done")),
    priority: v.union(v.literal("high"), v.literal("medium"), v.literal("low")),
    assignee: v.union(v.literal("zak"), v.literal("ai")),
    order: v.number(),
    dueDate: v.optional(v.number()),
    prompt: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("tasks", {
      ...args,
      aiStatus: "idle",
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("tasks"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    status: v.optional(v.union(v.literal("todo"), v.literal("inprogress"), v.literal("done"))),
    priority: v.optional(v.union(v.literal("high"), v.literal("medium"), v.literal("low"))),
    assignee: v.optional(v.union(v.literal("zak"), v.literal("ai"))),
    order: v.optional(v.number()),
    dueDate: v.optional(v.number()),
    prompt: v.optional(v.string()),
    aiStatus: v.optional(
      v.union(
        v.literal("idle"),
        v.literal("pending"),
        v.literal("running"),
        v.literal("completed"),
        v.literal("failed")
      )
    ),
    aiResult: v.optional(v.string()),
  },
  handler: async (ctx, { id, ...updates }) => {
    const filtered = Object.fromEntries(
      Object.entries(updates).filter(([_, v]) => v !== undefined)
    );
    await ctx.db.patch(id, filtered);
  },
});

export const remove = mutation({
  args: { id: v.id("tasks") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});

export const clearAll = mutation({
  args: {},
  handler: async (ctx) => {
    const tasks = await ctx.db.query("tasks").collect();
    await Promise.all(tasks.map(task => ctx.db.delete(task._id)));
    return tasks.length;
  },
});
