"use client";

import { KeyRound, LoaderCircle, Search, ShieldCheck } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { departmentHeadEmails } from "@/lib/demo-data";
import { useEmployees } from "@/lib/hooks";

const permissionDefinitions = [
  ["view_announcements", "قراءة التعميمات"],
  ["create_requests", "إنشاء الطلبات"],
  ["view_reports", "عرض التقارير"],
  ["use_tools", "استخدام الروابط والأدوات"],
  ["submit_complaints", "رفع شكوى طلبية"],
  ["read_guidelines", "قراءة التوجيهات"],
] as const;

type AccessEmployee = { role: string; email: string; department_id?: string };

const accessLevel = (employee: AccessEmployee) => {
  if (["manager", "admin"].includes(employee.role) && !departmentHeadEmails.has(employee.email.toLowerCase())) return 1;
  if (departmentHeadEmails.has(employee.email.toLowerCase())) return 2;
  if (employee.department_id === "quality-assurance") return 3;
  if (employee.role === "supervisor") return 4;
  return 5;
};

const roleLabel = (employee: AccessEmployee) => ["مدير", "مسؤول قسم", "جودة", "مسؤول شفتات", "موظف"][accessLevel(employee) - 1];
const hierarchy = [
  ["01", "مدير", "إدارة كاملة وتعديل صلاحيات جميع الحسابات"],
  ["02", "مسؤول قسم", "إدارة القسم وتعديل صلاحيات الموظفين"],
  ["03", "جودة", "مراجعة الأداء والتقارير والشكاوى"],
  ["04", "مسؤول شفتات", "رفع التقارير اليومية والمتابعة التشغيلية"],
  ["05", "موظف", "الوصول إلى أدواته ومحتوى قسمه فقط"],
] as const;
const headers = () => ({ "Content-Type": "application/json", Authorization: `Bearer ${window.localStorage.getItem("haat-session-token") || ""}` });

