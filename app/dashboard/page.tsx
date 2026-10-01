"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BookOpenCheck, ChartNoAxesCombined, CheckCircle2, FilePenLine, Megaphone, MessageSquareText, Sparkles, Users } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { PwaInstall } from "@/components/pwa-install";
import { ActionTile, SectionHeader, StatCard, StatusPill } from "@/components/ui";
import { useLocale } from "@/components/locale-provider";
import { useAnnouncements, useProfile } from "@/lib/hooks";

const DeliveryCoverageChecker = dynamic(
  () => import("@/components/delivery-coverage-checker").then((module) => module.DeliveryCoverageChecker),
  { ssr: false, loading: () => <div className="card min-h-[420px] p-6"><div className="skeleton h-12 w-1/2"/><div className="mt-5 grid gap-4 lg:grid-cols-2"><div className="skeleton h-[310px]"/><div className="skeleton h-[310px]"/></div></div> },
);

export default function Dashboard() {
  const { locale, t } = useLocale();
  const ar = locale === "ar";
  const [requestCount, setRequestCount] = useState(0);
  const profile = useProfile();
  const { data: announcements } = useAnnouncements();
  const latest = announcements[0];

  useEffect(() => {
    fetch("/api/requests").then((r) => r.json()).then((d) => setRequestCount((d.requests || []).filter((item: { status: string }) => ["pending", "in_review"].includes(item.status)).length)).catch(() => {});
  }, []);

  return <AppShell title={t.dashboardTitle}>
    <PwaInstall />
    <div className="mx-auto max-w-[1480px] space-y-7">
      <section className="dashboard-hero">
        <div className="hero-shape one"/><div className="hero-shape two"/>
        <div className="relative z-10"><span className="hero-kicker"><Sparkles size={14}/>{ar ? "مساحة عمليات HAAT" : "HAAT OPERATIONS HUB"}</span><h2>{ar ? `أهلاً ${profile.full_name} 👋` : `Welcome, ${profile.full_name} 👋`}</h2><p>{ar ? "مساحة عملك جاهزة. أضف بياناتك وابدأ العمل." : "Your clean workspace is ready for real data."}</p><div className="hero-meta"><span><CheckCircle2 size={15}/>{ar ? "الحساب نشط" : "Active account"}</span><span>{profile.department?.name}</span></div></div>
      </section>

      <section><SectionHeader eyebrow={ar ? "وصول سريع" : "QUICK ACCESS"} title={ar ? "ماذا تريد أن تنجز؟" : "What do you want to do?"}/><div className="action-grid"><ActionTile href="/requests?new=leave" label={ar ? "طلب جديد" : "New request"} description={ar ? "أرسل الطلب وتابع الموافقة" : "Submit and track approval"} icon={FilePenLine} tone="red"/><ActionTile href="/requests" label={ar ? "متابعة طلباتي" : "Track requests"} description={ar ? "الحالة وملاحظات الإدارة" : "Status and manager notes"} icon={FilePenLine} tone="blue" badge={requestCount}/><ActionTile href="/quick-replies" label={ar ? "رد جاهز" : "Quick reply"} description={ar ? "انسخ الرد المناسب فورًا" : "Copy the right reply instantly"} icon={MessageSquareText} tone="violet"/><ActionTile href="/apps" label={ar ? "أدوات العمل" : "Work tools"} description={ar ? "كل الروابط والأنظمة المهمة" : "All important links and systems"} icon={BookOpenCheck} tone="red"/></div></section>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><StatCard label={ar ? "تقييم QA" : "QA score"} value="—" icon={ChartNoAxesCombined} tone="red" note={ar ? "لا توجد بيانات بعد" : "No data yet"}/><StatCard label={ar ? "ترتيب القسم" : "Department rank"} value="—" icon={Users} tone="blue" note={ar ? "لا توجد بيانات بعد" : "No data yet"}/><StatCard label={ar ? "طلبات قيد المتابعة" : "Active requests"} value={requestCount} icon={FilePenLine} tone="orange" note={ar ? "بيانات فعلية" : "Live data"}/><StatCard label={ar ? "التعميمات" : "Announcements"} value={announcements.length} icon={Megaphone} tone="green" note={ar ? "ابدأ بإضافة أول تعميم" : "Add the first announcement"}/></div>

      <section className="dashboard-map"><SectionHeader eyebrow={ar ? "أداة تشغيل مباشرة" : "LIVE OPERATIONS TOOL"} title={ar ? "تحقق من منطقة التوصيل" : "Check delivery coverage"} description={ar ? "ابحث باسم المنطقة أو حدّد نقطة على الخريطة وستظهر النتيجة فورًا." : "Search an area or select a point on the map for an instant answer."} action={<StatusPill tone="success">{ar ? "الخريطة فعّالة" : "Map online"}</StatusPill>}/><DeliveryCoverageChecker/></section>

      <article className="card overflow-hidden"><div className="flex items-center justify-between border-b border-[var(--line)] p-5"><div><span className="text-[9px] font-black text-[var(--primary)]">{ar ? "التعميمات" : "ANNOUNCEMENTS"}</span><h3 className="mt-1 font-black">{latest ? latest.title : (ar ? "لا توجد تعميمات بعد" : "No announcements yet")}</h3></div><i className="grid size-10 place-items-center rounded-xl bg-[var(--primary-soft)] text-[var(--primary)]"><Megaphone size={19}/></i></div><div className="p-5"><p className="text-xs leading-7 text-[var(--muted)]">{latest ? latest.body : (ar ? "ستظهر هنا التعميمات التي تضيفها الإدارة." : "Announcements added by management will appear here.")}</p>{latest && <Link href={`/announcements/${latest.id}`} className="btn btn-secondary mt-4 !min-h-0 !px-3 !py-2 text-[10px]">{ar ? "فتح التعميم" : "Open announcement"}</Link>}</div></article>
    </div>
  </AppShell>;
}
