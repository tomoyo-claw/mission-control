import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Query all content
export const getContent = query({
  handler: async (ctx) => {
    const content = await ctx.db.query("content").order("asc").collect();
    
    // Get assignee information for each content
    const contentWithAssignees = await Promise.all(
      content.map(async (item) => {
        if (item.assigneeId) {
          const assignee = await ctx.db.get(item.assigneeId);
          return { ...item, assignee };
        }
        return { ...item, assignee: null };
      })
    );
    
    return contentWithAssignees;
  },
});

// Get content by stage
export const getContentByStage = query({
  args: {
    stage: v.union(v.literal("idea"), v.literal("draft"), v.literal("review"), v.literal("published")),
  },
  handler: async (ctx, args) => {
    const content = await ctx.db
      .query("content")
      .withIndex("by_stage", (q) => q.eq("stage", args.stage))
      .order("asc")
      .collect();
    
    const contentWithAssignees = await Promise.all(
      content.map(async (item) => {
        if (item.assigneeId) {
          const assignee = await ctx.db.get(item.assigneeId);
          return { ...item, assignee };
        }
        return { ...item, assignee: null };
      })
    );
    
    return contentWithAssignees;
  },
});

// Get overdue content
export const getOverdueContent = query({
  handler: async (ctx) => {
    const now = Date.now();
    const content = await ctx.db
      .query("content")
      .filter((q) => 
        q.and(
          q.neq(q.field("stage"), "published"),
          q.lt(q.field("dueDate"), now)
        )
      )
      .collect();
    
    const contentWithAssignees = await Promise.all(
      content.map(async (item) => {
        if (item.assigneeId) {
          const assignee = await ctx.db.get(item.assigneeId);
          return { ...item, assignee };
        }
        return { ...item, assignee: null };
      })
    );
    
    return contentWithAssignees;
  },
});

// Create new content
export const createContent = mutation({
  args: {
    title: v.string(),
    type: v.union(v.literal("blog"), v.literal("tweet"), v.literal("video"), v.literal("article"), v.literal("podcast")),
    stage: v.union(v.literal("idea"), v.literal("draft"), v.literal("review"), v.literal("published")),
    description: v.optional(v.string()),
    assigneeId: v.optional(v.id("users")),
    dueDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Get the current max order for the stage column
    const contentInStage = await ctx.db
      .query("content")
      .withIndex("by_stage", (q) => q.eq("stage", args.stage))
      .collect();
    
    const maxOrder = Math.max(...contentInStage.map(c => c.order), 0);
    
    const now = Date.now();
    return await ctx.db.insert("content", {
      ...args,
      order: maxOrder + 1,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Update content stage
export const updateContentStage = mutation({
  args: {
    id: v.id("content"),
    stage: v.union(v.literal("idea"), v.literal("draft"), v.literal("review"), v.literal("published")),
    order: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.id, {
      stage: args.stage,
      order: args.order,
      updatedAt: Date.now(),
    });
  },
});

// Update content
export const updateContent = mutation({
  args: {
    id: v.id("content"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    type: v.optional(v.union(v.literal("blog"), v.literal("tweet"), v.literal("video"), v.literal("article"), v.literal("podcast"))),
    assigneeId: v.optional(v.id("users")),
    dueDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    return await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});

// Delete content
export const deleteContent = mutation({
  args: { id: v.id("content") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});

// Get content stats
export const getContentStats = query({
  handler: async (ctx) => {
    const allContent = await ctx.db.query("content").collect();
    
    const stats = {
      total: allContent.length,
      byStage: {
        idea: allContent.filter(c => c.stage === "idea").length,
        draft: allContent.filter(c => c.stage === "draft").length,
        review: allContent.filter(c => c.stage === "review").length,
        published: allContent.filter(c => c.stage === "published").length,
      },
      byType: {
        blog: allContent.filter(c => c.type === "blog").length,
        tweet: allContent.filter(c => c.type === "tweet").length,
        video: allContent.filter(c => c.type === "video").length,
        article: allContent.filter(c => c.type === "article").length,
        podcast: allContent.filter(c => c.type === "podcast").length,
      },
      overdue: allContent.filter(c => 
        c.dueDate && c.dueDate < Date.now() && c.stage !== "published"
      ).length,
    };
    
    return stats;
  },
});