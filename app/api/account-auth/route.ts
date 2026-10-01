import { NextRequest, NextResponse } from "next/server";
import { changePassword, createSession, revokeSession, sessionUser, verifyPassword } from "@/lib/account-store";
import { demoEmployees } from "@/lib/demo-data";

const bearer = (request: NextRequest) => request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") || null;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { identifier?: string; password?: string };
    const identifier = body.identifier?.trim().toLowerCase();
    const account = demoEmployees.find((employee) => employee.email.toLowerCase() === identifier || employee.employee_id.toLowerCase() === identifier);
    if (!account || !body.password || !(await verifyPassword(account.id, body.password))) return NextResponse.json({ error: "البريد أو كلمة المرور غير صحيحة" }, { status: 401 });
    const token = await createSession(account.id);
    return NextResponse.json({ token, userId: account.id, role: account.role });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "تعذر تسجيل الدخول" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const userId = await sessionUser(bearer(request));
    if (!userId) return NextResponse.json({ error: "انتهت الجلسة، سجّل الدخول من جديد" }, { status: 401 });
    const body = await request.json() as { password?: string };
    if (!body.password || body.password.length < 8) return NextResponse.json({ error: "كلمة المرور يجب أن تتكون من 8 أحرف على الأقل" }, { status: 422 });
    await changePassword(userId, body.password);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "تعذر تغيير كلمة المرور" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  await revokeSession(bearer(request));
  return NextResponse.json({ ok: true });
}
