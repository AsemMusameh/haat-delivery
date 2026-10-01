import { NextRequest, NextResponse } from "next/server";
import { getPhone, savePhone, sessionUser } from "@/lib/account-store";

const userFrom = (request: NextRequest) => sessionUser(request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") || null);

export async function GET(request: NextRequest) {
  const userId = await userFrom(request);
  if (!userId) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  return NextResponse.json({ phone: await getPhone(userId) });
}

export async function PATCH(request: NextRequest) {
  const userId = await userFrom(request);
  if (!userId) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  const body = await request.json() as { phone?: string };
  const phone = String(body.phone ?? "").trim();
  if (phone.length > 30 || (phone && !/^[+\d\s()-]+$/.test(phone))) return NextResponse.json({ error: "رقم الهاتف غير صالح" }, { status: 422 });
  await savePhone(userId, phone);
  return NextResponse.json({ ok: true, phone });
}
