"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Bell, Bike, BookOpenCheck, Building2, CalendarClock, CalendarDays, CheckCircle2,
  Clock3, FilePenLine, Gauge, Megaphone, MessageSquareText, Sparkles,
  Users,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { HaatPulse } from "@/components/haat-pulse";
import { PwaInstall } from "@/components/pwa-install";
import { ActionTile, SectionHeader, StatCard, StatusPill } from "@/components/ui";
import { useLocale } from "@/components/locale-provider";
import { demoAnnouncements } from "@/lib/demo-data";
import { mockSchedule, type ScheduleEntry } from "@/lib/employee-data";

const DeliveryCoverageChecker = dynamic(
  () => import("@/components/delivery-coverage-checker").then((module) => module.DeliveryCoverageChecker),
  { ssr: false, loading: () => <div className="card min-h-[420px] p-6"><div className="skeleton h-12 w-1/2"/><div className="mt-5 grid gap-4 lg:grid-cols-2"><div className="skeleton h-[310px]"/><div className="skeleton h-[310px]"/></div></div> },
);

export default function Dashboard() {
  const { locale, t } = useLocale();
  const ar = locale === "ar";
  const [schedule, setSchedule] = useState<ScheduleEntry[]>(mockSchedule);
  const [requestCount, setRequestCount] = useState(0);

  useEffect(() => {
    fetch("/api/connecteam/schedule?from=2026-08-03&to=2026-08-10").then((r) => r.json()).then((d) => Array.isArray(d.schedule) && setSchedule(d.schedule)).catch(() => {});
    fetch("/api/requests").then((r) => r.json()).then((d) => setRequestCount((d.requests || []).filter((item: { status: string }) => ["pending", "in_review"].includes(item.status)).length)).catch(() => {});
  }, []);

  const working = useMemo(() => schedule.filter((item) => item.shiftType !== "Day Off"), [schedule]);
  const today = working[0];
  const next = working[1];
  const latest = demoAnnouncements[0];

  return (
    <AppShell title={t.dashboardTitle}>
      <PwaInstall />
      <div className="mx-auto max-w-[1480px] space-y-6">
        <section className="dashboard-welcome">
          <div className="dashboard-hero">
            <div className="hero-shape one"/><div className="hero-shape two"/>
            <div className="relative z-10">
              <span className="hero-kicker"><Sparkles size={14}/>{ar ? "مساحة عملك اليوم" : "Your workspace today"}</span>
              <h2>{ar ? "صباح الخير، محمد 👋" : "Good morning, Mohammad 👋"}</h2>
              <p>{ar ? "المهم أولاً: ورديتك، طلباتك، وأدواتك في مكان واحد." : "Your shift, requests and daily tools — all in one place."}</p>
              <div className="hero-meta"><span><Building2 size={15}/>{ar ? "تشات الزبائن" : "Customer Chat"}</span><span><Clock3 size={15}/>{today ? `${today.start} – ${today.end}` : (ar ? "لا توجد وردية اليوم" : "No shift today")}</span></div>
            </div>
            <Link href="/requests?new=shift_change" className="btn border border-white/20 bg-white !text-[var(--primary)] shadow-lg"><CalendarClock size={17}/>{ar ? "تعديل الوردية" : "Change shift"}</Link>
          </div>
          <article className="card today-block">
            <header><div><span className="text-[9px] font-black text-[var(--primary)]">{ar ? "اليوم" : "TODAY"}</span><h3 className="mt-1 text-sm font-black">{ar ? "حالة الوردية" : "Shift status"}</h3></div><i><CheckCircle2 size={20}/></i></header>
            <div><StatusPill tone="success">{ar ? "الجدول مؤكّد" : "Schedule confirmed"}</StatusPill><strong className="mt-3 block">{today ? `${today.start} — ${today.end}` : (ar ? "إجازة" : "Day off")}</strong><p className="mt-1">{today?.location || (ar ? "لا يوجد موقع محدد" : "No location specified")}</p></div>
            <div><div className="mb-2 flex justify-between text-[9px] font-bold text-[var(--muted)]"><span>{ar ? "تقدّم اليوم" : "Day progress"}</span><b>64%</b></div><div className="today-progress"><i/></div></div>
          </article>
        </section>

        <section>
          <SectionHeader eyebrow={ar ? "وصول بنقرة واحدة" : "ONE-TAP ACCESS"} title={ar ? "ماذا تريد أن تنجز؟" : "What do you want to do?"} description={ar ? "لبنات مباشرة لأكثر المهام استخدامًا بدون البحث بين القوائم." : "Direct actions for your most-used tasks."}/>
          <div className="action-grid">
            <ActionTile href="/requests?new=leave" label={ar ? "طلب إجازة" : "Leave request"} description={ar ? "أرسل الطلب وتابع الموافقة" : "Submit and track approval"} icon={CalendarDays} tone="red"/>
            <ActionTile href="/requests" label={ar ? "متابعة طلباتي" : "Track requests"} description={ar ? "الحالة وملاحظات الإدارة" : "Status and manager notes"} icon={FilePenLine} tone="blue" badge={requestCount}/>
            <ActionTile href="/quick-replies" label={ar ? "رد جاهز" : "Quick reply"} description={ar ? "انسخ الرد المناسب فورًا" : "Copy the right reply instantly"} icon={MessageSquareText} tone="violet"/>
            <ActionTile href="/couriers" label={ar ? "رقم مرسل" : "Courier number"} description={ar ? "ابحث واتصل من نفس الشاشة" : "Search and call directly"} icon={Bike} tone="green"/>
            <ActionTile href="/community" label={ar ? "مجتمع الشركة" : "Company feed"} description={ar ? "المنشورات والتفاعل والرسائل" : "Posts, reactions and messages"} icon={Users} tone="amber"/>
            <ActionTile href="/apps" label={ar ? "أدوات العمل" : "Work tools"} description={ar ? "كل الروابط والأنظمة المهمة" : "All important links and systems"} icon={BookOpenCheck} tone="red"/>
          </div>
        </section>

        <section>
          <SectionHeader eyebrow={ar ? "ملخص حي" : "LIVE SUMMARY"} title={ar ? "أرقامك المهمة" : "Your key numbers"}/>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label={ar ? "درجة الأداء" : "Performance"} value="92%" icon={Gauge} tone="red" trend={5.2} note={ar ? "أعلى من متوسط الفريق" : "Above team average"}/>
            <StatCard label={ar ? "وردية اليوم" : "Today’s shift"} value={today ? `${today.start}–${today.end}` : (ar ? "إجازة" : "Day off")} icon={Clock3} tone="blue" note={today?.location || "—"}/>
            <StatCard label={ar ? "الوردية القادمة" : "Next shift"} value={next ? next.day : "—"} icon={CalendarDays} tone="green" note={next ? `${next.start}–${next.end}` : (ar ? "لا يوجد" : "None")}/>
            <StatCard label={ar ? "طلبات قيد المتابعة" : "Active requests"} value={requestCount} icon={FilePenLine} tone="orange" note={ar ? "تحتاج متابعة" : "Needs follow-up"}/>
          </div>
        </section>

        <section className="dashboard-map">
          <SectionHeader eyebrow={ar ? "أداة تشغيل مباشرة" : "LIVE OPERATIONS TOOL"} title={ar ? "تحقق من منطقة التوصيل" : "Check delivery coverage"} description={ar ? "ابحث باسم المنطقة أو حدّد نقطة على الخريطة وستظهر النتيجة فورًا." : "Search an area or select a point on the map for an instant answer."} action={<StatusPill tone="success">{ar ? "الخريطة فعّالة" : "Map online"}</StatusPill>}/>
          <DeliveryCoverageChecker/>
        </section>

        <div className="grid gap-5 xl:grid-cols-[1.35fr_.65fr]">
          <section className="space-y-5">
            <article className="card overflow-hidden">
              <div className="flex items-center justify-between border-b border-[var(--line)] p-5"><div><span className="text-[9px] font-black text-[var(--primary)]">{ar ? "آخر إعلان" : "LATEST ANNOUNCEMENT"}</span><h3 className="mt-1 font-black">{latest.title}</h3></div><i className="grid size-10 place-items-center rounded-xl bg-[var(--primary-soft)] text-[var(--primary)]"><Megaphone size={19}/></i></div>
              <div className="p-5"><p className="text-xs leading-7 text-[var(--muted)]">{latest.body}</p><div className="mt-4 flex flex-wrap items-center justify-between gap-3"><span className="text-[9px] text-[var(--muted)]">{latest.author?.full_name} • {new Date(latest.published_at!).toLocaleString(ar ? "ar" : "en")}</span><Link href={`/announcements/${latest.id}`} className="btn btn-secondary !min-h-0 !px-3 !py-2 text-[10px]">{ar ? "فتح الإعلان" : "Open announcement"}<ChevronLeftIcon ar={ar}/></Link></div></div>
            </article>
            <HaatPulse/>
          </section>
          <aside>
            <article className="card p-5">
              <div className="flex items-center justify-between"><div><span className="text-[9px] font-black text-[var(--primary)]">{ar ? "قائمة قصيرة" : "SHORT LIST"}</span><h3 className="mt-1 font-black">{ar ? "مهام اليوم" : "Today’s tasks"}</h3></div><Bell size={18} className="text-[var(--primary)]"/></div>
              <div className="mt-4 space-y-2">{[
                ar ? "مراجعة آخر تعميم عاجل" : "Review latest urgent update",
                ar ? "تأكيد جدول الوردية" : "Confirm shift schedule",
                ar ? "إغلاق طلب المتابعة المفتوح" : "Close open follow-up",
              ].map((item,index)=><label key={item} className="flex cursor-pointer items-center gap-3 rounded-xl border border-transparent bg-[var(--surface-2)] p-3 text-[10px] font-bold hover:border-[var(--line)]"><input type="checkbox" defaultChecked={index===1} className="size-4 accent-[var(--primary)]"/><span className={index===1?"text-[var(--muted)] line-through":""}>{item}</span></label>)}</div>
              <Link href="/schedule" className="btn btn-secondary mt-4 w-full">{ar ? "فتح جدولي" : "Open my schedule"}</Link>
            </article>
          </aside>
        </div>
      </div>
    </AppShell>
  );
}

function ChevronLeftIcon({ar}:{ar:boolean}) { return <span aria-hidden className={ar ? "" : "rotate-180"}>←</span>; }
