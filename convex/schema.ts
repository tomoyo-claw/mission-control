import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  tasks: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    status: v.union(v.literal("todo"), v.literal("inprogress"), v.literal("done")),
    priority: v.union(v.literal("high"), v.literal("medium"), v.literal("low")),
    assignee: v.union(v.literal("zak"), v.literal("ai")),
    order: v.number(),
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
  }).index("by_status", ["status"])
    .index("by_aiStatus", ["aiStatus"]),

  events: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    startDate: v.number(),
    endDate: v.number(),
    category: v.union(
      v.literal("task"),
      v.literal("cron"),
      v.literal("meeting"),
      v.literal("reminder"),
      v.literal("milestone")
    ),
    color: v.string(),
    assignee: v.optional(v.union(v.literal("zak"), v.literal("ai"))),
    status: v.optional(
      v.union(
        v.literal("scheduled"),
        v.literal("running"),
        v.literal("completed"),
        v.literal("failed")
      )
    ),
    recurring: v.optional(v.string()),
  }).index("by_start", ["startDate"]),

  notes: defineTable({
    title: v.string(),
    content: v.string(),
    tags: v.array(v.string()),
  }).searchIndex("search_notes", {
    searchField: "content",
  }),

  content: defineTable({
    title: v.string(),
    type: v.union(
      v.literal("blog"),
      v.literal("tweet"),
      v.literal("video"),
      v.literal("article"),
      v.literal("podcast")
    ),
    stage: v.union(
      v.literal("ideas"),
      v.literal("script"),
      v.literal("thumbnail"),
      v.literal("filming"),
      v.literal("editing"),
      v.literal("published")
    ),
    description: v.optional(v.string()),
    script: v.optional(v.string()),
    thumbnailUrl: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    assignee: v.optional(v.union(v.literal("zak"), v.literal("ai"))),
    order: v.number(),
  }).index("by_stage", ["stage"]),
});
