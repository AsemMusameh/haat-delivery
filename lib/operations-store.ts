import { coverageAreas as defaultCoverageAreas, type CoverageArea } from "@/lib/coverage-areas";
export type RequestStatus = "pending" | "in_review" | "approved" | "rejected" | "completed";
export type EmployeeRequest = {
  id: string; userKey: string; employeeName: string; employeeId: string; department: string;
  type: string; title: string; details: string; fromDate?: string | null; toDate?: string | null;
  status: RequestStatus; priority: string; managerNote?: string | null; createdAt: string; updatedAt: string;
};
export type Courier = { id: string; name: string; phone: string; area: string; shift: string; notes?: string | null; isActive: boolean; createdAt: string; updatedAt: string };

type RequestRow = { id:string; user_key:string; employee_name:string; employee_id:string; department:string; type:string; title:string; details:string; from_date:string|null; to_date:string|null; status:RequestStatus; priority:string; manager_note:string|null; created_at:string; updated_at:string };
type CourierRow = { id:string; name:string; phone:string; area:string; shift:string; notes:string|null; is_active:number; created_at:string; updated_at:string };
const now = () => new Date().toISOString();
const db = () => {
  const runtime = (globalThis as typeof globalThis & { __HAAT_WORKER_ENV__?: { DB?: D1Database } }).__HAAT_WORKER_ENV__;
  if (!runtime?.DB) throw new Error("OPERATIONS_DB_UNAVAILABLE");
  return runtime.DB;
};
const mapRequest = (row: RequestRow): EmployeeRequest => ({ id:row.id,userKey:row.user_key,employeeName:row.employee_name,employeeId:row.employee_id,department:row.department,type:row.type,title:row.title,details:row.details,fromDate:row.from_date,toDate:row.to_date,status:row.status,priority:row.priority,managerNote:row.manager_note,createdAt:row.created_at,updatedAt:row.updated_at });
const mapCourier = (row: CourierRow): Courier => ({ id:row.id,name:row.name,phone:row.phone,area:row.area,shift:row.shift,notes:row.notes,isActive:Boolean(row.is_active),createdAt:row.created_at,updatedAt:row.updated_at });

