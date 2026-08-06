"use client";

import {
  BadgePercent,
  ClipboardList,
  ExternalLink,
  FileSpreadsheet,
  Gauge,
  MonitorCog,
  Search,
  Store,
  TriangleAlert,
} from "lucide-react";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { useLocale } from "@/components/locale-provider";

const tools = [
  {
    id: "backoffice",
    titleAr: "داشبورد الطلبات",
    titleEn: "Orders Dashboard",
    descriptionAr: "متابعة الطلبات، حالتها، والتفاصيل التشغيلية من مكان واحد.",
    descriptionEn: "Track orders, statuses, and operational details in one place.",
    category: "operations",
    href: "https://backoffice-dashboard.haat.delivery/login",
    icon: Gauge,
    tone: "from-rose-600 to-red-700",
  },
  {
    id: "menu",
    titleAr: "إدارة المنيو",
    titleEn: "Menu Management",
    descriptionAr: "الدخول إلى صفحات المطاعم والماركت وتحديث بيانات المنيو.",
    descriptionEn: "Open restaurant and market pages and manage menu information.",
    category: "operations",
    href: "https://business-management-dashboard.haat.delivery/login?callbackUrl=%2Frestaurants",
    icon: Store,
    tone: "from-orange-500 to-amber-600",
  },
  {
    id: "coupons",
    titleAr: "صفحة الكوبونات",
    titleEn: "Coupons Dashboard",
    descriptionAr: "مراجعة الكوبونات والعروض الترويجية وإدارتها بسهولة.",
    descriptionEn: "Review and manage coupons and promotional offers.",
    category: "operations",
    href: "https://marketing-dashboard.haat.delivery/login?callbackUrl=%2Fpromo-coupon",
    icon: BadgePercent,
    tone: "from-fuchsia-600 to-pink-600",
  },
  {
    id: "accounts",
    titleAr: "شيت الحسابات",
    titleEn: "Accounts Sheet",
    descriptionAr: "فتح شيت الحسابات المشترك ومراجعة البيانات المطلوبة.",
    descriptionEn: "Open the shared accounts sheet and review the required data.",
    category: "forms",
    href: "https://docs.google.com/spreadsheets/d/1cebn91RrukmCX0Ve-nFWTqUo_Y93sOJRV8fDmLn-1cc/edit?gid=1232803912#gid=1232803912",
    icon: FileSpreadsheet,
    tone: "from-emerald-600 to-green-700",
  },
  {
    id: "restaurant-compensation",
    titleAr: "تعويضات المطاعم",
    titleEn: "Restaurant Compensation",
    descriptionAr: "تعبئة نموذج تعويضات المطاعم وإرسال الحالة للمتابعة.",
    descriptionEn: "Submit restaurant compensation cases for follow-up.",
    category: "forms",
    href: "https://docs.google.com/forms/d/e/1FAIpQLSeSkB6S6bW_CTf2C3OG6_nF51oXF1BgxZEsZigHJZp6uCXBPg/viewform",
    icon: ClipboardList,
    tone: "from-sky-600 to-blue-700",
  },
  {
    id: "driver-violations",
    titleAr: "شكوى على مرسل",
    titleEn: "Driver Violations",
    descriptionAr: "تسجيل مخالفات المرسلين وإرسال الشكوى للجهة المختصة.",
    descriptionEn: "Report driver violations to the responsible team.",
    category: "forms",
    href: "https://forms.monday.com/forms/88c41518b98addf89d696de234dba968?r=use1",
    icon: TriangleAlert,
    tone: "from-violet-600 to-purple-700",
  },
  {
    id: "devices",
    titleAr: "مشاكل الأجهزة (تيكت)",
    titleEn: "Device Issues Ticket",
    descriptionAr: "فتح تيكت لمشاكل أجهزة المخاشير ومتابعة طلب الصيانة.",
    descriptionEn: "Open a ticket for device issues and follow up on maintenance.",
    category: "forms",
    href: "https://devices.haat.delivery/",
    icon: MonitorCog,
    tone: "from-slate-700 to-slate-900",
  },
] as const;

