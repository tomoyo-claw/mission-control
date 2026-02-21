import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Feature 1: Task Board
  tasks: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    status: v.union(v.literal("backlog"), v.literal("inprogress"), v.literal("review"), v.literal("done")),
    priority: v.union(v.literal("high"), v.literal("medium"), v.literal("low")),
    assigneeId: v.optional(v.id("users")),
    order: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }),

  // Feature 2: Calendar
  events: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    startDate: v.number(),
    endDate: v.number(),
    category: v.string(),
    color: v.string(),
    createdBy: v.id("users"),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_date_range", ["startDate", "endDate"]),

  // Feature 3: Memory Screen (Notes)
  notes: defineTable({
    title: v.string(),
    content: v.string(), // Markdown content
    tags: v.array(v.string()),
    createdBy: v.id("users"),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).searchIndex("search_notes", {
    searchField: "content",
    filterFields: ["createdBy"]
  }),

  // Feature 4: Team Screen
  users: defineTable({
    name: v.string(),
    email: v.string(),
    avatar: v.optional(v.string()),
    role: v.string(),
    status: v.union(v.literal("online"), v.literal("busy"), v.literal("away"), v.literal("offline")),
    lastActive: v.number(),
    bio: v.optional(v.string()),
    joinedAt: v.number(),
  }).index("by_status", ["status"]),

  // Performance metrics for users
  userMetrics: defineTable({
    userId: v.id("users"),
    tasksCompleted: v.number(),
    contentCreated: v.number(),
    weeklyGoal: v.number(),
    lastUpdated: v.number(),
  }).index("by_user", ["userId"]),

  // Feature 5: Content Pipeline
  content: defineTable({
    title: v.string(),
    type: v.union(v.literal("blog"), v.literal("tweet"), v.literal("video"), v.literal("article"), v.literal("podcast")),
    stage: v.union(v.literal("idea"), v.literal("draft"), v.literal("review"), v.literal("published")),
    description: v.optional(v.string()),
    assigneeId: v.optional(v.id("users")),
    dueDate: v.optional(v.number()),
    order: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_stage", ["stage"]),

  // Feature 6: Office Screen - Agent positions and activities
  agentPositions: defineTable({
    userId: v.id("users"),
    deskNumber: v.number(),
    x: v.number(),
    y: v.number(),
    currentActivity: v.optional(v.string()), // "typing", "thinking", "idle", etc.
    currentTask: v.optional(v.string()),
    lastActivityUpdate: v.number(),
  }).index("by_user", ["userId"]),

  // Activity logs for animations
  activityLogs: defineTable({
    userId: v.id("users"),
    activity: v.string(),
    description: v.optional(v.string()),
    timestamp: v.number(),
  }).index("by_user_time", ["userId", "timestamp"]),
});