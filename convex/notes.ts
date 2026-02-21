import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Query all notes
export const getNotes = query({
  handler: async (ctx) => {
    const notes = await ctx.db
      .query("notes")
      .order("desc")
      .collect();
    
    // Get creator information for each note
    const notesWithCreators = await Promise.all(
      notes.map(async (note) => {
        const creator = await ctx.db.get(note.createdBy);
        return { ...note, creator };
      })
    );
    
    return notesWithCreators;
  },
});

// Search notes
export const searchNotes = query({
  args: {
    query: v.string(),
    createdBy: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    const searchResults = await ctx.db
      .query("notes")
      .withSearchIndex("search_notes", (q) => {
        let query = q.search("content", args.query);
        if (args.createdBy) {
          query = query.eq("createdBy", args.createdBy);
        }
        return query;
      })
      .collect();
    
    // Get creator information for each note
    const notesWithCreators = await Promise.all(
      searchResults.map(async (note) => {
        const creator = await ctx.db.get(note.createdBy);
        return { ...note, creator };
      })
    );
    
    return notesWithCreators;
  },
});

// Get notes by tag
export const getNotesByTag = query({
  args: { tag: v.string() },
  handler: async (ctx, args) => {
    const notes = await ctx.db
      .query("notes")
      .filter((q) => q.any(q.field("tags"), (tag) => q.eq(tag, args.tag)))
      .order("desc")
      .collect();
    
    const notesWithCreators = await Promise.all(
      notes.map(async (note) => {
        const creator = await ctx.db.get(note.createdBy);
        return { ...note, creator };
      })
    );
    
    return notesWithCreators;
  },
});

// Get all unique tags
export const getAllTags = query({
  handler: async (ctx) => {
    const notes = await ctx.db.query("notes").collect();
    const allTags = notes.flatMap(note => note.tags);
    const uniqueTags = Array.from(new Set(allTags));
    
    // Count frequency of each tag
    const tagCounts = uniqueTags.map(tag => ({
      tag,
      count: allTags.filter(t => t === tag).length
    }));
    
    return tagCounts.sort((a, b) => b.count - a.count);
  },
});

// Create a new note
export const createNote = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    tags: v.array(v.string()),
    createdBy: v.id("users"),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("notes", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Update a note
export const updateNote = mutation({
  args: {
    id: v.id("notes"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    return await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});

// Delete a note
export const deleteNote = mutation({
  args: { id: v.id("notes") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});

// Get note by ID
export const getNote = query({
  args: { id: v.id("notes") },
  handler: async (ctx, args) => {
    const note = await ctx.db.get(args.id);
    if (!note) return null;
    
    const creator = await ctx.db.get(note.createdBy);
    return { ...note, creator };
  },
});