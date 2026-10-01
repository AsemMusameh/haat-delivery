"use client";

import { BadgePercent, ClipboardList, ExternalLink, FileSpreadsheet, Gauge, Link2, MonitorCog, Search, Store, TriangleAlert } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { useLocale } from "@/components/locale-provider";
import { PageIntro } from "@/components/ui";
import { defaultTools, type ToolColor, type ToolIcon, type WorkTool } from "@/lib/content-defaults";

const icons: Record<ToolIcon, typeof Gauge> = { dashboard: Gauge, store: Store, coupon: BadgePercent, sheet: FileSpreadsheet, form: ClipboardList, warning: TriangleAlert, device: MonitorCog, link: Link2 };
const colors: Record<ToolColor, string> = { rose: "from-rose-600 to-red-700", orange: "from-orange-500 to-amber-600", pink: "from-fuchsia-600 to-pink-600", green: "from-emerald-600 to-green-700", blue: "from-sky-600 to-blue-700", purple: "from-violet-600 to-purple-700", slate: "from-slate-700 to-slate-900" };

export default function AppsPage() {
  const { locale } = useLocale();
  const ar = locale === "ar";
  const [query, setQuery] = useState("");
  const [tools, setTools] = useState<WorkTool[]>(defaultTools);

  useEffect(() => {
    fetch("/api/content", { cache: "no-store" })
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((data) => data.tools?.length && setTools(data.tools))
      .catch(() => undefined);
  }, []);

  const visibleTools = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return tools;
    return tools.filter((tool) => `${tool.titleAr} ${tool.titleEn} ${tool.descriptionAr} ${tool.descriptionEn}`.toLowerCase().includes(value));
  }, [query, tools]);

  return <AppShell title={ar ? "الروابط والاستخدام" : "Links & Tools"}>
    <div className="mx-auto max-w-6xl">
      <div className="mb-6"><PageIntro eyebrow={ar?"وصول سريع وآمن":"FAST, RELIABLE ACCESS"} title={ar?"كل أدوات العمل في مكان واحد":"All your work tools in one place"} description={ar?"اختر الأداة المطلوبة وافتحها مباشرة مع بقاء بوابة الموظف أمامك.":"Open the tool you need while keeping the HAAT workspace available."} icon={ExternalLink} action={<label className="relative block w-full sm:w-72"><Search className="absolute start-4 top-1/2 -translate-y-1/2 text-[var(--muted)]" size={18}/><input className="input ps-11" value={query} onChange={(event)=>setQuery(event.target.value)} placeholder={ar?"ابحث عن أداة...":"Search tools..."}/></label>}/></div>
      <div className="mb-4 flex items-center justify-between gap-3"><div><h3 className="text-xl font-black">{ar?"أدوات الموظف":"Employee tools"}</h3><p className="mt-1 text-xs text-[var(--muted)]">{ar?`${visibleTools.length} روابط جاهزة للاستخدام`:`${visibleTools.length} links ready to use`}</p></div><span className="rounded-full bg-emerald-50 px-3 py-1.5 text-[10px] font-black text-emerald-700 ring-1 ring-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-300">● {ar?"متاحة الآن":"Available now"}</span></div>
      {visibleTools.length?<section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{visibleTools.map((tool)=>{const Icon=icons[tool.icon]??Link2;return <a key={tool.id} href={tool.url} target="_blank" rel="noopener noreferrer" className="group card relative flex min-h-56 flex-col overflow-hidden p-5 transition duration-200 hover:-translate-y-1 hover:border-rose-200 hover:shadow-[0_20px_45px_rgba(126,0,34,.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]" aria-label={`${ar?"فتح":"Open"} ${ar?tool.titleAr:tool.titleEn}`}><div className="flex items-start justify-between gap-3"><span className={`grid size-13 place-items-center rounded-2xl bg-gradient-to-br ${colors[tool.color]??colors.rose} text-white shadow-lg`}><Icon size={24}/></span><span className="grid size-9 place-items-center rounded-xl bg-[var(--surface-2)] text-[var(--muted)] transition group-hover:bg-[var(--primary)] group-hover:text-white"><ExternalLink size={17}/></span></div><h4 className="mt-5 text-lg font-black">{ar?tool.titleAr:tool.titleEn}</h4><p className="mt-2 flex-1 text-sm leading-7 text-[var(--muted)]">{ar?tool.descriptionAr:tool.descriptionEn}</p><div className="mt-4 flex items-center justify-between border-t border-[var(--line)] pt-4"><span className="text-xs font-black text-[var(--primary)]">{ar?"فتح الآن":"Open now"}</span><span className="text-[10px] font-bold text-[var(--muted)]">↗</span></div></a>})}</section>:<div className="card p-10 text-center"><Search className="mx-auto text-[var(--muted)]" size={30}/><h3 className="mt-3 font-black">{ar?"لم نجد أداة بهذا الاسم":"No matching tool found"}</h3><button className="mt-3 text-xs font-black text-[var(--primary)]" onClick={()=>setQuery("")}>{ar?"عرض كل الروابط":"Show all links"}</button></div>}
    </div>
  </AppShell>;
}
