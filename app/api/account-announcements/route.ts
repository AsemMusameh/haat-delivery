import { NextRequest, NextResponse } from "next/server";
import { announcementsForUser, markAnnouncementsRead } from "@/lib/announcement-store";
import { sessionUser } from "@/lib/account-store";
import { demoAnnouncements } from "@/lib/demo-data";

const bearer = (request: NextRequest) => request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") || null;

export async function GET(request: NextRequest) {
  try {
    const userId = await sessionUser(bearer(request));
    if (!userId) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    return NextResponse.json({ announcements: await announcementsForUser(userId) }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "UNKNOWN_ERROR" }, { status: 500 }); }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await sessionUser(bearer(request));
    if (!userId) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    const body = await request.json() as { announcementId?: string; all?: boolean };
    const ids = body.all ? demoAnnouncements.map((item) => item.id) : body.announcementId ? [body.announcementId] : [];
    if (!ids.length) return NextResponse.json({ error: "MISSING_ID" }, { status: 422 });
    await markAnnouncementsRead(userId, ids);
    return NextResponse.json({ ok: true });
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "UNKNOWN_ERROR" }, { status: 500 }); }
}
