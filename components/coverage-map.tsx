"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarClock, CheckCircle2, Clock3, ExternalLink, Map, MapPin, MoonStar, Phone, Search, Sunrise, TestTube2 } from "lucide-react";
import { coverageAreas as defaultCoverageAreas, type CoverageArea } from "@/lib/coverage-areas";

const moroccoCodes = new Set([28, 36, 37, 40, 41, 42]);
const mapQuery = (area: CoverageArea) => `${area.name}, ${moroccoCodes.has(area.code) ? "Morocco" : "Palestine"}`;

export function CoverageMap() {
  const [coverageAreas, setCoverageAreas] = useState<CoverageArea[]>(defaultCoverageAreas);
  const [selected, setSelected] = useState(defaultCoverageAreas.find((area) => area.code === 17) ?? defaultCoverageAreas[0]);
  const [query, setQuery] = useState("");
  const [showTests, setShowTests] = useState(false);

  useEffect(() => {
    fetch("/api/coverage").then((response) => response.json()).then((data) => {
      if (Array.isArray(data.areas) && data.areas.length) setCoverageAreas(data.areas);
    }).catch(() => {});
  }, []);

  const visible = useMemo(() => coverageAreas.filter((area) =>
    (showTests || area.status !== "test") && `${area.code} ${area.name} ${area.nameAr}`.toLowerCase().includes(query.toLowerCase()),
  ), [coverageAreas, query, showTests]);
  const scheduledAreas = visible.filter((area) => area.hours?.length);
  const location = mapQuery(selected);

  return <section className="card overflow-hidden">
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--line)] p-5">
      <div className="flex items-center gap-3"><i className="grid size-11 place-items-center rounded-2xl bg-[var(--primary-soft)] text-[var(--primary)]"><Map /></i><div><span className="text-[9px] font-black text-[var(--primary)]">HAAT COVERAGE MAP</span><h2 className="mt-1 text-base font-black">خارطة مناطق التشغيل</h2><p className="mt-1 text-[9px] text-[var(--muted)]">{coverageAreas.filter((area) => area.status !== "test").length} منطقة ورمز تشغيلي • خريطة Google حقيقية</p></div></div>
      <label className="relative w-full sm:w-64"><Search className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" size={15}/><input className="input h-10 pr-9" placeholder="ابحث بالمنطقة أو الرقم..." value={query} onChange={(event) => setQuery(event.target.value)}/></label>
    </header>

    <div className="grid lg:grid-cols-[1.15fr_.85fr]">
      <div className="relative min-h-[610px] overflow-hidden bg-slate-100">
        <iframe key={location} title={`Google Maps - ${selected.name}`} src={`https://www.google.com/maps?q=${encodeURIComponent(location)}&output=embed`} className="absolute inset-0 size-full border-0" loading="lazy" allowFullScreen referrerPolicy="no-referrer-when-downgrade"/>
        <div className="absolute inset-x-4 bottom-4 rounded-[26px] border border-white/80 bg-white/95 p-4 shadow-2xl backdrop-blur dark:border-white/10 dark:bg-black/80 sm:p-5">
          <div className="flex items-start justify-between gap-3"><div className="min-w-0"><span className="text-[9px] font-black text-[var(--primary)]">المنطقة المحددة على Google Maps</span><h3 className="mt-1 text-lg font-black">{selected.nameAr}</h3><p dir="ltr" className="mt-1 truncate text-start text-[10px] text-[var(--muted)]">{selected.name}</p>{selected.phone && <a dir="ltr" className="mt-2 inline-flex items-center gap-1 text-xs font-black text-[var(--primary)]" href={`tel:${selected.phone.replace(/\D/g, "")}`}><Phone size={13}/>{selected.phone}</a>}{selected.hours?.[0] && <div className="mt-3 flex flex-wrap items-center gap-2 text-[8px] font-black"><span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-amber-700"><Sunrise size={11}/>{selected.hours[0].start}</span><span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-1 text-indigo-700"><MoonStar size={11}/>{selected.hours[0].end}</span>{selected.hours.length > 1 && <span className="rounded-full bg-[var(--primary-soft)] px-2 py-1 text-[var(--primary)]">+{selected.hours.length - 1} نطاق فرعي</span>}</div>}</div><div className="flex shrink-0 items-center gap-2"><a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`} target="_blank" rel="noreferrer" className="grid size-11 place-items-center rounded-2xl border border-[var(--line)] bg-white text-[var(--primary)] shadow-sm" aria-label="فتح في Google Maps"><ExternalLink size={17}/></a><span className="grid size-12 place-items-center rounded-2xl bg-[var(--primary)] text-lg font-black text-white">#{selected.code}</span></div></div>
        </div>
      </div>

      <aside className="flex min-h-[610px] flex-col p-5">
        <div className="flex items-center justify-between"><div><h3 className="font-black">دليل المناطق</h3><p className="mt-1 text-[9px] text-[var(--muted)]">اضغط على المنطقة لعرض موقعها الحقيقي</p></div><button onClick={() => setShowTests(!showTests)} className={`rounded-full px-3 py-1.5 text-[8px] font-bold ${showTests ? "bg-slate-700 text-white" : "bg-slate-100 text-slate-600"}`}><TestTube2 size={11} className="inline"/> {showTests ? "إخفاء التجريبي" : "إظهار التجريبي"}</button></div>
        <div className="mt-4 grid max-h-[520px] gap-2 overflow-y-auto pe-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          {visible.map((area) => <button key={area.code} onClick={() => setSelected(area)} className={`flex items-center gap-3 rounded-2xl border p-3 text-start transition ${selected.code === area.code ? "border-[var(--primary)] bg-[var(--primary-soft)]" : "border-[var(--line)] bg-[var(--surface-2)] hover:border-rose-200"}`}><span className={`grid size-9 shrink-0 place-items-center rounded-xl text-[10px] font-black ${area.status === "test" ? "bg-slate-500 text-white" : area.status === "pilot" ? "bg-amber-500 text-white" : "bg-white text-[var(--primary)] shadow-sm dark:bg-[var(--surface)]"}`}>{area.code}</span><span className="min-w-0"><b className="block truncate text-[9px]">{area.nameAr}</b><small dir="ltr" className="mt-1 block truncate text-start text-[7px] text-[var(--muted)]">{area.name}</small>{area.phone && <small dir="ltr" className="mt-1 block text-start text-[7px] font-bold text-[var(--primary)]">{area.phone}</small>}{area.hours?.[0] && <small className="mt-1 flex items-center gap-1 text-[7px] font-bold text-emerald-700"><Clock3 size={9}/>{area.hours[0].start} — {area.hours[0].end}</small>}</span>{selected.code === area.code && <CheckCircle2 className="ms-auto shrink-0 text-[var(--primary)]" size={15}/>}</button>)}
        </div>
        <div className="mt-auto flex items-start gap-2 rounded-2xl bg-emerald-50 p-3 text-[9px] leading-5 text-emerald-800"><MapPin size={15} className="mt-0.5 shrink-0"/>اختر المنطقة من الدليل لتظهر مباشرة على الخريطة بدون نقاط مرسومة أو مناطق متداخلة.</div>
      </aside>
    </div>

    <div className="border-t border-[var(--line)] bg-[var(--surface-2)] p-5 sm:p-7">
      <div className="flex flex-wrap items-end justify-between gap-4"><div className="flex items-center gap-3"><i className="grid size-11 place-items-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg shadow-amber-500/20"><CalendarClock size={21}/></i><div><span className="text-[9px] font-black text-[var(--primary)]">OPERATING HOURS</span><h3 className="mt-1 text-lg font-black">ساعات عمل المناطق</h3><p className="mt-1 text-[9px] text-[var(--muted)]">الأوقات المعتمدة حسب آخر جدول تشغيل مرفق.</p></div></div><span className="rounded-full border border-[var(--line)] bg-[var(--surface)] px-3 py-2 text-[9px] font-black text-[var(--muted)]">{scheduledAreas.length} منطقة ظاهرة</span></div>
      <div className="mt-5 grid gap-3 md:grid-cols-2 2xl:grid-cols-3">{scheduledAreas.map((area) => <article key={`hours-${area.code}`} className="group overflow-hidden rounded-[22px] border border-[var(--line)] bg-[var(--surface)] shadow-sm transition duration-200 hover:-translate-y-1 hover:border-[color-mix(in_srgb,var(--primary)_30%,var(--line))] hover:shadow-xl"><header className="flex items-center gap-3 border-b border-[var(--line)] p-4"><span className="grid size-10 shrink-0 place-items-center rounded-[14px] bg-[var(--primary)] text-[11px] font-black text-white shadow-lg">{area.code}</span><div className="min-w-0 flex-1"><h4 className="truncate text-xs font-black">{area.nameAr}</h4><p dir="ltr" className="mt-1 truncate text-start text-[7px] text-[var(--muted)]">{area.name}</p></div><Clock3 size={17} className="text-[var(--primary)] opacity-60 transition group-hover:opacity-100"/></header><div className="space-y-2 p-3">{area.hours!.map((hours, index) => <div key={`${area.code}-${index}`} className="rounded-2xl bg-[var(--surface-2)] p-3">{hours.zone && <b className="mb-2 block text-[9px]">{hours.zone}</b>}<div className="grid grid-cols-2 gap-2"><span className="flex items-center gap-2 rounded-xl bg-amber-50 px-3 py-2 text-amber-800 dark:bg-amber-950/35 dark:text-amber-300"><Sunrise size={15}/><span><small className="block text-[6px] font-bold opacity-70">بداية العمل</small><b className="text-[9px]">{hours.start}</b></span></span><span className="flex items-center gap-2 rounded-xl bg-indigo-50 px-3 py-2 text-indigo-800 dark:bg-indigo-950/35 dark:text-indigo-300"><MoonStar size={15}/><span><small className="block text-[6px] font-bold opacity-70">نهاية العمل</small><b className="text-[9px]">{hours.end}</b></span></span></div>{hours.exception && <p className="mt-2 rounded-xl border border-dashed border-rose-200 bg-rose-50 px-3 py-2 text-[8px] font-bold leading-5 text-rose-700 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-300">استثناء: {hours.exception}</p>}</div>)}</div></article>)}{!scheduledAreas.length && <div className="col-span-full rounded-2xl border border-dashed border-[var(--line)] bg-[var(--surface)] p-10 text-center text-xs text-[var(--muted)]">لا توجد ساعات عمل مطابقة للبحث الحالي.</div>}</div>
    </div>
  </section>;
}
