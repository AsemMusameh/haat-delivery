export type OrderComplaint = {
  id: string;
  reporterId: string;
  reporterName: string;
  orderNumber: string;
  employeeName: string;
  description: string;
  chatUrl: string;
  recipientId: string;
  recipientName: string;
  recipientLabel: string;
  status: "new" | "reviewed";
  createdAt: string;
};

type ComplaintRow = {
  id: string; reporter_id: string; reporter_name: string; order_number: string; employee_name: string;
  description: string; chat_url: string; recipient_id: string; recipient_name: string; recipient_label: string;
  status: "new" | "reviewed"; created_at: string;
};

const database = () => {
  const runtime = (globalThis as typeof globalThis & { __HAAT_WORKER_ENV__?: { DB?: D1Database } }).__HAAT_WORKER_ENV__;
  if (!runtime?.DB) throw new Error("COMPLAINTS_DB_UNAVAILABLE");
  return runtime.DB;
};

export async function ensureComplaintStore() {
  const db = database();
  await db.batch([
    db.prepare(`CREATE TABLE IF NOT EXISTS portal_order_complaints (
      id TEXT PRIMARY KEY,reporter_id TEXT NOT NULL,reporter_name TEXT NOT NULL,order_number TEXT NOT NULL,
      employee_name TEXT NOT NULL,description TEXT NOT NULL,chat_url TEXT NOT NULL,recipient_id TEXT NOT NULL,
      recipient_name TEXT NOT NULL,recipient_label TEXT NOT NULL,status TEXT NOT NULL DEFAULT 'new',created_at TEXT NOT NULL)`),
    db.prepare("CREATE INDEX IF NOT EXISTS portal_order_complaints_reporter_idx ON portal_order_complaints (reporter_id,created_at DESC)"),
    db.prepare("CREATE INDEX IF NOT EXISTS portal_order_complaints_recipient_idx ON portal_order_complaints (recipient_id,status,created_at DESC)"),
  ]);
}

const mapRow = (row: ComplaintRow): OrderComplaint => ({
  id: row.id, reporterId: row.reporter_id, reporterName: row.reporter_name, orderNumber: row.order_number,
  employeeName: row.employee_name, description: row.description, chatUrl: row.chat_url, recipientId: row.recipient_id,
  recipientName: row.recipient_name, recipientLabel: row.recipient_label, status: row.status, createdAt: row.created_at,
});

export async function listComplaints(userId: string, privileged = false) {
  await ensureComplaintStore();
  const query = privileged
    ? database().prepare("SELECT * FROM portal_order_complaints ORDER BY created_at DESC LIMIT 250")
    : database().prepare("SELECT * FROM portal_order_complaints WHERE reporter_id=? OR recipient_id=? ORDER BY created_at DESC LIMIT 120").bind(userId,userId);
  const result = await query.all<ComplaintRow>();
  return (result.results || []).map(mapRow);
}

export async function createComplaint(input: Omit<OrderComplaint,"id"|"status"|"createdAt">) {
  await ensureComplaintStore();
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();
  await database().prepare(`INSERT INTO portal_order_complaints
    (id,reporter_id,reporter_name,order_number,employee_name,description,chat_url,recipient_id,recipient_name,recipient_label,status,created_at)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`).bind(id,input.reporterId,input.reporterName,input.orderNumber,input.employeeName,input.description,input.chatUrl,input.recipientId,input.recipientName,input.recipientLabel,"new",createdAt).run();
  return { ...input,id,status:"new" as const,createdAt };
}
