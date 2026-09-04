"use client";

import { Download, Send } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { AppShell, SearchBox } from "@/components/app-shell";
import { Progress } from "@/components/ui";
import { demoAnnouncements, demoEmployees, departments as demoDepartments } from "@/lib/demo-data";
import { useAnnouncements, useDepartments, useEmployees } from "@/lib/hooks";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import type { Profile } from "@/lib/types";
import { formatDate } from "@/lib/utils";

type ReadRow = { user_id: string; read_at: string };
type TargetRow = { target_type: "all" | "department" | "user"; department_id: string | null; user_id: string | null };

export default function Reports() {
  const { data: announcements, loading } = useAnnouncements();
  const employees = useEmployees();
  const departments = useDepartments();
  const [selectedId, setSelectedId] = useState("");
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<"read" | "unread">("read");
  const [reads, setReads] = useState<ReadRow[]>([]);
  const [targets, setTargets] = useState<TargetRow[]>([]);
  const [sending, setSending] = useState(false);

  const sourceAnnouncements = announcements.length ? announcements : isSupabaseConfigured ? [] : demoAnnouncements;
  const sourceEmployees = employees.length ? employees : isSupabaseConfigured ? [] : demoEmployees;
  const sourceDepartments = departments.length ? departments : isSupabaseConfigured ? [] : demoDepartments;
  const selected = sourceAnnouncements.find((item) => item.id === selectedId) ?? sourceAnnouncements[0];

  useEffect(() => {
    if (!selectedId && sourceAnnouncements[0]) setSelectedId(sourceAnnouncements[0].id);
  }, [selectedId, sourceAnnouncements]);

  useEffect(() => {
    if (!selected || !isSupabaseConfigured) {
      if (selected) setReads(demoEmployees.slice(0, selected.read_count).map((item) => ({ user_id: item.id, read_at: item.last_sign_in_at ?? new Date().toISOString() })));
      return;
    }
    const supabase = createClient()!;
    Promise.all([
      supabase.from("announcement_reads").select("user_id,read_at").eq("announcement_id", selected.id),
      supabase.from("announcement_targets").select("target_type,department_id,user_id").eq("announcement_id", selected.id),
    ]).then(([readResult, targetResult]) => {
      if (readResult.error || targetResult.error) return toast.error(readResult.error?.message ?? targetResult.error?.message ?? "تعذر تحميل التقرير");
      setReads((readResult.data ?? []) as ReadRow[]);
      setTargets((targetResult.data ?? []) as TargetRow[]);
    });
  }, [selected?.id]);

  const recipients = useMemo(() => {
    if (!selected) return [] as Profile[];
    if (!isSupabaseConfigured) return sourceEmployees;
    if (targets.some((item) => item.target_type === "all")) return sourceEmployees.filter((item) => item.is_active);
    const users = new Set(targets.filter((item) => item.target_type === "user").map((item) => item.user_id));
    const departmentIds = new Set(targets.filter((item) => item.target_type === "department").map((item) => item.department_id));
    return sourceEmployees.filter((item) => item.is_active && (users.has(item.id) || departmentIds.has(item.department_id)));
  }, [selected, sourceEmployees, targets]);

  const readMap = useMemo(() => new Map(reads.map((item) => [item.user_id, item.read_at])), [reads]);
  const readEmployees = recipients.filter((item) => readMap.has(item.id));
  const unreadEmployees = recipients.filter((item) => !readMap.has(item.id));
  const visibleEmployees = tab === "read" ? readEmployees : unreadEmployees;
  const recipientCount = recipients.length || selected?.recipient_count || 0;
  const readCount = readEmployees.length || selected?.read_count || 0;
  const rate = recipientCount ? Math.round((readCount / recipientCount) * 100) : 0;
  const departmentStats = sourceDepartments.map((department) => {
    const members = recipients.filter((item) => item.department_id === department.id);
    const read = members.filter((item) => readMap.has(item.id)).length;
    return { ...department, total: members.length, read, rate: members.length ? Math.round((read / members.length) * 100) : 0 };
  }).filter((item) => item.total > 0);
  const filteredAnnouncements = sourceAnnouncements.filter((item) => item.title.toLowerCase().includes(query.trim().toLowerCase()));

  const exportCsv = () => {
    if (!selected) return;
    const rows = [["الرقم الوظيفي", "الاسم", "القسم", "الحالة", "وقت القراءة"], ...recipients.map((employee) => [employee.employee_id, employee.full_name, employee.department?.name ?? "", readMap.has(employee.id) ? "قرأ" : "لم يقرأ", readMap.get(employee.id) ?? ""])];
    const csv = rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `reading-report-${selected.id}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const notifyUnread = async () => {
    if (!selected || !unreadEmployees.length) return toast.info("لا يوجد موظفون غير قارئين");
    setSending(true);
    try {
      if (!isSupabaseConfigured) return toast.success(`تم إرسال إشعار تجريبي إلى ${unreadEmployees.length} موظف`);
      const response = await fetch("/api/push/send", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ announcementId: selected.id, onlyUnread: true }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "تعذر إرسال الإشعارات");
      toast.success(`تم إشعار ${result.inApp ?? 0} موظف غير قارئ`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "تعذر إرسال الإشعارات");
    } finally {
      setSending(false);
    }
  };

  return <AppShell admin title="تقارير القراءة" action={<button onClick={exportCsv} disabled={!selected} className="btn btn-secondary hidden sm:flex"><Download size={17}/>تصدير CSV</button>}>
    <div className="grid gap-6 xl:grid-cols-[330px_1fr]">
      <aside className="card h-fit overflow-hidden">
        <div className="border-b border-[var(--line)] p-4"><h2 className="mb-3 font-black">اختر تعميمًا</h2><SearchBox placeholder="بحث..." value={query} onChange={setQuery}/></div>
        {loading ? <p className="p-5 text-xs text-[var(--muted)]">جارٍ تحميل التعميمات...</p> : filteredAnnouncements.length ? filteredAnnouncements.map((item) => {
          const itemRate = item.recipient_count ? Math.round(item.read_count / item.recipient_count * 100) : 0;
          return <button key={item.id} onClick={() => setSelectedId(item.id)} className={`block w-full border-b border-[var(--line)] p-4 text-right last:border-0 ${selected?.id === item.id ? "bg-[var(--primary-soft)]" : "hover:bg-[var(--surface-2)]"}`}><b className="line-clamp-2 text-xs leading-6">{item.title}</b><div className="mt-2 flex justify-between text-[10px] text-[var(--muted)]"><span>{formatDate(item.published_at)}</span><b className="text-[var(--primary)]">{itemRate}%</b></div></button>;
        }) : <p className="p-5 text-xs text-[var(--muted)]">لا توجد تعميمات مطابقة.</p>}
      </aside>
      {!selected ? <section className="card grid min-h-72 place-items-center p-6 text-sm text-[var(--muted)]">لا يوجد تعميم منشور لعرض تقريره.</section> : <section className="space-y-5">
        <div className="card p-5 sm:p-6">
          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-start"><div><span className="text-xs font-bold text-[var(--primary)]">تقرير التعميم</span><h2 className="mt-2 text-lg font-black">{selected.title}</h2><p className="mt-2 text-xs text-[var(--muted)]">نُشر بواسطة {selected.author?.full_name ?? "الإدارة"} · {formatDate(selected.published_at)}</p></div><button onClick={notifyUnread} disabled={sending || !unreadEmployees.length} className="btn btn-primary text-xs"><Send size={16}/>{sending ? "جارٍ الإرسال..." : "إشعار غير القارئين"}</button></div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4"><Metric label="المستلمون" value={recipientCount}/><Metric label="قرأوا" value={readCount} tone="green"/><Metric label="لم يقرؤوا" value={Math.max(recipientCount - readCount, 0)} tone="red"/><Metric label="نسبة القراءة" value={`${rate}%`} tone="blue"/></div>
        </div>
        <div className="card p-5 sm:p-6"><h3 className="mb-5 font-black">حسب القسم</h3>{departmentStats.length ? <div className="space-y-4">{departmentStats.map((department) => <div key={department.id} className="grid grid-cols-[1fr_45px] items-center gap-3"><div><div className="mb-2 flex justify-between text-xs"><b>{department.name}</b><span className="text-[var(--muted)]">{department.read}/{department.total}</span></div><Progress value={department.rate}/></div><b className="text-left text-xs text-[var(--primary)]">{department.rate}%</b></div>)}</div> : <p className="text-xs text-[var(--muted)]">لا توجد بيانات أقسام لهذا التعميم.</p>}</div>
        <div className="card overflow-hidden"><div className="flex items-center justify-between border-b border-[var(--line)] p-5"><div className="flex gap-2"><button onClick={() => setTab("read")} className={`rounded-lg px-3 py-2 text-xs font-bold ${tab === "read" ? "bg-emerald-50 text-emerald-700" : "text-[var(--muted)]"}`}>قرأوا ({readCount})</button><button onClick={() => setTab("unread")} className={`rounded-lg px-3 py-2 text-xs font-bold ${tab === "unread" ? "bg-red-50 text-red-700" : "text-[var(--muted)]"}`}>لم يقرؤوا ({Math.max(recipientCount - readCount, 0)})</button></div><button onClick={exportCsv} aria-label="تصدير CSV" className="text-[var(--primary)]"><Download size={18}/></button></div><div className="overflow-x-auto"><table className="w-full min-w-[560px] text-right text-xs"><thead className="bg-[var(--surface-2)] text-[var(--muted)]"><tr><th className="p-4">الموظف</th><th className="p-4">القسم</th><th className="p-4">الرقم الوظيفي</th><th className="p-4">{tab === "read" ? "وقت القراءة" : "الحالة"}</th></tr></thead><tbody>{visibleEmployees.map((employee) => <tr key={employee.id} className="border-t border-[var(--line)]"><td className="p-4 font-bold">{employee.full_name}</td><td className="p-4">{employee.department?.name}</td><td className="p-4">{employee.employee_id}</td><td className="p-4 text-[var(--muted)]">{tab === "read" ? formatDate(readMap.get(employee.id) ?? "") : "بانتظار القراءة"}</td></tr>)}{!visibleEmployees.length && <tr><td colSpan={4} className="p-8 text-center text-[var(--muted)]">لا توجد سجلات في هذه القائمة.</td></tr>}</tbody></table></div></div>
      </section>}
    </div>
  </AppShell>;
}

function Metric({ label, value, tone = "" }: { label: string; value: string | number; tone?: string }) {
  return <div className={`rounded-xl bg-[var(--surface-2)] p-4 ${tone === "green" ? "text-emerald-600" : tone === "red" ? "text-red-600" : tone === "blue" ? "text-blue-600" : ""}`}><span className="block text-[10px] text-[var(--muted)]">{label}</span><b className="mt-1 block text-2xl">{value}</b></div>;
}
