import { deleteContent, listContent, saveReply, saveTool } from "@/lib/content-store";
import { requirePublisher } from "@/lib/supabase/server";
import type { ReplyTemplate, WorkTool } from "@/lib/content-defaults";

const json = (data: unknown, status = 200) => Response.json(data, { status, headers: { "Cache-Control": "no-store" } });

async function requireManager() {
  const publisher = await requirePublisher();
  if (!publisher) throw new Error("UNAUTHORIZED");
  if (!['manager', 'admin'].includes(String(publisher.profile.role))) throw new Error("FORBIDDEN");
}

function errorResponse(error: unknown) {
  const message = error instanceof Error ? error.message : "UNKNOWN_ERROR";
  if (message === "UNAUTHORIZED") return json({ error: "يجب تسجيل الدخول كمدير" }, 401);
  if (message === "FORBIDDEN") return json({ error: "هذه العملية متاحة للمدير فقط" }, 403);
  return json({ error: "تعذر حفظ التغييرات حاليًا" }, 500);
}

export async function GET(request: Request) {
  try {
    const includeInactive = new URL(request.url).searchParams.get("admin") === "1";
    if (includeInactive) await requireManager();
    return json(await listContent(includeInactive));
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PUT(request: Request) {
  try {
    await requireManager();
    const body = await request.json() as { kind?: string; item?: WorkTool | ReplyTemplate };
    if (!body.item || !body.kind) return json({ error: "بيانات غير مكتملة" }, 400);
    if (body.kind === "tool") await saveTool(body.item as WorkTool);
    else if (body.kind === "reply") await saveReply(body.item as ReplyTemplate);
    else return json({ error: "نوع غير صالح" }, 400);
    return json({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(request: Request) {
  try {
    await requireManager();
    const params = new URL(request.url).searchParams;
    const kind = params.get("kind");
    const id = params.get("id");
    if ((kind !== "tool" && kind !== "reply") || !id) return json({ error: "بيانات غير مكتملة" }, 400);
    await deleteContent(kind, id);
    return json({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
}
