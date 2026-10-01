import { NextResponse } from "next/server";
import { recordSmsReminder, unreadSmsCandidates } from "@/lib/announcement-store";
import { sendUnreadAnnouncementSms, smsConfigured } from "@/lib/sms-reminders";

export async function GET(request: Request) {
  if (!process.env.CRON_SECRET || request.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const reminderHours = Math.max(1, Number(process.env.UNREAD_REMINDER_HOURS || 24));
  const cutoff = new Date(Date.now() - reminderHours * 3_600_000).toISOString();
  const candidates = await unreadSmsCandidates(cutoff);
  if (!smsConfigured()) return NextResponse.json({ providerConfigured: false, pending: candidates.length, reminderHours });
  let sent = 0;
  let failed = 0;
  for (const candidate of candidates) {
    try {
      await sendUnreadAnnouncementSms(candidate.phone, candidate.title);
      await recordSmsReminder({ ...candidate, status: "sent" });
      sent += 1;
    } catch (error) {
      await recordSmsReminder({ ...candidate, status: "failed", error: error instanceof Error ? error.message : "UNKNOWN_ERROR" });
      failed += 1;
    }
  }
  return NextResponse.json({ providerConfigured: true, candidates: candidates.length, sent, failed, reminderHours });
}
