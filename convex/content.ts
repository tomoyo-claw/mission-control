import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("content").collect();
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    type: v.union(v.literal("blog"), v.literal("tweet"), v.literal("video"), v.literal("article"), v.literal("podcast")),
    stage: v.union(v.literal("ideas"), v.literal("script"), v.literal("thumbnail"), v.literal("filming"), v.literal("editing"), v.literal("published")),
    description: v.optional(v.string()),
    script: v.optional(v.string()),
    thumbnailUrl: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    assignee: v.optional(v.union(v.literal("zak"), v.literal("ai"))),
    order: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("content", args);
  },
});

export const update = mutation({
  args: {
    id: v.id("content"),
    title: v.optional(v.string()),
    type: v.optional(v.union(v.literal("blog"), v.literal("tweet"), v.literal("video"), v.literal("article"), v.literal("podcast"))),
    stage: v.optional(v.union(v.literal("ideas"), v.literal("script"), v.literal("thumbnail"), v.literal("filming"), v.literal("editing"), v.literal("published"))),
    description: v.optional(v.string()),
    script: v.optional(v.string()),
    thumbnailUrl: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    assignee: v.optional(v.union(v.literal("zak"), v.literal("ai"))),
    order: v.optional(v.number()),
  },
  handler: async (ctx, { id, ...updates }) => {
    const filtered = Object.fromEntries(
      Object.entries(updates).filter(([_, v]) => v !== undefined)
    );
    await ctx.db.patch(id, filtered);
  },
});

export const remove = mutation({
  args: { id: v.id("content") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});
