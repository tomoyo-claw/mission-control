import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Query all users
export const getUsers = query({
  handler: async (ctx) => {
    const users = await ctx.db.query("users").order("asc").collect();
    
    // Get metrics for each user
    const usersWithMetrics = await Promise.all(
      users.map(async (user) => {
        const metrics = await ctx.db
          .query("userMetrics")
          .withIndex("by_user", (q) => q.eq("userId", user._id))
          .first();
        return { ...user, metrics };
      })
    );
    
    return usersWithMetrics;
  },
});

// Get user by ID
export const getUser = query({
  args: { id: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Create a new user
export const createUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    avatar: v.optional(v.string()),
    role: v.string(),
    bio: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const userId = await ctx.db.insert("users", {
      ...args,
      status: "offline",
      lastActive: now,
      joinedAt: now,
    });
    
    // Create initial metrics
    await ctx.db.insert("userMetrics", {
      userId,
      tasksCompleted: 0,
      contentCreated: 0,
      weeklyGoal: 5,
      lastUpdated: now,
    });
    
    return userId;
  },
});

// Update user status
export const updateUserStatus = mutation({
  args: {
    id: v.id("users"),
    status: v.union(v.literal("online"), v.literal("busy"), v.literal("away"), v.literal("offline")),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.id, {
      status: args.status,
      lastActive: Date.now(),
    });
  },
});

// Update user profile
export const updateUser = mutation({
  args: {
    id: v.id("users"),
    name: v.optional(v.string()),
    role: v.optional(v.string()),
    bio: v.optional(v.string()),
    avatar: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    return await ctx.db.patch(id, updates);
  },
});

// Get agent positions for office screen
export const getAgentPositions = query({
  handler: async (ctx) => {
    const positions = await ctx.db.query("agentPositions").collect();
    
    const positionsWithUsers = await Promise.all(
      positions.map(async (position) => {
        const user = await ctx.db.get(position.userId);
        return { ...position, user };
      })
    );
    
    return positionsWithUsers;
  },
});

// Update agent position
export const updateAgentPosition = mutation({
  args: {
    userId: v.id("users"),
    deskNumber: v.optional(v.number()),
    x: v.optional(v.number()),
    y: v.optional(v.number()),
    currentActivity: v.optional(v.string()),
    currentTask: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { userId, ...updates } = args;
    
    const existingPosition = await ctx.db
      .query("agentPositions")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
    
    const now = Date.now();
    
    if (existingPosition) {
      return await ctx.db.patch(existingPosition._id, {
        ...updates,
        lastActivityUpdate: now,
      });
    } else {
      return await ctx.db.insert("agentPositions", {
        userId,
        deskNumber: updates.deskNumber || 1,
        x: updates.x || 100,
        y: updates.y || 100,
        currentActivity: updates.currentActivity || "idle",
        currentTask: updates.currentTask,
        lastActivityUpdate: now,
      });
    }
  },
});