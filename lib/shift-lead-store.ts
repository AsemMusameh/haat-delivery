export type ShiftLead = {
  id:string; area:string; shiftName:string; startsAt:string;
  customerServiceName:string; customerServicePhone:string;
  courierSupportName:string; courierSupportPhone:string;
  dispatchName:string; dispatchPhone:string;
  isCurrent:boolean; createdBy:string; createdAt:string;
};

type ShiftLeadRow = { id:string;area:string;shift_name:string;starts_at:string;customer_service_name:string;customer_service_phone:string;courier_support_name:string;courier_support_phone:string;dispatch_name:string;dispatch_phone:string;is_current:number;created_by:string;created_at:string };
const database=()=>{const runtime=(globalThis as typeof globalThis&{__HAAT_WORKER_ENV__?:{DB?:D1Database}}).__HAAT_WORKER_ENV__;if(!runtime?.DB)throw new Error("SHIFT_LEADS_DB_UNAVAILABLE");return runtime.DB};
export async function ensureShiftLeadStore(){const db=database();await db.batch([
  db.prepare(`CREATE TABLE IF NOT EXISTS portal_shift_leads (
    id TEXT PRIMARY KEY,area TEXT NOT NULL,shift_name TEXT NOT NULL,starts_at TEXT NOT NULL,
    customer_service_name TEXT NOT NULL,customer_service_phone TEXT NOT NULL,
    courier_support_name TEXT NOT NULL,courier_support_phone TEXT NOT NULL,
    dispatch_name TEXT NOT NULL,dispatch_phone TEXT NOT NULL,is_current INTEGER NOT NULL DEFAULT 1,
    created_by TEXT NOT NULL,created_at TEXT NOT NULL)`),
  db.prepare("CREATE INDEX IF NOT EXISTS portal_shift_leads_current_idx ON portal_shift_leads (is_current,area,starts_at DESC)"),
])}
const map=(row:ShiftLeadRow):ShiftLead=>({id:row.id,area:row.area,shiftName:row.shift_name,startsAt:row.starts_at,customerServiceName:row.customer_service_name,customerServicePhone:row.customer_service_phone,courierSupportName:row.courier_support_name,courierSupportPhone:row.courier_support_phone,dispatchName:row.dispatch_name,dispatchPhone:row.dispatch_phone,isCurrent:Boolean(row.is_current),createdBy:row.created_by,createdAt:row.created_at});
export async function listShiftLeads(){await ensureShiftLeadStore();const result=await database().prepare("SELECT * FROM portal_shift_leads ORDER BY is_current DESC,starts_at DESC LIMIT 300").all<ShiftLeadRow>();return(result.results||[]).map(map)}
export async function createShiftLead(input:Omit<ShiftLead,"id"|"isCurrent"|"createdAt">){await ensureShiftLeadStore();const db=database(),id=crypto.randomUUID(),createdAt=new Date().toISOString();await db.batch([
  db.prepare("UPDATE portal_shift_leads SET is_current=0 WHERE area=? AND is_current=1").bind(input.area),
  db.prepare(`INSERT INTO portal_shift_leads (id,area,shift_name,starts_at,customer_service_name,customer_service_phone,courier_support_name,courier_support_phone,dispatch_name,dispatch_phone,is_current,created_by,created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`).bind(id,input.area,input.shiftName,input.startsAt,input.customerServiceName,input.customerServicePhone,input.courierSupportName,input.courierSupportPhone,input.dispatchName,input.dispatchPhone,1,input.createdBy,createdAt),
]);return{...input,id,isCurrent:true,createdAt}}