export default function AppsPage() {
  const { locale } = useLocale();
  const ar = locale === "ar";
  const [query, setQuery] = useState("");

  const visibleTools = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return tools;
    return tools.filter((tool) =>
      `${tool.titleAr} ${tool.titleEn} ${tool.descriptionAr} ${tool.descriptionEn}`
        .toLowerCase()
        .includes(value),
    );
  }, [query]);

  return (
    <AppShell title={ar ? "الروابط والاستخدام" : "Links & Tools"}>
      <div className="mx-auto max-w-6xl">
        <section className="relative mb-6 overflow-hidden rounded-[28px] bg-gradient-to-l from-[#79001f] via-[#b20d35] to-[#e62d54] p-6 text-white shadow-[0_22px_55px_rgba(135,0,35,.2)] sm:p-8">
          <div className="absolute -left-16 -top-20 size-56 rounded-full border-[35px] border-white/10" />
          <div className="absolute -bottom-24 right-1/3 size-52 rounded-full bg-amber-300/10" />
          <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-[11px] font-black backdrop-blur">
                <ExternalLink size={14} /> {ar ? "وصول سريع وآمن" : "Fast, reliable access"}
              </span>
              <h2 className="mt-4 text-2xl font-black sm:text-3xl">
                {ar ? "كل أدوات العمل في مكان واحد" : "All your work tools in one place"}
              </h2>
              <p className="mt-3 text-sm leading-7 text-rose-50 sm:text-base">
                {ar
                  ? "اختر الأداة المطلوبة واضغط فتح الآن. سيتم فتحها في نافذة جديدة حتى تبقى بوابة الموظف أمامك."
                  : "Choose a tool and open it in a new tab while keeping the employee hub available."}
              </p>
            </div>
            <label className="relative block w-full max-w-md text-slate-900">
              <Search className="absolute start-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                className="h-12 w-full rounded-2xl border border-white/50 bg-white ps-11 pe-4 text-sm font-bold outline-none ring-0 placeholder:text-slate-400 focus:border-amber-300"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={ar ? "ابحث عن رابط أو أداة..." : "Search tools and links..."}
              />
            </label>
          </div>
        </section>

        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h3 className="text-xl font-black">{ar ? "أدوات الموظف" : "Employee tools"}</h3>
            <p className="mt-1 text-xs text-[var(--muted)]">
              {ar ? `${visibleTools.length} روابط جاهزة للاستخدام` : `${visibleTools.length} links ready to use`}
            </p>
          </div>
          <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-[10px] font-black text-emerald-700 ring-1 ring-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-300">
            ● {ar ? "متاحة الآن" : "Available now"}
          </span>
        </div>

        {visibleTools.length ? (
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {visibleTools.map((tool) => {
              const Icon = tool.icon;
              return (
                <a
                  key={tool.id}
                  href={tool.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group card relative flex min-h-56 flex-col overflow-hidden p-5 transition duration-200 hover:-translate-y-1 hover:border-rose-200 hover:shadow-[0_20px_45px_rgba(126,0,34,.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
                  aria-label={`${ar ? "فتح" : "Open"} ${ar ? tool.titleAr : tool.titleEn}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className={`grid size-13 place-items-center rounded-2xl bg-gradient-to-br ${tool.tone} text-white shadow-lg`}>
                      <Icon size={24} />
                    </span>
                    <span className="grid size-9 place-items-center rounded-xl bg-[var(--surface-2)] text-[var(--muted)] transition group-hover:bg-[var(--primary)] group-hover:text-white">
                      <ExternalLink size={17} />
                    </span>
                  </div>
                  <h4 className="mt-5 text-lg font-black">{ar ? tool.titleAr : tool.titleEn}</h4>
                  <p className="mt-2 flex-1 text-sm leading-7 text-[var(--muted)]">
                    {ar ? tool.descriptionAr : tool.descriptionEn}
                  </p>
                  <div className="mt-4 flex items-center justify-between border-t border-[var(--line)] pt-4">
                    <span className="text-xs font-black text-[var(--primary)]">{ar ? "فتح الآن" : "Open now"}</span>
                    <span className="text-[10px] font-bold text-[var(--muted)]">↗</span>
                  </div>
                </a>
              );
            })}
          </section>
        ) : (
          <div className="card p-10 text-center">
            <Search className="mx-auto text-[var(--muted)]" size={30} />
            <h3 className="mt-3 font-black">{ar ? "لم نجد أداة بهذا الاسم" : "No matching tool found"}</h3>
            <button className="mt-3 text-xs font-black text-[var(--primary)]" onClick={() => setQuery("")}>
              {ar ? "عرض كل الروابط" : "Show all links"}
            </button>
          </div>
        )}
      </div>
    </AppShell>
  );
}
