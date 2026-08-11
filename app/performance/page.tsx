"use client";

import { useState } from "react";
import {
  AlertTriangle, Award, CheckCircle2, Clock3, Database, FileSpreadsheet, Sparkles,
  TrendingUp, UploadCloud, X,
} from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { PageIntro, SectionHeader, StatCard, StatusPill } from "@/components/ui";
import { mockPerformance } from "@/lib/employee-data";

const stats = [
  { label: "Overall Score", value: "92", note: "+5.2%", icon: Award, tone: "red" as const },
  { label: "ترتيب القسم", value: "#3", note: "من 32 Agent", icon: TrendingUp, tone: "blue" as const },
  { label: "Attendance", value: "97%", note: "28 يوم عمل", icon: CheckCircle2, tone: "green" as const },
  { label: "Overtime", value: "14h", note: "هذا الشهر", icon: Clock3, tone: "orange" as const },
  { label: "الأخطاء", value: "2", note: "-3 عن السابق", icon: AlertTriangle, tone: "red" as const },
];

type PreviewRow = Record<string, unknown>;

export default function Performance() {
  const latest = mockPerformance.at(-1)!;
  const [importOpen, setImportOpen] = useState(false);
  const [fileName, setFileName] = useState("");
  const [rows, setRows] = useState<PreviewRow[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [parsing, setParsing] = useState(false);

  const readFile = async (file?: File) => {
    if (!file) return;
    setParsing(true);
    try {
      const XLSX = await import("xlsx");
      const workbook = XLSX.read(await file.arrayBuffer(), { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const parsed = XLSX.utils.sheet_to_json<PreviewRow>(sheet, { defval: "" });
      const nextHeaders = Array.from(new Set(parsed.slice(0, 20).flatMap((row) => Object.keys(row))));
      setFileName(file.name);
      setRows(parsed);
      setHeaders(nextHeaders);
      toast.success(`تمت قراءة ${parsed.length} صف بنجاح`);
    } catch {
      toast.error("تعذر قراءة الملف. تأكد أنه Excel أو CSV صالح.");
    } finally {
      setParsing(false);
    }
  };

  const clearFile = () => { setFileName(""); setRows([]); setHeaders([]); };

  return <AppShell title="الأداء والإحصائيات" action={<button className="btn btn-primary hidden sm:flex" onClick={() => setImportOpen(true)}><UploadCloud size={17}/>استيراد ملف</button>}>
    <div className="mx-auto max-w-[1480px] space-y-6">
      <PageIntro eyebrow="PERFORMANCE CENTER" title="أداؤك واضح، قابل للقياس، وسهل المتابعة" description="تابع المؤشرات، قارن الفترات، واستورد ملفات Excel أو CSV لمعاينة البيانات قبل ربطها بقواعد التقييم." icon={Sparkles} action={<select className="input w-full sm:w-44"><option>آخر 6 أشهر</option><option>هذا الشهر</option><option>هذه السنة</option><option>طوال فترة العمل</option></select>}/>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">{stats.map(({ label, value, note, icon, tone }) => <StatCard key={label} label={label} value={value} note={note} icon={icon} tone={tone}/>)}</div>

      <div className="grid gap-5 xl:grid-cols-[1.35fr_.65fr]">
        <section className="card p-5 sm:p-6">
          <SectionHeader eyebrow="6 MONTHS" title="تطور الأداء" description="Overall Score بحسب الشهر" action={<StatusPill tone="success">+5.2%</StatusPill>}/>
          <div className="mt-7 flex h-64 items-end gap-3 border-b border-[var(--line)] px-2">{mockPerformance.map((month) => <div key={month.period} className="flex flex-1 flex-col items-center gap-2"><span className="text-[10px] font-bold text-[var(--primary)]">{month.overall}%</span><i className="w-full max-w-16 rounded-t-xl bg-gradient-to-t from-[#990525] to-[#f43c5c] shadow-[0_8px_18px_rgba(217,21,58,.16)] transition hover:brightness-110" style={{ height: `${month.overall * 2}px` }}/><small className="text-[9px] text-[var(--muted)]">{month.period}</small></div>)}</div>
        </section>
        <section className="card p-5 sm:p-6">
          <SectionHeader eyebrow="SCORE MIX" title="مكونات التقييم"/>
          <div className="mt-5 space-y-5">{[["Quality", latest.quality], ["Productivity", latest.productivity], ["Attendance", latest.attendance], ["Reviews", latest.reviews], ["Compliance", latest.compliance]].map(([label, value]) => <div key={String(label)}><div className="mb-2 flex justify-between text-[10px]"><b>{label}</b><span>{value}%</span></div><div className="h-2 rounded-full bg-[var(--surface-2)]"><i className="block h-full rounded-full bg-gradient-to-l from-[var(--primary)] to-amber-400" style={{ width: `${value}%` }}/></div></div>)}</div>
          <div className="mt-6 rounded-xl border border-[var(--line)] bg-[var(--surface-2)] p-4 text-[10px] leading-6 text-[var(--muted)]">Quality 35% · Productivity 25% · Attendance 15% · Reviews 15% · Compliance 10%</div>
        </section>
      </div>

      <section className="card overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 p-5 sm:p-6"><div className="flex items-center gap-3"><i className="grid size-11 place-items-center rounded-2xl bg-emerald-50 text-emerald-700"><Database size={20}/></i><div><span className="text-[9px] font-black text-[var(--primary)]">DATA IMPORT LAB</span><h3 className="mt-1 font-black">استيراد ملفات الأداء</h3><p className="mt-1 text-[10px] text-[var(--muted)]">قراءة Excel وCSV، اكتشاف الأعمدة، ومعاينة القيم قبل اعتماد طريقة الحساب.</p></div></div><button className="btn btn-secondary" onClick={() => setImportOpen((value) => !value)}>{importOpen ? "إخفاء الاستيراد" : "فتح الاستيراد"}<FileSpreadsheet size={17}/></button></div>
        {importOpen && <div className="border-t border-[var(--line)] bg-[var(--surface-2)] p-5 sm:p-6">
          {!fileName ? <label className="grid min-h-48 cursor-pointer place-items-center rounded-2xl border-2 border-dashed border-[var(--line)] bg-[var(--surface)] p-6 text-center hover:border-[var(--primary)]"><div><i className="mx-auto grid size-13 place-items-center rounded-2xl bg-[var(--primary-soft)] text-[var(--primary)]"><UploadCloud/></i><b className="mt-4 block text-sm">{parsing ? "جارٍ قراءة الملف..." : "اسحب الملف هنا أو اضغط للاختيار"}</b><span className="mt-2 block text-[10px] text-[var(--muted)]">Excel (.xlsx, .xls) أو CSV — تتم المعاينة داخل المتصفح</span></div><input type="file" className="hidden" accept=".xlsx,.xls,.csv" disabled={parsing} onChange={(event) => readFile(event.target.files?.[0])}/></label> : <div>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-emerald-800"><div className="flex items-center gap-2"><CheckCircle2 size={18}/><div><b className="block text-xs">{fileName}</b><span className="text-[9px]">{rows.length} صف · {headers.length} عمود · جاهز لتحديد القيم</span></div></div><button onClick={clearFile} className="grid size-8 place-items-center rounded-lg bg-white/70" aria-label="إزالة الملف"><X size={16}/></button></div>
            <div className="overflow-x-auto rounded-2xl border border-[var(--line)] bg-[var(--surface)]"><table className="min-w-[760px] text-start"><thead><tr>{headers.slice(0, 8).map((header) => <th key={header} className="whitespace-nowrap p-3 text-[9px] font-black text-[var(--muted)]">{header}</th>)}</tr></thead><tbody>{rows.slice(0, 5).map((row, index) => <tr key={index} className="border-t border-[var(--line)]">{headers.slice(0, 8).map((header) => <td key={header} className="max-w-48 truncate p-3 text-[9px]">{String(row[header] ?? "")}</td>)}</tr>)}</tbody></table></div>
            <p className="mt-3 text-[9px] text-[var(--muted)]">هذه معاينة فقط. عند تزويدي بقاعدة قراءة الملف سنربط كل عمود بالمؤشر الصحيح ونحفظ النتائج تلقائيًا.</p>
          </div>}
        </div>}
      </section>
    </div>
  </AppShell>;
}
