import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Query events within a date range
export const getEvents = query({
  args: {
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let eventsQuery = ctx.db.query("events");
    
    // If date range is provided, filter by it
    if (args.startDate && args.endDate) {
      eventsQuery = eventsQuery.withIndex("by_date_range", (q) =>
        q.gte("startDate", args.startDate).lte("endDate", args.endDate)
      );
    }
    
    const events = await eventsQuery.order("asc").collect();
    
    // Get creator information for each event
    const eventsWithCreators = await Promise.all(
      events.map(async (event) => {
        const creator = await ctx.db.get(event.createdBy);
        return { ...event, creator };
      })
    );
    
    return eventsWithCreators;
  },
});

// Create a new event
export const createEvent = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    startDate: v.number(),
    endDate: v.number(),
    category: v.string(),
    color: v.string(),
    createdBy: v.id("users"),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("events", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Update an event
export const updateEvent = mutation({
  args: {
    id: v.id("events"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
    category: v.optional(v.string()),
    color: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    return await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});

// Delete an event
export const deleteEvent = mutation({
  args: { id: v.id("events") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});

// Get events for today
export const getTodaysEvents = query({
  handler: async (ctx) => {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
    const endOfDay = startOfDay + 24 * 60 * 60 * 1000 - 1;
    
    const events = await ctx.db
      .query("events")
      .withIndex("by_date_range", (q) =>
        q.gte("startDate", startOfDay).lte("startDate", endOfDay)
      )
      .collect();
    
    const eventsWithCreators = await Promise.all(
      events.map(async (event) => {
        const creator = await ctx.db.get(event.createdBy);
        return { ...event, creator };
      })
    );
    
    return eventsWithCreators;
  },
});

// Get upcoming events (next 7 days)
export const getUpcomingEvents = query({
  handler: async (ctx) => {
    const now = Date.now();
    const weekFromNow = now + (7 * 24 * 60 * 60 * 1000);
    
    const events = await ctx.db
      .query("events")
      .withIndex("by_date_range", (q) =>
        q.gte("startDate", now).lte("startDate", weekFromNow)
      )
      .order("asc")
      .collect();
    
    const eventsWithCreators = await Promise.all(
      events.map(async (event) => {
        const creator = await ctx.db.get(event.createdBy);
        return { ...event, creator };
      })
    );
    
    return eventsWithCreators;
  },
});