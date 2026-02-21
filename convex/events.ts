import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("events").collect();
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    startDate: v.number(),
    endDate: v.number(),
    category: v.union(v.literal("task"), v.literal("cron"), v.literal("meeting"), v.literal("reminder"), v.literal("milestone")),
    color: v.string(),
    assignee: v.optional(v.union(v.literal("zak"), v.literal("ai"))),
    status: v.optional(v.union(v.literal("scheduled"), v.literal("running"), v.literal("completed"), v.literal("failed"))),
    recurring: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("events", args);
  },
});

export const update = mutation({
  args: {
    id: v.id("events"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
    category: v.optional(v.union(v.literal("task"), v.literal("cron"), v.literal("meeting"), v.literal("reminder"), v.literal("milestone"))),
    color: v.optional(v.string()),
    assignee: v.optional(v.union(v.literal("zak"), v.literal("ai"))),
    status: v.optional(v.union(v.literal("scheduled"), v.literal("running"), v.literal("completed"), v.literal("failed"))),
    recurring: v.optional(v.string()),
  },
  handler: async (ctx, { id, ...updates }) => {
    const filtered = Object.fromEntries(
      Object.entries(updates).filter(([_, v]) => v !== undefined)
    );
    await ctx.db.patch(id, filtered);
  },
});

export const remove = mutation({
  args: { id: v.id("events") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});
