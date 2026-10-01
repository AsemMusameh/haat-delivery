export type ReportCategory = "voice" | "connecteam" | "chat";

export type DailyReport = {
  id: string;
  authorId: string;
  authorName: string;
  department: string;
  reportType: ReportCategory;
  reportDate: string;
  shift: string;
  title: string;
  summary: string;
  achievements: string;
  challenges: string;
  notes: string;
  createdAt: string;
};

export type MonthlyReport = {
  id: string;
  authorId: string;
  authorName: string;
  reportMonth: string;
  title: string;
  note: string;
  imageData: string;
  imageName: string;
  createdAt: string;
};

type DailyRow = {
  id: string; author_id: string; author_name: string; department: string; report_date: string;
  shift: string; title: string; summary: string; achievements: string; challenges: string; notes: string; created_at: string;
  report_type?: ReportCategory | null;
};
type MonthlyRow = {
  id: string; author_id: string; author_name: string; report_month: string; title: string;
  note: string; image_data: string; image_name: string; created_at: string;
};

const database = () => {
  const runtime = (globalThis as typeof globalThis & { __HAAT_WORKER_ENV__?: { DB?: D1Database } }).__HAAT_WORKER_ENV__;
  if (!runtime?.DB) throw new Error("REPORTS_DB_UNAVAILABLE");
  return runtime.DB;
};

export async function ensureReportStore() {
  const db = database();
  await db.batch([
    db.prepare(`CREATE TABLE IF NOT EXISTS portal_daily_reports (
      id TEXT PRIMARY KEY,author_id TEXT NOT NULL,author_name TEXT NOT NULL,department TEXT NOT NULL,
      report_date TEXT NOT NULL,shift TEXT NOT NULL,title TEXT NOT NULL,summary TEXT NOT NULL,
      achievements TEXT NOT NULL DEFAULT '',challenges TEXT NOT NULL DEFAULT '',notes TEXT NOT NULL DEFAULT '',created_at TEXT NOT NULL)`),
    db.prepare("CREATE INDEX IF NOT EXISTS portal_daily_reports_date_idx ON portal_daily_reports (report_date DESC, created_at DESC)"),
    db.prepare(`CREATE TABLE IF NOT EXISTS portal_daily_report_types (
      report_id TEXT PRIMARY KEY,report_type TEXT NOT NULL DEFAULT 'chat')`),
    db.prepare("CREATE INDEX IF NOT EXISTS portal_daily_report_types_type_idx ON portal_daily_report_types (report_type,report_id)"),
    db.prepare(`CREATE TABLE IF NOT EXISTS portal_monthly_reports (
      id TEXT PRIMARY KEY,author_id TEXT NOT NULL,author_name TEXT NOT NULL,report_month TEXT NOT NULL,
      title TEXT NOT NULL,note TEXT NOT NULL DEFAULT '',image_data TEXT NOT NULL,image_name TEXT NOT NULL,created_at TEXT NOT NULL)`),
    db.prepare("CREATE INDEX IF NOT EXISTS portal_monthly_reports_month_idx ON portal_monthly_reports (report_month DESC, created_at DESC)"),
  ]);
}

const mapDaily = (row: DailyRow): DailyReport => ({
  id: row.id, authorId: row.author_id, authorName: row.author_name, department: row.department,
  reportType: row.report_type || "chat",
  reportDate: row.report_date, shift: row.shift, title: row.title, summary: row.summary,
  achievements: row.achievements, challenges: row.challenges, notes: row.notes, createdAt: row.created_at,
});
const mapMonthly = (row: MonthlyRow): MonthlyReport => ({
  id: row.id, authorId: row.author_id, authorName: row.author_name, reportMonth: row.report_month,
  title: row.title, note: row.note, imageData: row.image_data, imageName: row.image_name, createdAt: row.created_at,
});

export async function listDailyReports() {
  await ensureReportStore();
  const result = await database().prepare(`SELECT r.*,COALESCE(t.report_type,'chat') report_type
    FROM portal_daily_reports r LEFT JOIN portal_daily_report_types t ON t.report_id=r.id
    ORDER BY r.report_date DESC,r.created_at DESC LIMIT 365`).all<DailyRow>();
  return (result.results || []).map(mapDaily);
}

export async function createDailyReport(input: Omit<DailyReport, "id" | "createdAt">) {
  await ensureReportStore();
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();
  const db = database();
  await db.batch([
    db.prepare(`INSERT INTO portal_daily_reports
    (id,author_id,author_name,department,report_date,shift,title,summary,achievements,challenges,notes,created_at)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`).bind(
      id,input.authorId,input.authorName,input.department,input.reportDate,input.shift,input.title,input.summary,
      input.achievements,input.challenges,input.notes,createdAt,
    ),
    db.prepare("INSERT INTO portal_daily_report_types (report_id,report_type) VALUES (?,?)").bind(id,input.reportType),
  ]);
  return { ...input, id, createdAt };
}

export async function listMonthlyReports() {
  await ensureReportStore();
  const result = await database().prepare("SELECT * FROM portal_monthly_reports ORDER BY report_month DESC, created_at DESC LIMIT 60").all<MonthlyRow>();
  return (result.results || []).map(mapMonthly);
}

export async function createMonthlyReport(input: Omit<MonthlyReport, "id" | "createdAt">) {
  await ensureReportStore();
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();
  await database().prepare(`INSERT INTO portal_monthly_reports
    (id,author_id,author_name,report_month,title,note,image_data,image_name,created_at)
    VALUES (?,?,?,?,?,?,?,?,?)`).bind(
      id,input.authorId,input.authorName,input.reportMonth,input.title,input.note,input.imageData,input.imageName,createdAt,
    ).run();
  return { ...input, id, createdAt };
}

export async function reportOwner(type: "daily" | "monthly", id: string) {
  await ensureReportStore();
  const table = type === "daily" ? "portal_daily_reports" : "portal_monthly_reports";
  return database().prepare(`SELECT author_id authorId FROM ${table} WHERE id=?`).bind(id).first<{ authorId: string }>();
}

export async function deleteReport(type: "daily" | "monthly", id: string) {
  await ensureReportStore();
  const table = type === "daily" ? "portal_daily_reports" : "portal_monthly_reports";
  if (type === "daily") await database().batch([
    database().prepare("DELETE FROM portal_daily_report_types WHERE report_id=?").bind(id),
    database().prepare(`DELETE FROM ${table} WHERE id=?`).bind(id),
  ]);
  else await database().prepare(`DELETE FROM ${table} WHERE id=?`).bind(id).run();
}
