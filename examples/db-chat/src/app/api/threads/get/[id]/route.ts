import { createDatabaseClient } from "@/lib/dbClient/server";

/**
 * GET /api/threads/get/:id
 *
 * Loads the message history for a single thread.
 * Returns an array of OpenAI-format messages so that
 * openAIMessageFormat.fromApi() can deserialise them correctly.
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const dbClient = await createDatabaseClient();

  const {
    data: { user },
  } = await dbClient.auth.getUser();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Confirm the thread belongs to the requesting user before returning messages.
  const { data: thread } = await dbClient
    .from("threads")
    .select("id")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!thread) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const { data: messages, error } = await dbClient
    .from("messages")
    .select("role, content, tool_calls, tool_call_id, name")
    .eq("thread_id", id)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("[threads/get/:id]", error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }

  // Return in OpenAI chat format; omit null fields so the shape stays clean.
  return Response.json(
    (messages ?? []).map((m) => ({
      role: m.role,
      content: m.content,
      ...(m.tool_calls ? { tool_calls: m.tool_calls } : {}),
      ...(m.tool_call_id ? { tool_call_id: m.tool_call_id } : {}),
      ...(m.name ? { name: m.name } : {}),
    })),
  );
}
