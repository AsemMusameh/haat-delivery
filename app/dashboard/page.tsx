"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Bell,
  BookOpenCheck,
  Building2,
  CalendarClock,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  Clock3,
  FilePenLine,
  Gauge,
  Megaphone,
  Sparkles,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { HaatPulse } from "@/components/haat-pulse";
import { CoverageMap } from "@/components/coverage-map";
import { DeliveryCoverageChecker } from "@/components/delivery-coverage-checker";
import { PwaInstall } from "@/components/pwa-install";
import { StatCard } from "@/components/ui";
import { useLocale } from "@/components/locale-provider";
import { demoAnnouncements } from "@/lib/demo-data";
import { mockSchedule, type ScheduleEntry } from "@/lib/employee-data";

export default function Dashboard() {
  const { locale, t } = useLocale();
  const ar = locale === "ar";
  const [schedule, setSchedule] = useState<ScheduleEntry[]>(mockSchedule);
  const [requestCount, setRequestCount] = useState(0);
  useEffect(() => {
    fetch("/api/connecteam/schedule?from=2026-08-03&to=2026-08-10")
      .then((r) => r.json())
      .then((d) => Array.isArray(d.schedule) && setSchedule(d.schedule))
      .catch(() => {});
    fetch("/api/requests")
      .then((r) => r.json())
      .then((d) =>
        setRequestCount(
          (d.requests || []).filter((x: { status: string }) =>
            ["pending", "in_review"].includes(x.status),
          ).length,
        ),
      )
      .catch(() => {});
  }, []);
  const working = useMemo(
    () => schedule.filter((s) => s.shiftType !== "Day Off"),
    [schedule],
  );
  const today = working[0];
  const next = working[1];
  const latest = demoAnnouncements[0];
  return (
    <AppShell title={t.dashboardTitle}>
      <PwaInstall />
      <div className="mx-auto max-w-7xl">
        <section className="dashboard-hero mb-6">
          <div className="hero-shape one" />
          <div className="hero-shape two" />
          <div className="relative z-10">
            <span className="hero-kicker">
              <Sparkles size={14} />
              {ar ? "مرحباً بعودتك" : "Welcome back"}
            </span>
            <h2>{ar ? "صباح الخير، محمد 👋" : "Good morning, Mohammad 👋"}</h2>
            <p>
              {ar
                ? "كل ما تحتاجه لبدء ورديتك موجود هنا."
                : "Everything you need to start your shift is here."}
            </p>
            <div className="hero-meta">
              <span>
                <Building2 size={15} />
                {ar ? "تشات الزبائن" : "Customer Chat"}
              </span>
              <span>
                <Clock3 size={15} />
                {today
                  ? `${today.start} – ${today.end}`
                  : "لا توجد وردية اليوم"}
              </span>
            </div>
          </div>
          <Link
            href="/requests?new=shift_change"
            className="btn border-white/20 bg-white !text-[var(--primary)] shadow-lg hover:bg-rose-50"
          >
            <CalendarClock size={17} />
            {ar ? "طلب تعديل وردية" : "Change shift"}
          </Link>
        </section>
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label={ar ? "درجة الأداء" : "Performance"}
            value="92%"
            icon={Gauge}
            tone="red"
            trend={5.2}
            note={ar ? "أعلى من متوسط الفريق" : "Above team average"}
          />
          <StatCard
            label={ar ? "وردية اليوم" : "Today’s shift"}
            value={today ? `${today.start}–${today.end}` : "إجازة"}
            icon={Clock3}
            tone="blue"
            note={today?.location || "—"}
          />
          <StatCard
            label={ar ? "الوردية القادمة" : "Next shift"}
            value={next ? next.day : "—"}
            icon={CalendarDays}
            tone="green"
            note={next ? `${next.start}–${next.end}` : "لا يوجد"}
          />
          <StatCard
            label={ar ? "طلبات قيد المتابعة" : "Active requests"}
            value={requestCount}
            icon={FilePenLine}
            tone="orange"
            note={ar ? "راجع الحالة من نظام الطلبات" : "Track in requests"}
          />
      </div>
      <div className="mb-6">
        <DeliveryCoverageChecker />
      </div>
      <div className="mb-6">
        <CoverageMap />
      </div>
      <div className="grid gap-5 xl:grid-cols-[1.45fr_.85fr]">
          <section className="space-y-5">
            <article className="card overflow-hidden">
              <div className="flex items-center justify-between border-b border-[var(--line)] p-5">
                <div>
                  <span className="text-[10px] font-black text-[var(--primary)]">
                    {ar ? "آخر إعلان" : "LATEST ANNOUNCEMENT"}
                  </span>
                  <h3 className="mt-1 font-black">{latest.title}</h3>
                </div>
                <Megaphone className="text-[var(--primary)]" />
              </div>
              <div className="p-5">
                <p className="text-xs leading-7 text-[var(--muted)]">
                  {latest.body}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-[9px] text-[var(--muted)]">
                    {latest.author?.full_name} •{" "}
                    {new Date(latest.published_at!).toLocaleString(
                      ar ? "ar" : "en",
                    )}
                  </span>
                  <Link
                    href={`/announcements/${latest.id}`}
                    className="inline-flex items-center gap-1 text-[10px] font-black text-[var(--primary)]"
                  >
                    {ar ? "فتح الإعلان" : "Open"}
                    <ChevronLeft size={15} />
                  </Link>
                </div>
              </div>
            </article>
            <article className="card p-5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black text-[var(--primary)]">
                    {ar ? "ابدأ من هنا" : "QUICK ACTIONS"}
                  </span>
                  <h3 className="mt-1 font-black">
                    {ar ? "إجراءات سريعة" : "Quick actions"}
                  </h3>
                </div>
                <CheckCircle2 className="text-emerald-600" />
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <Link
                  href="/requests?new=leave"
                  className="rounded-2xl border border-[var(--line)] bg-[var(--surface-2)] p-4 transition hover:border-rose-200"
                >
                  <CalendarDays className="text-[var(--primary)]" size={21} />
                  <b className="mt-3 block text-xs">طلب إجازة</b>
                  <span className="mt-1 block text-[9px] text-[var(--muted)]">
                    أرسل وتابع الموافقة
                  </span>
                </Link>
                <Link
                  href="/requests?new=shift_change"
                  className="rounded-2xl border border-[var(--line)] bg-[var(--surface-2)] p-4 transition hover:border-rose-200"
                >
                  <CalendarClock className="text-[var(--primary)]" size={21} />
                  <b className="mt-3 block text-xs">تعديل وردية</b>
                  <span className="mt-1 block text-[9px] text-[var(--muted)]">
                    تغيير أو تبديل الموعد
                  </span>
                </Link>
                <Link
                  href="/quick-replies"
                  className="rounded-2xl border border-[var(--line)] bg-[var(--surface-2)] p-4 transition hover:border-rose-200"
                >
                  <BookOpenCheck className="text-[var(--primary)]" size={21} />
                  <b className="mt-3 block text-xs">دليل العمل</b>
                  <span className="mt-1 block text-[9px] text-[var(--muted)]">
                    السياسات والردود الجاهزة
                  </span>
                </Link>
              </div>
            </article>
          </section>
          <aside className="space-y-5">
            <HaatPulse />
            <article className="card p-5">
              <div className="flex items-center justify-between">
                <h3 className="font-black">مهام اليوم</h3>
                <Bell size={18} className="text-[var(--primary)]" />
              </div>
              <div className="mt-4 space-y-3">
                {[
                  "مراجعة آخر تعميم عاجل",
                  "تأكيد جدول الوردية",
                  "إغلاق طلب المتابعة المفتوح",
                ].map((item, index) => (
                  <label
                    key={item}
                    className="flex items-center gap-3 rounded-xl bg-[var(--surface-2)] p-3 text-[10px] font-bold"
                  >
                    <input
                      type="checkbox"
                      defaultChecked={index === 1}
                      className="accent-[var(--primary)]"
                    />
                    {item}
                  </label>
                ))}
              </div>
            </article>
          </aside>
        </div>
      </div>
    </AppShell>
  );
}
