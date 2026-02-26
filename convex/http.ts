import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";
import { Id } from "./_generated/dataModel";

const http = httpRouter();

// GET /api/tasks/pending — returns pending AI tasks
http.route({
  path: "/api/tasks/pending",
  method: "GET",
  handler: httpAction(async (ctx) => {
    const tasks = await ctx.runQuery(api.tasks.pendingAI);
    return new Response(JSON.stringify(tasks), {
      headers: { "Content-Type": "application/json" },
    });
  }),
});

// POST /api/tasks/update — update task status/result from OpenClaw
// Body: { id, aiStatus, aiResult?, status? }
http.route({
  path: "/api/tasks/update",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const body = await request.json();
    const { id, aiStatus, aiResult, status } = body;

    if (!id || !aiStatus) {
      return new Response(JSON.stringify({ error: "id and aiStatus required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const updates: Record<string, unknown> = { aiStatus };
    if (aiResult !== undefined) updates.aiResult = aiResult;
    if (status !== undefined) updates.status = status;

    await ctx.runMutation(api.tasks.update, {
      id: id as Id<"tasks">,
      ...updates,
    } as any);

    return new Response(JSON.stringify({ ok: true }), {
      headers: { "Content-Type": "application/json" },
    });
  }),
});

// GET /api/notes — list all notes
http.route({
  path: "/api/notes",
  method: "GET",
  handler: httpAction(async (ctx) => {
    const notes = await ctx.runQuery(api.notes.list);
    return new Response(JSON.stringify(notes), {
      headers: { "Content-Type": "application/json" },
    });
  }),
});

// POST /api/notes — create a note
// Body: { title, content, tags? }
http.route({
  path: "/api/notes",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const body = await request.json();
    const { title, content, tags = [] } = body;
    if (!title || !content) {
      return new Response(JSON.stringify({ error: "title and content required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    const id = await ctx.runMutation(api.notes.create, { title, content, tags });
    return new Response(JSON.stringify({ ok: true, id }), {
      headers: { "Content-Type": "application/json" },
    });
  }),
});

// PATCH /api/notes — update a note
// Body: { id, title?, content?, tags? }
http.route({
  path: "/api/notes",
  method: "PATCH",
  handler: httpAction(async (ctx, request) => {
    const body = await request.json();
    const { id, ...updates } = body;
    if (!id) {
      return new Response(JSON.stringify({ error: "id required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    await ctx.runMutation(api.notes.update, { id, ...updates });
    return new Response(JSON.stringify({ ok: true }), {
      headers: { "Content-Type": "application/json" },
    });
  }),
});

// GET /api/notes/search?q=... — search notes
http.route({
  path: "/api/notes/search",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    const url = new URL(request.url);
    const q = url.searchParams.get("q") ?? "";
    const notes = await ctx.runQuery(api.notes.search, { query: q });
    return new Response(JSON.stringify(notes), {
      headers: { "Content-Type": "application/json" },
    });
  }),
});

// GET /api/tasks — list all tasks
http.route({
  path: "/api/tasks",
  method: "GET",
  handler: httpAction(async (ctx) => {
    const tasks = await ctx.runQuery(api.tasks.list);
    return new Response(JSON.stringify(tasks), {
      headers: { "Content-Type": "application/json" },
    });
  }),
});

// POST /api/tasks — create a task
// Body: { title, description?, status?, priority?, assignee? }
http.route({
  path: "/api/tasks",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const body = await request.json();
    const { title, description, status = "todo", priority = "medium", assignee = "ai" } = body;
    if (!title) {
      return new Response(JSON.stringify({ error: "title required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    const id = await ctx.runMutation(api.tasks.create, {
      title,
      description,
      status,
      priority,
      assignee,
      order: Date.now(),
    });
    return new Response(JSON.stringify({ ok: true, id }), {
      headers: { "Content-Type": "application/json" },
    });
  }),
});

export default http;
