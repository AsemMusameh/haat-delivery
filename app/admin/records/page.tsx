"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, Archive, Eye, FileWarning, Plus, Save, ShieldCheck, X } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { useEmployees } from "@/lib/hooks";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

type RecordRow = { id: string; employee_id: string; record_type: string; title: string; description: string; occurred_at: string; severity: string; status: string; employee?: { full_name: string } | null };
const fallbackRows: RecordRow[] = [];
const emptyDraft = { employee_id: "", record_type: "administrative_note", title: "", description: "", severity: "medium" };

export default function Records() {
  const employees = useEmployees();
  const [rows, setRows] = useState<RecordRow[]>(isSupabaseConfigured ? [] : fallbackRows);
  const [query, setQuery] = useState("");
  const [type, setType] = useState("all");
  const [status, setStatus] = useState("all");
  const [selected, setSelected] = useState<RecordRow | null>(null);
  const [draft, setDraft] = useState<typeof emptyDraft | null>(null);
  const [busy, setBusy] = useState(false);

  const load = async () => {
    if (!isSupabaseConfigured) return;
    const { data, error } = await createClient()!.from("employee_records").select("*,employee:profiles!employee_id(full_name)").is("archived_at", null).order("occurred_at", { ascending: false });
    if (error) toast.error(error.message); else setRows((data || []) as RecordRow[]);
  };
  useEffect(() => { void load(); }, []);

  const filtered = useMemo(() => rows.filter((row) => {
    const needle = query.trim().toLowerCase();
    const matchesQuery = !needle || row.title.toLowerCase().includes(needle) || row.id.toLowerCase().includes(needle) || row.employee?.full_name.toLowerCase().includes(needle);
    return matchesQuery && (type === "all" || row.record_type === type) && (status === "all" || row.status === status);
  }), [rows, query, type, status]);

  const openNew = () => setDraft({ ...emptyDraft, employee_id: employees[0]?.id || "" });
  const save = async () => {
    if (!draft?.employee_id || !draft.title.trim() || !draft.description.trim()) return toast.error("اختر الموظف وأدخل العنوان والتفاصيل");
    setBusy(true);
    try {
      if (isSupabaseConfigured) {
        const client = createClient()!;
        const { data: { user } } = await client.auth.getUser();
        if (!user) throw new Error("يجب تسجيل الدخول بحساب الإدارة");
        const employee = employees.find((item) => item.id === draft.employee_id);
        const { error } = await client.from("employee_records").insert({ ...draft, department_id: employee?.department_id || null, occurred_at: new Date().toISOString(), created_by: user.id, status: "open", visible_to_employee: true });
        if (error) throw error;
        await load();
      } else {
        const employee = employees.find((item) => item.id === draft.employee_id);
        setRows((current) => [{ ...draft, id: `REC-${Date.now()}`, occurred_at: new Date().toISOString(), status: "open", employee: { full_name: employee?.full_name || "موظف" } }, ...current]);
      }
      setDraft(null); toast.success("تم إنشاء السجل بنجاح");
    } catch (error) { toast.error(error instanceof Error ? error.message : "تعذر إنشاء السجل"); }
    finally { setBusy(false); }
  };
  const archive = async (row: RecordRow) => {
    if (!window.confirm(`أرشفة السجل «${row.title}»؟`)) return;
    if (isSupabaseConfigured) {
      const { error } = await createClient()!.from("employee_records").update({ archived_at: new Date().toISOString() }).eq("id", row.id);
      if (error) return toast.error(error.message);
    }
    setRows((current) => current.filter((item) => item.id !== row.id)); toast.success("تمت أرشفة السجل");
  };

  const openCount = rows.filter((row) => row.status === "open").length;
  const reviewCount = rows.filter((row) => row.status === "under_review").length;
  const resolvedCount = rows.filter((row) => row.status === "resolved").length;

  return <AppShell admin title="الشكاوى والإنذارات" action={<button type="button" className="btn btn-primary" onClick={openNew}><Plus size={17}/>سجل جديد</button>}>
    <div className="mb-5 grid gap-4 sm:grid-cols-3"><article className="card p-5"><FileWarning className="mb-3 text-red-500"/><strong className="text-3xl">{openCount}</strong><p className="text-xs text-[var(--muted)]">سجلات مفتوحة</p></article><article className="card p-5"><AlertTriangle className="mb-3 text-amber-500"/><strong className="text-3xl">{reviewCount}</strong><p className="text-xs text-[var(--muted)]">قيد المراجعة</p></article><article className="card p-5"><ShieldCheck className="mb-3 text-emerald-500"/><strong className="text-3xl">{resolvedCount}</strong><p className="text-xs text-[var(--muted)]">مغلقة</p></article></div>
    <div className="card overflow-hidden"><div className="grid gap-3 border-b border-[var(--line)] p-4 sm:grid-cols-[1fr_180px_180px]"><input className="input" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="ابحث بالموظف أو رقم السجل..."/><select className="input" value={type} onChange={(event) => setType(event.target.value)}><option value="all">جميع الأنواع</option><option value="complaint">شكوى</option><option value="written_warning">إنذار خطي</option><option value="appreciation">تقدير</option><option value="administrative_note">ملاحظة إدارية</option></select><select className="input" value={status} onChange={(event) => setStatus(event.target.value)}><option value="all">جميع الحالات</option><option value="open">مفتوح</option><option value="under_review">قيد المراجعة</option><option value="resolved">مغلق</option></select></div>
      <div className="overflow-x-auto"><table className="w-full min-w-[800px] text-right text-sm"><thead className="bg-[var(--surface-2)] text-xs text-[var(--muted)]"><tr>{["السجل","الموظف","النوع","الخطورة","التاريخ","الحالة","الإجراءات"].map((label) => <th className="p-4" key={label}>{label}</th>)}</tr></thead><tbody>{filtered.map((row) => <tr key={row.id} className="border-t border-[var(--line)]"><td className="p-4"><b>{row.title}</b><span className="block text-xs text-[var(--muted)]">{row.id.slice(0, 12)}</span></td><td className="p-4 font-bold">{row.employee?.full_name || "—"}</td><td className="p-4">{row.record_type}</td><td className="p-4"><span className={`badge ${["high","critical"].includes(row.severity) ? "urgent" : ""}`}>{row.severity}</span></td><td className="p-4">{new Date(row.occurred_at).toLocaleDateString("ar")}</td><td className="p-4">{row.status}</td><td className="p-4"><div className="flex gap-2"><button type="button" className="toolbar-btn" title="فتح" onClick={() => setSelected(row)}><Eye size={16}/></button><button type="button" className="toolbar-btn" title="أرشفة" onClick={() => archive(row)}><Archive size={16}/></button></div></td></tr>)}</tbody></table>{filtered.length === 0 && <p className="p-8 text-center text-sm text-[var(--muted)]">لا توجد سجلات مطابقة</p>}</div>
    </div>
    {selected && <div className="fixed inset-0 z-[70] grid place-items-center bg-black/45 p-4" onMouseDown={() => setSelected(null)}><section className="card w-full max-w-xl p-6" onMouseDown={(event) => event.stopPropagation()}><header className="flex items-center justify-between"><h2 className="font-black">تفاصيل السجل</h2><button type="button" onClick={() => setSelected(null)}><X size={20}/></button></header><h3 className="mt-5 text-lg font-black">{selected.title}</h3><p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-[var(--muted)]">{selected.description}</p><div className="mt-5 flex flex-wrap gap-2"><span className="badge">{selected.employee?.full_name}</span><span className="badge">{selected.record_type}</span><span className="badge">{selected.status}</span></div></section></div>}
    {draft && <div className="fixed inset-0 z-[70] grid place-items-center bg-black/45 p-4" onMouseDown={() => setDraft(null)}><section className="card w-full max-w-xl p-6" onMouseDown={(event) => event.stopPropagation()}><header className="flex items-center justify-between"><h2 className="font-black">إنشاء سجل جديد</h2><button type="button" onClick={() => setDraft(null)}><X size={20}/></button></header><div className="mt-5 grid gap-4"><label className="text-xs font-bold">الموظف<select className="input mt-2" value={draft.employee_id} onChange={(event) => setDraft({ ...draft, employee_id: event.target.value })}><option value="">اختر الموظف</option>{employees.map((employee) => <option key={employee.id} value={employee.id}>{employee.full_name}</option>)}</select></label><label className="text-xs font-bold">النوع<select className="input mt-2" value={draft.record_type} onChange={(event) => setDraft({ ...draft, record_type: event.target.value })}><option value="complaint">شكوى</option><option value="verbal_warning">إنذار شفهي</option><option value="written_warning">إنذار خطي</option><option value="final_warning">إنذار نهائي</option><option value="appreciation">تقدير</option><option value="administrative_note">ملاحظة إدارية</option><option value="policy_violation">مخالفة سياسة</option></select></label><label className="text-xs font-bold">العنوان<input className="input mt-2" value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })}/></label><label className="text-xs font-bold">التفاصيل<textarea className="input mt-2 min-h-32" value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })}/></label><label className="text-xs font-bold">الخطورة<select className="input mt-2" value={draft.severity} onChange={(event) => setDraft({ ...draft, severity: event.target.value })}><option value="low">منخفضة</option><option value="medium">متوسطة</option><option value="high">عالية</option><option value="critical">حرجة</option></select></label></div><button type="button" className="btn btn-primary mt-5 w-full" onClick={save} disabled={busy}><Save size={16}/>{busy ? "جارٍ الحفظ..." : "حفظ السجل"}</button></section></div>}
  </AppShell>;
}