export async function ensureOperationsStore() {
  const database = db();
  await database.batch([
    database.prepare(`CREATE TABLE IF NOT EXISTS employee_requests (
      id TEXT PRIMARY KEY,user_key TEXT NOT NULL,employee_name TEXT NOT NULL,employee_id TEXT NOT NULL,department TEXT NOT NULL,
      type TEXT NOT NULL,title TEXT NOT NULL,details TEXT NOT NULL,from_date TEXT,to_date TEXT,
      status TEXT NOT NULL DEFAULT 'pending',priority TEXT NOT NULL DEFAULT 'normal',manager_note TEXT,
      created_at TEXT NOT NULL,updated_at TEXT NOT NULL)`),
    database.prepare("CREATE INDEX IF NOT EXISTS employee_requests_user_idx ON employee_requests (user_key, created_at)"),
    database.prepare("CREATE INDEX IF NOT EXISTS employee_requests_status_idx ON employee_requests (status, created_at)"),
    database.prepare(`CREATE TABLE IF NOT EXISTS pulse_entries (
      id TEXT PRIMARY KEY,user_key TEXT NOT NULL,entry_date TEXT NOT NULL,mood INTEGER NOT NULL,created_at TEXT NOT NULL,updated_at TEXT NOT NULL,
      UNIQUE(user_key, entry_date))`),
    database.prepare("CREATE INDEX IF NOT EXISTS pulse_entries_date_idx ON pulse_entries (entry_date)"),
    database.prepare(`CREATE TABLE IF NOT EXISTS couriers (
      id TEXT PRIMARY KEY,name TEXT NOT NULL,phone TEXT NOT NULL,area TEXT NOT NULL,shift TEXT NOT NULL,notes TEXT,
      is_active INTEGER NOT NULL DEFAULT 1,created_at TEXT NOT NULL,updated_at TEXT NOT NULL)`),
    database.prepare("CREATE INDEX IF NOT EXISTS couriers_area_idx ON couriers (area, name)"),
    database.prepare(`CREATE TABLE IF NOT EXISTS portal_settings (
      key TEXT PRIMARY KEY,label TEXT NOT NULL,value TEXT NOT NULL,group_name TEXT NOT NULL,updated_at TEXT NOT NULL)`),
    database.prepare(`CREATE TABLE IF NOT EXISTS coverage_areas (
      code INTEGER PRIMARY KEY,name TEXT NOT NULL,name_ar TEXT NOT NULL,x INTEGER NOT NULL,y INTEGER NOT NULL,status TEXT NOT NULL DEFAULT 'active',updated_at TEXT NOT NULL)`),
    database.prepare(`CREATE TABLE IF NOT EXISTS coverage_area_contacts (
      code INTEGER PRIMARY KEY,phone TEXT NOT NULL DEFAULT '',updated_at TEXT NOT NULL)`),
    database.prepare(`CREATE TABLE IF NOT EXISTS portal_seed_versions (
      seed_key TEXT PRIMARY KEY,applied_at TEXT NOT NULL)`),
  ]);
  const stamp = now();
  const defaults = [
    ["portal_title","اسم المنصة","HAAT","عام"],
    ["support_phone","رقم الدعم الداخلي","لم تتم إضافته بعد","التواصل"],
    ["support_email","بريد الدعم","support@haat.ps","التواصل"],
    ["work_guide_title","عنوان دليل العمل","دليل خدمة الزبائن","المحتوى"],
    ["emergency_notice","التنبيه الرئيسي","تأكد من مراجعة آخر التعميمات قبل بدء الوردية.","المحتوى"],
    ["public_team_count","عدد أفراد الفريق","+500","الصفحة العامة"],
    ["public_area_count","عدد المناطق المخدومة","+20","الصفحة العامة"],
    ["public_support_hours","ساعات الدعم","24/7","الصفحة العامة"],
    ["public_satisfaction","نسبة رضا الخدمة","98%","الصفحة العامة"],
    ["ad_enabled","إظهار الإعلان","لا","الإعلانات"],
    ["ad_title","عنوان الإعلان","","الإعلانات"],
    ["ad_body","نص الإعلان","","الإعلانات"],
    ["ad_link","رابط الإعلان (اختياري)","","الإعلانات"],
  ];
  await database.batch(defaults.map(([key,label,value,group]) => database.prepare("INSERT OR IGNORE INTO portal_settings (key,label,value,group_name,updated_at) VALUES (?,?,?,?,?)").bind(key,label,value,group,stamp)));
  const coverageSeedKey = "coverage-catalog-2026-10-02-v2";
  const coverageSeedApplied = await database.prepare("SELECT seed_key FROM portal_seed_versions WHERE seed_key=?").bind(coverageSeedKey).first();
  if (!coverageSeedApplied) {
    const areaCodes = defaultCoverageAreas.map((area) => area.code);
    const placeholders = areaCodes.map(() => "?").join(",");
    await database.batch([
      ...defaultCoverageAreas.map((area) => database.prepare(`INSERT INTO coverage_areas
        (code,name,name_ar,x,y,status,updated_at) VALUES (?,?,?,?,?,?,?)
        ON CONFLICT(code) DO UPDATE SET name=excluded.name,name_ar=excluded.name_ar,x=excluded.x,y=excluded.y,status=excluded.status,updated_at=excluded.updated_at`)
        .bind(area.code,area.name,area.nameAr,area.x,area.y,area.status||"active",stamp)),
      database.prepare(`DELETE FROM coverage_area_contacts WHERE code NOT IN (${placeholders})`).bind(...areaCodes),
      database.prepare(`DELETE FROM coverage_areas WHERE code NOT IN (${placeholders})`).bind(...areaCodes),
      database.prepare("INSERT INTO portal_seed_versions (seed_key,applied_at) VALUES (?,?)").bind(coverageSeedKey,stamp),
    ]);
  }
  const defaultPhones: Record<number,string> = {1:"+972545026965",2:"+972545026965",4:"+972545026965",5:"+972549580852",7:"+972549580852",13:"+972549580852",8:"+972544732050",12:"+972544732050",9:"+972544371004",10:"+972547905048",16:"+972542785813",19:"+972542785813",20:"+972543687217"};
  await database.batch(Object.entries(defaultPhones).map(([code,phone])=>database.prepare("INSERT OR IGNORE INTO coverage_area_contacts (code,phone,updated_at) VALUES (?,?,?)").bind(Number(code),phone,stamp)));
}

