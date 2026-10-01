import { demoAnnouncements } from "@/lib/demo-data";

const database = () => {
  const runtime = (globalThis as typeof globalThis & { __HAAT_WORKER_ENV__?: { DB?: D1Database } }).__HAAT_WORKER_ENV__;
  if (!runtime?.DB) throw new Error("ANNOUNCEMENTS_DB_UNAVAILABLE");
  return runtime.DB;
};

export async function ensureAnnouncementStore() {
  const db = database();
  await db.batch([
    db.prepare(`CREATE TABLE IF NOT EXISTS portal_announcement_reads (
      announcement_id TEXT NOT NULL,user_id TEXT NOT NULL,read_at TEXT NOT NULL,
      PRIMARY KEY (announcement_id,user_id))`),
    db.prepare("CREATE INDEX IF NOT EXISTS portal_announcement_reads_user_idx ON portal_announcement_reads (user_id,read_at DESC)"),
    db.prepare(`CREATE TABLE IF NOT EXISTS portal_sms_reminders (
      announcement_id TEXT NOT NULL,user_id TEXT NOT NULL,phone TEXT,status TEXT NOT NULL,error_message TEXT,sent_at TEXT NOT NULL,
      PRIMARY KEY (announcement_id,user_id))`),
  ]);
}

export async function announcementsForUser(userId: string) {
  await ensureAnnouncementStore();
  const result = await database().prepare("SELECT announcement_id announcementId,read_at readAt FROM portal_announcement_reads WHERE user_id=?").bind(userId).all<{ announcementId: string; readAt: string }>();
  const reads = new Map((result.results || []).map((row) => [row.announcementId, row.readAt]));
  return demoAnnouncements.map((item) => ({ ...item, is_read: reads.has(item.id), read_at: reads.get(item.id) }));
}

export async function markAnnouncementsRead(userId: string, announcementIds: string[]) {
  await ensureAnnouncementStore();
  const valid = announcementIds.filter((id) => demoAnnouncements.some((announcement) => announcement.id === id));
  if (!valid.length) return;
  const stamp = new Date().toISOString();
  await database().batch(valid.map((id) => database().prepare(`INSERT INTO portal_announcement_reads (announcement_id,user_id,read_at)
    VALUES (?,?,?) ON CONFLICT(announcement_id,user_id) DO UPDATE SET read_at=excluded.read_at`).bind(id,userId,stamp)));
}

export async function unreadSmsCandidates(cutoffIso: string) {
  await ensureAnnouncementStore();
  const eligible = demoAnnouncements.filter((announcement) => announcement.requires_acknowledgement && announcement.published_at <= cutoffIso);
  const candidates: { announcementId: string; title: string; userId: string; phone: string }[] = [];
  for (const announcement of eligible) {
    const result = await database().prepare(`SELECT p.user_id userId,p.phone phone FROM portal_profiles p
      LEFT JOIN portal_announcement_reads r ON r.user_id=p.user_id AND r.announcement_id=?
      LEFT JOIN portal_sms_reminders s ON s.user_id=p.user_id AND s.announcement_id=?
      WHERE p.phone IS NOT NULL AND TRIM(p.phone)<>'' AND r.user_id IS NULL AND (s.user_id IS NULL OR s.status='failed')`).bind(announcement.id,announcement.id).all<{ userId: string; phone: string }>();
    for (const row of result.results || []) candidates.push({ announcementId: announcement.id, title: announcement.title, userId: row.userId, phone: row.phone });
  }
  return candidates;
}

export async function recordSmsReminder(input: { announcementId: string; userId: string; phone: string; status: string; error?: string | null }) {
  await ensureAnnouncementStore();
  await database().prepare(`INSERT INTO portal_sms_reminders (announcement_id,user_id,phone,status,error_message,sent_at)
    VALUES (?,?,?,?,?,?) ON CONFLICT(announcement_id,user_id) DO UPDATE SET phone=excluded.phone,status=excluded.status,error_message=excluded.error_message,sent_at=excluded.sent_at`)
    .bind(input.announcementId,input.userId,input.phone,input.status,input.error || null,new Date().toISOString()).run();
}
