"use client";

import {
  AlertTriangle, CalendarDays, CheckCircle2, Clock3, FileImage, FileText, ImagePlus,
  LoaderCircle, Maximize2, Send, Sparkles, Trash2, Trophy, UserRound, X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { demoEmployees } from "@/lib/demo-data";
import { useProfile } from "@/lib/hooks";
import type { DailyReport, MonthlyReport, ReportCategory } from "@/lib/report-store";

type ReportView = "daily" | "monthly";

const apiHeaders = () => {
  const token = window.localStorage.getItem("haat-session-token") || "";
  return { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
};

const today = () => new Date().toISOString().slice(0, 10);
const thisMonth = () => new Date().toISOString().slice(0, 7);
const reportTypes: { value: ReportCategory; label: string }[] = [
  { value: "voice", label: "تقرير فويس سنتر" },
  { value: "connecteam", label: "تقرير كونيكت تيم" },
  { value: "chat", label: "تقرير تشات" },
];
const reportTypeLabel = (value: ReportCategory) => reportTypes.find((item) => item.value === value)?.label || "تقرير تشات";
const categoryForDepartment = (departmentId: string): ReportCategory => {
  if (["voice-center", "shift-managers-voice"].includes(departmentId)) return "voice";
  if (departmentId === "connect-teams-updates") return "connecteam";
  return "chat";
};
const displayDate = (value: string) => new Intl.DateTimeFormat("ar-PS", { dateStyle: "long" }).format(new Date(`${value}T12:00:00`));
const displayMonth = (value: string) => new Intl.DateTimeFormat("ar-PS", { month: "long", year: "numeric" }).format(new Date(`${value}-01T12:00:00`));

async function compressImage(file: File) {
  if (!file.type.startsWith("image/")) throw new Error("اختر ملف صورة فقط");
  if (file.size > 12_000_000) throw new Error("حجم الصورة الأصلية يجب أن يكون أقل من 12MB");
  const bitmap = await createImageBitmap(file);
  const maxSide = 1800;
  const ratio = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(bitmap.width * ratio));
  canvas.height = Math.max(1, Math.round(bitmap.height * ratio));
  const context = canvas.getContext("2d");
  if (!context) throw new Error("تعذر تجهيز الصورة");
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  let quality = 0.86;
  let data = canvas.toDataURL("image/webp", quality);
  while (data.length > 1_300_000 && quality > 0.45) {
    quality -= 0.08;
    data = canvas.toDataURL("image/webp", quality);
  }
  if (data.length > 1_400_000) throw new Error("تعذر ضغط الصورة بما يكفي، اختر صورة أصغر");
  return data;
}

export function ReportsCenter({ view }: { view: ReportView }) {
  const fallbackProfile = useProfile();
  const [activeProfile, setActiveProfile] = useState(fallbackProfile);
  const [dailyReports, setDailyReports] = useState<DailyReport[]>([]);
  const [monthlyReports, setMonthlyReports] = useState<MonthlyReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedImage, setSelectedImage] = useState<MonthlyReport | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const [activeReportType, setActiveReportType] = useState<ReportCategory>("voice");
  const [daily, setDaily] = useState({ reportDate: today(), reportType: "voice" as ReportCategory, shift: "المسائي", title: "", summary: "", achievements: "", challenges: "", notes: "" });
  const [monthly, setMonthly] = useState({ reportMonth: thisMonth(), reportType: "voice" as ReportCategory, title: "", note: "", imageData: "", imageName: "" });

  useEffect(() => {
    const id = window.localStorage.getItem("haat-current-user");
    const current = demoEmployees.find((employee) => employee.id === id);
    if (current) {
      setActiveProfile(current);
      if (!["manager", "admin"].includes(current.role) && current.department_id !== "quality-assurance") {
        const reportType = categoryForDepartment(current.department_id);
        setActiveReportType(reportType);
        setDaily((value) => ({ ...value, reportType }));
      }
    }
  }, []);

  const canPublish = view === "daily" ? activeProfile.role === "supervisor" : ["manager", "admin"].includes(activeProfile.role);
  const canViewAllTypes = ["manager", "admin"].includes(activeProfile.role) || activeProfile.department_id === "quality-assurance";
  const availableReportTypes = canViewAllTypes ? reportTypes : reportTypes.filter((item) => item.value === categoryForDepartment(activeProfile.department_id));
  const visibleDailyReports = useMemo(() => dailyReports.filter((report) => report.reportType === activeReportType), [dailyReports, activeReportType]);
  const visibleMonthlyReports = useMemo(() => monthlyReports.filter((report) => report.reportType === activeReportType), [monthlyReports, activeReportType]);
  const reports = view === "daily" ? visibleDailyReports : visibleMonthlyReports;
  const title = view === "daily" ? "التقارير اليومية" : "التقارير الشهرية";

  const load = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/operational-reports?type=${view}`, { headers: apiHeaders() });
      const data = await response.json() as { reports?: DailyReport[] | MonthlyReport[]; scope?: ReportCategory | null; error?: string };
      if (!response.ok) throw new Error(data.error || "تعذر تحميل التقارير");
      if (data.scope) {
        setActiveReportType(data.scope);
        setDaily((value) => ({ ...value, reportType: data.scope! }));
      }
      if (view === "daily") setDailyReports((data.reports || []) as DailyReport[]);
      else setMonthlyReports((data.reports || []) as MonthlyReport[]);
    } catch (error) { toast.error(error instanceof Error ? error.message : "تعذر تحميل التقارير"); }
    finally { setLoading(false); }
  };

  useEffect(() => { void load(); }, [view]);

  const submitDaily = async () => {
    if (!daily.reportDate || !daily.shift || !daily.title.trim() || !daily.summary.trim()) return toast.error("أكمل التاريخ والوردية والعنوان والملخص");
    setSaving(true);
    try {
      const response = await fetch("/api/operational-reports", { method: "POST", headers: apiHeaders(), body: JSON.stringify({ type: "daily", ...daily }) });
      const result = await response.json() as { report?: DailyReport; error?: string };
      if (!response.ok || !result.report) throw new Error(result.error || "تعذر نشر التقرير");
      setDailyReports((items) => [result.report!, ...items]);
      setActiveReportType(daily.reportType);
      setDaily({ reportDate: today(), reportType: daily.reportType, shift: daily.shift, title: "", summary: "", achievements: "", challenges: "", notes: "" });
      toast.success("تم نشر التقرير اليومي");
    } catch (error) { toast.error(error instanceof Error ? error.message : "تعذر نشر التقرير"); }
    finally { setSaving(false); }
  };

  const chooseImage = async (file?: File) => {
    if (!file) return;
    setSaving(true);
    try {
      const imageData = await compressImage(file);
      setMonthly((value) => ({ ...value, imageData, imageName: file.name }));
      toast.success("تم تجهيز الصورة للرفع");
    } catch (error) { toast.error(error instanceof Error ? error.message : "تعذر تجهيز الصورة"); }
    finally { setSaving(false); }
  };

  const submitMonthly = async () => {
    if (!monthly.reportMonth || !monthly.title.trim() || !monthly.imageData) return toast.error("اختر الشهر، واكتب العنوان، وأضف صورة التقرير");
    setSaving(true);
    try {
      const response = await fetch("/api/operational-reports", { method: "POST", headers: apiHeaders(), body: JSON.stringify({ type: "monthly", ...monthly }) });
      const result = await response.json() as { report?: MonthlyReport; error?: string };
      if (!response.ok || !result.report) throw new Error(result.error || "تعذر نشر التقرير");
      setMonthlyReports((items) => [result.report!, ...items]);
      setActiveReportType(monthly.reportType);
      setMonthly({ reportMonth: thisMonth(), reportType: monthly.reportType, title: "", note: "", imageData: "", imageName: "" });
      if (fileInput.current) fileInput.current.value = "";
      toast.success("تم نشر التقرير الشهري");
    } catch (error) { toast.error(error instanceof Error ? error.message : "تعذر نشر التقرير"); }
    finally { setSaving(false); }
  };

  const remove = async (type: ReportView, id: string) => {
    if (!window.confirm("هل تريد حذف هذا التقرير؟")) return;
    try {
      const response = await fetch(`/api/operational-reports?type=${type}&id=${encodeURIComponent(id)}`, { method: "DELETE", headers: apiHeaders() });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error || "تعذر حذف التقرير");
      if (type === "daily") setDailyReports((items) => items.filter((item) => item.id !== id));
      else setMonthlyReports((items) => items.filter((item) => item.id !== id));
      toast.success("تم حذف التقرير");
    } catch (error) { toast.error(error instanceof Error ? error.message : "تعذر حذف التقرير"); }
  };

  const monthlyByYear = useMemo(() => {
    const groups = new Map<string, MonthlyReport[]>();
    visibleMonthlyReports.forEach((report) => {
      const year = report.reportMonth.slice(0, 4);
      groups.set(year, [...(groups.get(year) || []), report]);
    });
    return Array.from(groups.entries());
  }, [visibleMonthlyReports]);

  return <AppShell title={title}>
    <div className="mx-auto max-w-7xl space-y-6">
      <section className="page-intro">
        <div className="page-intro-copy"><i>{view === "daily" ? <FileText size={25} /> : <FileImage size={25} />}</i><div><span>تقارير Tulkarm Office</span><h2>{title}</h2><p>{view === "daily" ? "متابعة يومية موثقة من مسؤولي الشفتات." : "أرشيف صور النتائج والأرقام التي تنشرها الإدارة كل شهر."}</p></div></div>
      </section>

      <div className={`grid gap-3 ${availableReportTypes.length > 1 ? "sm:grid-cols-3" : "sm:grid-cols-1"}`}>{availableReportTypes.map((item) => <button key={item.value} type="button" onClick={() => { setActiveReportType(item.value); setDaily((current) => ({ ...current, reportType: item.value })); setMonthly((current) => ({ ...current, reportType: item.value })); }} className={`rounded-2xl border p-4 text-sm font-black transition ${activeReportType === item.value ? "border-[var(--primary)] bg-[var(--primary)] text-white shadow-lg" : "border-[var(--line)] bg-[var(--surface)] hover:border-[var(--primary)]"}`}>{item.label}<span className={`mt-1 block text-[10px] ${activeReportType === item.value ? "text-white/75" : "text-[var(--muted)]"}`}>{(view === "daily" ? dailyReports : monthlyReports).filter((report) => report.reportType === item.value).length} تقارير</span></button>)}</div>

      {canPublish && view === "daily" && <section className="card p-5 sm:p-6">
        <div className="mb-5 flex items-center gap-3"><i className="row-icon"><FileText size={19} /></i><div><h3 className="font-black">إضافة تقرير يومي</h3><p className="text-xs text-[var(--muted)]">هذه الخانة متاحة لمسؤولي الشفتات فقط.</p></div></div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"><label className="text-xs font-bold">نوع التقرير<select className="input mt-2" value={daily.reportType} onChange={(event) => { const reportType = event.target.value as ReportCategory; setDaily({ ...daily, reportType }); setActiveReportType(reportType); }}>{availableReportTypes.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label><label className="text-xs font-bold">تاريخ التقرير<input type="date" className="input mt-2" value={daily.reportDate} onChange={(event) => setDaily({ ...daily, reportDate: event.target.value })} /></label><label className="text-xs font-bold">الوردية<select className="input mt-2" value={daily.shift} onChange={(event) => setDaily({ ...daily, shift: event.target.value })}><option>الصباحي</option><option>المسائي</option><option>الليلي</option><option>وردية كاملة</option></select></label><label className="text-xs font-bold">عنوان التقرير<input className="input mt-2" value={daily.title} onChange={(event) => setDaily({ ...daily, title: event.target.value })} placeholder="مثال: ملخص الوردية المسائية" /></label></div>
        <label className="mt-4 block text-xs font-bold">ملخص العمل<textarea className="input mt-2 min-h-28" value={daily.summary} onChange={(event) => setDaily({ ...daily, summary: event.target.value })} placeholder="أهم ما حدث خلال الوردية..." /></label>
        <div className="mt-4 grid gap-4 md:grid-cols-2"><label className="text-xs font-bold">الإنجازات<textarea className="input mt-2 min-h-24" value={daily.achievements} onChange={(event) => setDaily({ ...daily, achievements: event.target.value })} placeholder="ما تم إنجازه..." /></label><label className="text-xs font-bold">الملاحظات والتحديات<textarea className="input mt-2 min-h-24" value={daily.challenges} onChange={(event) => setDaily({ ...daily, challenges: event.target.value })} placeholder="أي تحديات أو نقاط تحتاج متابعة..." /></label></div>
        <label className="mt-4 block text-xs font-bold">ملاحظات إضافية<input className="input mt-2" value={daily.notes} onChange={(event) => setDaily({ ...daily, notes: event.target.value })} placeholder="اختياري" /></label>
        <button className="btn btn-primary mt-5" disabled={saving} onClick={submitDaily}>{saving ? <LoaderCircle className="animate-spin" size={17} /> : <Send size={17} />}{saving ? "جارٍ النشر..." : "نشر التقرير اليومي"}</button>
      </section>}

      {canPublish && view === "monthly" && <section className="card p-5 sm:p-6">
        <div className="mb-5 flex items-center gap-3"><i className="row-icon"><ImagePlus size={19} /></i><div><h3 className="font-black">إضافة تقرير شهري</h3><p className="text-xs text-[var(--muted)]">ارفع صورة الأرقام، وسيتم ترتيبها وضغطها تلقائياً.</p></div></div>
        <div className="grid gap-4 md:grid-cols-3"><label className="text-xs font-bold">قسم التقرير<select className="input mt-2" value={monthly.reportType} onChange={(event) => { const reportType = event.target.value as ReportCategory; setMonthly({ ...monthly, reportType }); setActiveReportType(reportType); }}>{availableReportTypes.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label><label className="text-xs font-bold">شهر التقرير<input type="month" className="input mt-2" value={monthly.reportMonth} onChange={(event) => setMonthly({ ...monthly, reportMonth: event.target.value })} /></label><label className="text-xs font-bold">عنوان التقرير<input className="input mt-2" value={monthly.title} onChange={(event) => setMonthly({ ...monthly, title: event.target.value })} placeholder="مثال: نتائج شهر سبتمبر" /></label></div>
        <label className="mt-4 block text-xs font-bold">ملاحظة مختصرة<textarea className="input mt-2 min-h-20" value={monthly.note} onChange={(event) => setMonthly({ ...monthly, note: event.target.value })} placeholder="اختياري" /></label>
        <input ref={fileInput} type="file" accept="image/png,image/jpeg,image/webp" hidden onChange={(event) => void chooseImage(event.target.files?.[0])} />
        <button type="button" onClick={() => fileInput.current?.click()} className="mt-4 grid min-h-48 w-full place-items-center overflow-hidden rounded-2xl border-2 border-dashed border-[var(--line)] bg-[var(--surface-2)] p-4 hover:border-[var(--primary)]">
          {monthly.imageData ? <img src={monthly.imageData} alt="معاينة التقرير" className="max-h-80 w-full object-contain" /> : <span className="grid place-items-center gap-2 text-xs font-bold text-[var(--muted)]"><ImagePlus className="text-[var(--primary)]" size={32} />اضغط لاختيار صورة التقرير</span>}
        </button>
        {monthly.imageName && <p className="mt-2 text-center text-[10px] text-[var(--muted)]">{monthly.imageName}</p>}
        <button className="btn btn-primary mt-5" disabled={saving} onClick={submitMonthly}>{saving ? <LoaderCircle className="animate-spin" size={17} /> : <Send size={17} />}{saving ? "جارٍ النشر..." : "نشر التقرير الشهري"}</button>
      </section>}

      {loading ? <div className="card grid min-h-52 place-items-center"><LoaderCircle className="animate-spin text-[var(--primary)]" /></div> : reports.length === 0 ? <div className="card grid min-h-64 place-items-center p-8 text-center"><div><i className="mx-auto grid size-14 place-items-center rounded-2xl bg-[var(--primary-soft)] text-[var(--primary)]">{view === "daily" ? <CalendarDays /> : <FileImage />}</i><h3 className="mt-4 font-black">لا توجد تقارير حتى الآن</h3><p className="mt-2 text-xs text-[var(--muted)]">سيظهر أول تقرير هنا فور نشره.</p></div></div> : null}

      {!loading && view === "daily" && visibleDailyReports.length > 0 && <div className="space-y-4">{visibleDailyReports.map((report) => <article className="card overflow-hidden" key={report.id}><header className="flex flex-wrap items-center gap-3 border-b border-[var(--line)] bg-[var(--surface-2)] px-5 py-4"><i className="grid size-11 place-items-center rounded-xl bg-[var(--primary-soft)] text-[var(--primary)]"><CalendarDays size={20} /></i><div className="min-w-0 flex-1"><h3 className="truncate font-black">{report.title}</h3><p className="mt-1 text-[11px] text-[var(--muted)]">{displayDate(report.reportDate)} · {report.shift}</p></div><span className="badge read">{reportTypeLabel(report.reportType)}</span><span className="badge">{report.department}</span>{(report.authorId === activeProfile.id || ['manager', 'admin'].includes(activeProfile.role)) && <button onClick={() => void remove("daily", report.id)} className="toolbar-btn text-rose-500" aria-label="حذف التقرير"><Trash2 size={16} /></button>}</header><div className="p-5"><p className="whitespace-pre-wrap text-sm leading-7">{report.summary}</p>{(report.achievements || report.challenges) && <div className="mt-5 grid gap-4 md:grid-cols-2">{report.achievements && <div className="rounded-2xl bg-emerald-50/70 p-4 text-emerald-950 dark:bg-emerald-950/20 dark:text-emerald-100"><h4 className="flex items-center gap-2 text-xs font-black"><Trophy size={16} />الإنجازات</h4><p className="mt-2 whitespace-pre-wrap text-xs leading-6">{report.achievements}</p></div>}{report.challenges && <div className="rounded-2xl bg-amber-50/70 p-4 text-amber-950 dark:bg-amber-950/20 dark:text-amber-100"><h4 className="flex items-center gap-2 text-xs font-black"><AlertTriangle size={16} />الملاحظات والتحديات</h4><p className="mt-2 whitespace-pre-wrap text-xs leading-6">{report.challenges}</p></div>}</div>}{report.notes && <p className="mt-4 rounded-xl border border-[var(--line)] p-3 text-xs text-[var(--muted)]">{report.notes}</p>}<footer className="mt-5 flex flex-wrap items-center gap-3 border-t border-[var(--line)] pt-4 text-[10px] text-[var(--muted)]"><span className="flex items-center gap-1"><UserRound size={13} />{report.authorName}</span><span className="flex items-center gap-1"><Clock3 size={13} />{new Date(report.createdAt).toLocaleString("ar-PS")}</span></footer></div></article>)}</div>}

      {!loading && view === "monthly" && visibleMonthlyReports.length > 0 && <div className="space-y-8">{monthlyByYear.map(([year, items]) => <section key={year}><div className="mb-4 flex items-center gap-3"><span className="h-px flex-1 bg-[var(--line)]" /><h3 className="rounded-full bg-[var(--surface-2)] px-4 py-2 text-xs font-black">{year}</h3><span className="h-px flex-1 bg-[var(--line)]" /></div><div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{items.map((report) => <article className="card group overflow-hidden" key={report.id}><button type="button" onClick={() => setSelectedImage(report)} className="relative block aspect-[4/3] w-full overflow-hidden bg-[var(--surface-2)]"><img src={report.imageData} alt={report.title} className="size-full object-contain transition duration-300 group-hover:scale-[1.02]" /><span className="absolute bottom-3 left-3 grid size-9 place-items-center rounded-full bg-black/60 text-white"><Maximize2 size={16} /></span></button><div className="p-5"><div className="flex items-start gap-3"><i className="grid size-10 shrink-0 place-items-center rounded-xl bg-[var(--primary-soft)] text-[var(--primary)]"><Sparkles size={18} /></i><div className="min-w-0 flex-1"><p className="text-[10px] font-bold text-[var(--primary)]">{displayMonth(report.reportMonth)}</p><h3 className="mt-1 truncate font-black">{report.title}</h3><span className="badge read mt-2">{reportTypeLabel(report.reportType)}</span></div>{(report.authorId === activeProfile.id || ['manager', 'admin'].includes(activeProfile.role)) && <button onClick={() => void remove("monthly", report.id)} className="text-rose-500" aria-label="حذف التقرير"><Trash2 size={16} /></button>}</div>{report.note && <p className="mt-4 text-xs leading-6 text-[var(--muted)]">{report.note}</p>}<footer className="mt-4 flex items-center gap-2 border-t border-[var(--line)] pt-3 text-[10px] text-[var(--muted)]"><CheckCircle2 size={13} className="text-emerald-500" />نشر بواسطة {report.authorName}</footer></div></article>)}</div></section>)}</div>}
    </div>

    {selectedImage && <div className="fixed inset-0 z-[80] grid place-items-center bg-black/85 p-3 sm:p-8" onMouseDown={() => setSelectedImage(null)}><section className="relative flex max-h-full w-full max-w-6xl flex-col overflow-hidden rounded-3xl bg-white" onMouseDown={(event) => event.stopPropagation()}><header className="flex items-center gap-3 border-b p-4 text-slate-900"><div className="min-w-0 flex-1"><b className="block truncate">{selectedImage.title}</b><span className="text-xs text-slate-500">{displayMonth(selectedImage.reportMonth)}</span></div><button className="grid size-10 place-items-center rounded-full bg-slate-100" onClick={() => setSelectedImage(null)} aria-label="إغلاق"><X size={20} /></button></header><div className="min-h-0 flex-1 overflow-auto bg-slate-100 p-2 sm:p-5"><img src={selectedImage.imageData} alt={selectedImage.title} className="mx-auto max-h-[78vh] max-w-full object-contain" /></div></section></div>}
  </AppShell>;
}