export default function PermissionsPage() {
  const employees = useEmployees();
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [values, setValues] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const selected = employees.find((employee) => employee.id === selectedId);
  const visible = useMemo(() => employees
    .filter((employee) => `${employee.full_name} ${employee.email} ${employee.employee_id}`.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => accessLevel(a) - accessLevel(b) || a.full_name.localeCompare(b.full_name, "ar")), [employees, query]);

  useEffect(() => {
    if (!selectedId) return;
    setLoading(true);
    fetch(`/api/account-permissions?userId=${encodeURIComponent(selectedId)}`, { headers: headers() })
      .then(async (response) => { const data = await response.json(); if (!response.ok) throw new Error(data.error || "تعذر تحميل الصلاحيات"); setValues(data.permissions || {}); })
      .catch((error) => toast.error(error instanceof Error ? error.message : "تعذر تحميل الصلاحيات"))
      .finally(() => setLoading(false));
  }, [selectedId]);

  const toggle = async (permissionKey: string) => {
    if (!selectedId) return;
    const allowed = values[permissionKey] === false;
    setValues((current) => ({ ...current, [permissionKey]: allowed }));
    const response = await fetch("/api/account-permissions", { method: "PUT", headers: headers(), body: JSON.stringify({ userId: selectedId, permissionKey, allowed }) });
    if (!response.ok) { setValues((current) => ({ ...current, [permissionKey]: !allowed })); toast.error("تعذر تحديث الصلاحية"); return; }
    toast.success("تم تحديث الصلاحية فعليًا");
  };

  return <AppShell admin title="الحسابات والصلاحيات"><div className="mx-auto max-w-7xl space-y-5">
    <section className="card p-5 sm:p-6"><div className="flex items-center gap-3"><i className="row-icon"><ShieldCheck size={19}/></i><div><h2 className="font-black">تدرج الصلاحيات المعتمد</h2><p className="text-[10px] text-[var(--muted)]">تعديل صلاحيات الحسابات متاح للمدير ومسؤول القسم فقط.</p></div></div><div className="mt-5 grid gap-3 md:grid-cols-5">{hierarchy.map(([number, label, description]) => <div key={label} className="rounded-2xl border border-[var(--line)] bg-[var(--surface-2)] p-4"><span className="text-[10px] font-black text-[var(--primary)]">{number}</span><b className="mt-2 block text-sm">{label}</b><small className="mt-2 block text-[9px] leading-5 text-[var(--muted)]">{description}</small></div>)}</div></section>
    <div className="grid gap-5 lg:grid-cols-[360px_1fr]">
      <section className="card overflow-hidden"><div className="border-b border-[var(--line)] p-5"><div className="flex items-center gap-3"><i className="row-icon"><ShieldCheck size={19}/></i><div><h2 className="font-black">اختر الموظف</h2><p className="text-[10px] text-[var(--muted)]">الحسابات مرتبة حسب مستوى الصلاحية.</p></div></div><label className="relative mt-4 block"><Search className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" size={17}/><input className="input pr-10" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="ابحث بالاسم أو البريد..."/></label></div>
        <div className="max-h-[620px] overflow-y-auto p-2">{visible.map((employee) => <button key={employee.id} onClick={() => setSelectedId(employee.id)} className={`mb-1 flex w-full items-center gap-3 rounded-2xl p-3 text-start transition ${selectedId === employee.id ? "bg-[var(--primary-soft)] text-[var(--primary)]" : "hover:bg-[var(--surface-2)]"}`}><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[var(--surface-2)] font-black">{employee.full_name[0]}</span><span className="min-w-0 flex-1"><b className="block truncate text-xs">{employee.full_name}</b><small dir="ltr" className="mt-1 block truncate text-left text-[9px] opacity-70">{employee.email}</small></span><small className="shrink-0 rounded-full border border-current/20 px-2 py-1 text-[8px] font-black">{roleLabel(employee)}</small></button>)}</div>
      </section>
      <section className="card p-5 sm:p-7">{!selected ? <div className="grid min-h-[420px] place-items-center text-center"><div><KeyRound className="mx-auto text-[var(--muted)]" size={36}/><h2 className="mt-4 font-black">اختر حسابًا لتعديل صلاحياته</h2><p className="mt-2 text-xs text-[var(--muted)]">التغييرات تحفظ مباشرة وتنعكس على قائمة الموظف.</p></div></div> : <><div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--line)] pb-5"><div><h2 className="text-lg font-black">صلاحيات {selected.full_name}</h2><p dir="ltr" className="mt-1 text-left text-xs text-[var(--muted)]">{selected.email}</p></div><span className="rounded-full bg-[var(--primary-soft)] px-3 py-2 text-[10px] font-black text-[var(--primary)]">{roleLabel(selected)}</span></div>{loading ? <div className="grid min-h-[300px] place-items-center"><LoaderCircle className="animate-spin text-[var(--primary)]"/></div> : <div className="mt-5 grid gap-3 sm:grid-cols-2">{permissionDefinitions.map(([key, label]) => { const allowed = values[key] !== false; return <button key={key} onClick={() => toggle(key)} className="flex items-center justify-between gap-4 rounded-2xl border border-[var(--line)] p-4 text-start hover:border-[var(--primary)]"><span><b className="block text-sm">{label}</b><small className="mt-1 block text-[10px] text-[var(--muted)]">{allowed ? "مسموح لهذا الحساب" : "موقوف لهذا الحساب"}</small></span><span className={`relative h-7 w-12 shrink-0 rounded-full transition ${allowed ? "bg-emerald-500" : "bg-slate-300"}`}><i className={`absolute top-1 size-5 rounded-full bg-white shadow transition ${allowed ? "right-1" : "right-6"}`}/></span></button>; })}</div>}</>}</section>
    </div>
  </div></AppShell>;
}
