"use client";
import { useEffect, useState } from "react";
import {
  CalendarDays,
  CloudCog,
  Coffee,
  MapPin,
  RefreshCw,
  Timer,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { mockSchedule, type ScheduleEntry } from "@/lib/employee-data";
export default function Schedule() {
  const [items, setItems] = useState<ScheduleEntry[]>(mockSchedule);
  const [connected, setConnected] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const load = () => {
    setLoading(true);
    fetch("/api/connecteam/schedule?from=2026-08-03&to=2026-08-10")
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d.schedule)) setItems(d.schedule);
        setConnected(!!d.connected);
        setMessage(d.message || "");
      })
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    const timer = window.setTimeout(load, 0);
    return () => window.clearTimeout(timer);
  }, []);
  return (
    <AppShell title="جدول الدوام">
      <div className="mx-auto max-w-7xl">
        <section className="rounded-[28px] bg-gradient-to-l from-[#7c0018] to-[#df3151] p-7 text-white">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-black text-amber-200">
                CONNECTEAM SYNC
              </span>
              <h2 className="mt-2 text-3xl font-black">وردياتي لهذا الأسبوع</h2>
              <p className="mt-2 text-xs text-rose-100">
                المواعيد، الاستراحة، مكان العمل، وأي ملاحظات على الوردية.
              </p>
            </div>
            <button
              onClick={load}
              className="btn border-white/20 bg-white/15 text-white"
            >
              <RefreshCw size={17} className={loading ? "animate-spin" : ""} />
              تحديث
            </button>
          </div>
        </section>
        <div
          className={`mt-4 flex items-start gap-3 rounded-2xl border p-4 ${connected ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-amber-200 bg-amber-50 text-amber-800"}`}
        >
          <CloudCog className="shrink-0" />
          <div>
            <b className="text-xs">
              {connected ? "متصل مع Connecteam" : "الجدول التجريبي ظاهر حالياً"}
            </b>
            <p className="mt-1 text-[10px] leading-5">
              {connected
                ? "تتم قراءة ورديات الموظف تلقائياً من Connecteam."
                : message ||
                  "أدخل رابط API والرمز من إعدادات الاستضافة لتفعيل المزامنة."}
            </p>
          </div>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <article
              key={item.id}
              className={`card p-5 ${item.shiftType === "Day Off" ? "opacity-70" : ""}`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-black text-[var(--primary)]">
                    {item.day}
                  </span>
                  <h3 className="mt-1 text-xl font-black">{item.date}</h3>
                </div>
                <CalendarDays className="text-[var(--primary)]" />
              </div>
              {item.shiftType === "Day Off" ? (
                <div className="mt-8 rounded-2xl bg-[var(--surface-2)] p-5 text-center font-black">
                  يوم إجازة 🌿
                </div>
              ) : (
                <>
                  <div className="mt-5 grid grid-cols-2 gap-2">
                    <div className="rounded-xl bg-[var(--surface-2)] p-3">
                      <span className="text-[8px] text-[var(--muted)]">من</span>
                      <b className="mt-1 block text-lg">{item.start}</b>
                    </div>
                    <div className="rounded-xl bg-[var(--surface-2)] p-3">
                      <span className="text-[8px] text-[var(--muted)]">
                        إلى
                      </span>
                      <b className="mt-1 block text-lg">{item.end}</b>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2 text-[10px] text-[var(--muted)]">
                    <p className="flex items-center gap-2">
                      <Timer size={14} />
                      المدة: {item.duration}
                    </p>
                    <p className="flex items-center gap-2">
                      <Coffee size={14} />
                      الاستراحة: {item.breakMinutes} دقيقة
                    </p>
                    {item.location && (
                      <p className="flex items-center gap-2">
                        <MapPin size={14} />
                        {item.location}
                      </p>
                    )}
                  </div>
                  {item.notes && (
                    <p className="mt-4 rounded-xl bg-amber-50 p-3 text-[9px] leading-5 text-amber-800">
                      {item.notes}
                    </p>
                  )}
                </>
              )}
            </article>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