export async function listRequests(userKey?: string) {
  await ensureOperationsStore();
  const query = userKey ? db().prepare("SELECT * FROM employee_requests WHERE user_key=? ORDER BY created_at DESC").bind(userKey) : db().prepare("SELECT * FROM employee_requests ORDER BY created_at DESC");
  const result = await query.all<RequestRow>();
  return (result.results || []).map(mapRequest);
}
export async function createRequest(input: Omit<EmployeeRequest,"id"|"status"|"managerNote"|"createdAt"|"updatedAt">) {
  await ensureOperationsStore(); const id=crypto.randomUUID(),stamp=now();
  await db().prepare(`INSERT INTO employee_requests (id,user_key,employee_name,employee_id,department,type,title,details,from_date,to_date,status,priority,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`).bind(id,input.userKey,input.employeeName,input.employeeId,input.department,input.type,input.title,input.details,input.fromDate||null,input.toDate||null,"pending",input.priority||"normal",stamp,stamp).run();
  return { ...input,id,status:"pending" as const,managerNote:null,createdAt:stamp,updatedAt:stamp };
}
export async function updateRequest(id:string,status:RequestStatus,managerNote?:string) {
  await ensureOperationsStore(); const stamp=now();
  await db().prepare("UPDATE employee_requests SET status=?,manager_note=?,updated_at=? WHERE id=?").bind(status,managerNote||null,stamp,id).run();
}
export async function getPulse(userKey:string,date:string) { await ensureOperationsStore(); return db().prepare("SELECT mood FROM pulse_entries WHERE user_key=? AND entry_date=?").bind(userKey,date).first<{mood:number}>(); }
export async function savePulse(userKey:string,date:string,mood:number) { await ensureOperationsStore(); const stamp=now(); await db().prepare(`INSERT INTO pulse_entries (id,user_key,entry_date,mood,created_at,updated_at) VALUES (?,?,?,?,?,?) ON CONFLICT(user_key,entry_date) DO UPDATE SET mood=excluded.mood,updated_at=excluded.updated_at`).bind(crypto.randomUUID(),userKey,date,mood,stamp,stamp).run(); }
export async function pulseSummary(date:string) { await ensureOperationsStore(); const result=await db().prepare("SELECT mood,COUNT(*) count FROM pulse_entries WHERE entry_date=? GROUP BY mood ORDER BY mood").bind(date).all<{mood:number;count:number}>(); return result.results||[]; }
export async function listCouriers(includeInactive=false) { await ensureOperationsStore(); const result=await db().prepare(`SELECT * FROM couriers${includeInactive?"":" WHERE is_active=1"} ORDER BY area,name`).all<CourierRow>(); return (result.results||[]).map(mapCourier); }
export async function saveCourier(input: Partial<Courier> & Pick<Courier,"name"|"phone"|"area"|"shift">) { await ensureOperationsStore(); const id=input.id||crypto.randomUUID(),stamp=now(); await db().prepare(`INSERT INTO couriers (id,name,phone,area,shift,notes,is_active,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET name=excluded.name,phone=excluded.phone,area=excluded.area,shift=excluded.shift,notes=excluded.notes,is_active=excluded.is_active,updated_at=excluded.updated_at`).bind(id,input.name,input.phone,input.area,input.shift,input.notes||null,input.isActive===false?0:1,stamp,stamp).run(); return id; }
export async function deleteCourier(id:string) { await ensureOperationsStore(); await db().prepare("DELETE FROM couriers WHERE id=?").bind(id).run(); }
export async function listSettings() { await ensureOperationsStore(); const result=await db().prepare("SELECT key,label,value,group_name groupName,updated_at updatedAt FROM portal_settings ORDER BY group_name,label").all<{key:string;label:string;value:string;groupName:string;updatedAt:string}>(); return result.results||[]; }
export async function saveSettings(items:{key:string;label:string;value:string;groupName:string}[]) { await ensureOperationsStore(); const stamp=now(); await db().batch(items.map(item=>db().prepare(`INSERT INTO portal_settings (key,label,value,group_name,updated_at) VALUES (?,?,?,?,?) ON CONFLICT(key) DO UPDATE SET label=excluded.label,value=excluded.value,group_name=excluded.group_name,updated_at=excluded.updated_at`).bind(item.key,item.label,item.value,item.groupName,stamp))); }
export async function listCoverageAreas() { await ensureOperationsStore(); const result=await db().prepare("SELECT a.code,a.name,a.name_ar nameAr,a.x,a.y,a.status,COALESCE(c.phone,'') phone FROM coverage_areas a LEFT JOIN coverage_area_contacts c ON c.code=a.code ORDER BY a.code").all<CoverageArea>(); return (result.results||[]).map((area)=>({...area,hours:defaultCoverageAreas.find((item)=>item.code===area.code)?.hours||[]})); }
export async function saveCoverageArea(area:CoverageArea) { await ensureOperationsStore(); const stamp=now(); await db().batch([
  db().prepare(`INSERT INTO coverage_areas (code,name,name_ar,x,y,status,updated_at) VALUES (?,?,?,?,?,?,?) ON CONFLICT(code) DO UPDATE SET name=excluded.name,name_ar=excluded.name_ar,x=excluded.x,y=excluded.y,status=excluded.status,updated_at=excluded.updated_at`).bind(area.code,area.name,area.nameAr,area.x,area.y,area.status||"active",stamp),
  db().prepare(`INSERT INTO coverage_area_contacts (code,phone,updated_at) VALUES (?,?,?) ON CONFLICT(code) DO UPDATE SET phone=excluded.phone,updated_at=excluded.updated_at`).bind(area.code,area.phone||"",stamp),
]); }
export async function deleteCoverageArea(code:number) { await ensureOperationsStore(); await db().batch([db().prepare("DELETE FROM coverage_area_contacts WHERE code=?").bind(code),db().prepare("DELETE FROM coverage_areas WHERE code=?").bind(code)]); }
