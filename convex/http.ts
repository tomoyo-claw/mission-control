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

export default http;
