import { defaultReplies, defaultTools, type ReplyTemplate, type WorkTool } from "@/lib/content-defaults";

type ToolRow = { id: string; title_ar: string; title_en: string; description_ar: string; description_en: string; url: string; icon: WorkTool["icon"]; color: WorkTool["color"]; sort_order: number; is_active: number };
type ReplyRow = { id: string; department: ReplyTemplate["department"]; category: string; title: string; body_ar: string; body_he: string; body_en: string; sort_order: number; is_active: number };

const now = () => new Date().toISOString();
const db = () => {
  const runtime = (globalThis as typeof globalThis & { __HAAT_WORKER_ENV__?: { DB?: D1Database } }).__HAAT_WORKER_ENV__;
  if (!runtime?.DB) throw new Error("CONTENT_DB_UNAVAILABLE");
  return runtime.DB;
};

export async function ensureContentStore() {
  const database = db();
  await database.batch([
    database.prepare(`CREATE TABLE IF NOT EXISTS work_tools (
      id TEXT PRIMARY KEY, title_ar TEXT NOT NULL, title_en TEXT NOT NULL,
      description_ar TEXT NOT NULL, description_en TEXT NOT NULL, url TEXT NOT NULL,
      icon TEXT NOT NULL DEFAULT 'link', color TEXT NOT NULL DEFAULT 'rose',
      sort_order INTEGER NOT NULL DEFAULT 0, is_active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL, updated_at TEXT NOT NULL
    )`),
    database.prepare(`CREATE TABLE IF NOT EXISTS reply_templates (
      id TEXT PRIMARY KEY, department TEXT NOT NULL DEFAULT 'chat', category TEXT NOT NULL, title TEXT NOT NULL,
      body_ar TEXT NOT NULL, body_he TEXT NOT NULL, body_en TEXT NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0, is_active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL, updated_at TEXT NOT NULL
    )`),
    database.prepare("CREATE INDEX IF NOT EXISTS work_tools_sort_idx ON work_tools (sort_order)"),
    database.prepare("CREATE INDEX IF NOT EXISTS reply_templates_category_sort_idx ON reply_templates (category, sort_order)"),
  ]);

  const stamp = now();
  await database.batch([
    ...defaultTools.map((item) => database.prepare(`INSERT OR IGNORE INTO work_tools
      (id,title_ar,title_en,description_ar,description_en,url,icon,color,sort_order,is_active,created_at,updated_at)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`).bind(item.id, item.titleAr, item.titleEn, item.descriptionAr, item.descriptionEn, item.url, item.icon, item.color, item.sortOrder, item.isActive ? 1 : 0, stamp, stamp)),
    ...defaultReplies.map((item) => database.prepare(`INSERT OR IGNORE INTO reply_templates
      (id,department,category,title,body_ar,body_he,body_en,sort_order,is_active,created_at,updated_at)
      VALUES (?,?,?,?,?,?,?,?,?,?,?)`).bind(item.id, item.department, item.category, item.title, item.bodyAr, item.bodyHe, item.bodyEn, item.sortOrder, item.isActive ? 1 : 0, stamp, stamp)),
  ]);
}

export async function listContent(includeInactive = false) {
  await ensureContentStore();
  const database = db();
  const where = includeInactive ? "" : " WHERE is_active = 1";
  const [toolResult, replyResult] = await Promise.all([
    database.prepare(`SELECT * FROM work_tools${where} ORDER BY sort_order, title_ar`).all<ToolRow>(),
    database.prepare(`SELECT * FROM reply_templates${where} ORDER BY sort_order, title`).all<ReplyRow>(),
  ]);
  const tools: WorkTool[] = (toolResult.results ?? []).map((row) => ({ id: row.id, titleAr: row.title_ar, titleEn: row.title_en, descriptionAr: row.description_ar, descriptionEn: row.description_en, url: row.url, icon: row.icon, color: row.color, sortOrder: row.sort_order, isActive: Boolean(row.is_active) }));
  const replies: ReplyTemplate[] = (replyResult.results ?? []).map((row) => ({ id: row.id, department: row.department ?? "chat", category: row.category, title: row.title, bodyAr: row.body_ar, bodyHe: row.body_he, bodyEn: row.body_en, sortOrder: row.sort_order, isActive: Boolean(row.is_active) }));
  return { tools, replies };
}

export async function saveTool(item: WorkTool) {
  await ensureContentStore();
  const stamp = now();
  await db().prepare(`INSERT INTO work_tools
    (id,title_ar,title_en,description_ar,description_en,url,icon,color,sort_order,is_active,created_at,updated_at)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?)
    ON CONFLICT(id) DO UPDATE SET title_ar=excluded.title_ar,title_en=excluded.title_en,
    description_ar=excluded.description_ar,description_en=excluded.description_en,url=excluded.url,
    icon=excluded.icon,color=excluded.color,sort_order=excluded.sort_order,is_active=excluded.is_active,updated_at=excluded.updated_at`)
    .bind(item.id, item.titleAr, item.titleEn, item.descriptionAr, item.descriptionEn, item.url, item.icon, item.color, item.sortOrder, item.isActive ? 1 : 0, stamp, stamp).run();
}

export async function saveReply(item: ReplyTemplate) {
  await ensureContentStore();
  const stamp = now();
  await db().prepare(`INSERT INTO reply_templates
    (id,department,category,title,body_ar,body_he,body_en,sort_order,is_active,created_at,updated_at)
    VALUES (?,?,?,?,?,?,?,?,?,?,?)
    ON CONFLICT(id) DO UPDATE SET department=excluded.department,category=excluded.category,title=excluded.title,body_ar=excluded.body_ar,
    body_he=excluded.body_he,body_en=excluded.body_en,sort_order=excluded.sort_order,is_active=excluded.is_active,updated_at=excluded.updated_at`)
    .bind(item.id, item.department, item.category, item.title, item.bodyAr, item.bodyHe, item.bodyEn, item.sortOrder, item.isActive ? 1 : 0, stamp, stamp).run();
}

export async function deleteContent(kind: "tool" | "reply", id: string) {
  await ensureContentStore();
  const table = kind === "tool" ? "work_tools" : "reply_templates";
  await db().prepare(`DELETE FROM ${table} WHERE id = ?`).bind(id).run();
}
