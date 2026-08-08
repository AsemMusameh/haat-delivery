"use client";
import { useEffect, useState } from "react";
import {
  CheckCircle2,
  CloudCog,
  ExternalLink,
  RefreshCw,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
export default function Integrations() {
  const [checking, setChecking] = useState(false);
  const [status, setStatus] = useState<{
    connected: boolean;
    source?: string;
    message?: string;
  }>({ connected: false });
  const check = () => {
    setChecking(true);
    fetch("/api/connecteam/schedule")
      .then((r) => r.json())
      .then((d) => setStatus(d))
      .finally(() => setChecking(false));
  };
  useEffect(() => {
    const timer = window.setTimeout(check, 0);
    return () => window.clearTimeout(timer);
  }, []);
  return (
    <AppShell admin title="التكاملات">
      <div className="mx-auto max-w-5xl">
        <section className="rounded-[28px] bg-gradient-to-l from-[#750017] to-[#d62248] p-7 text-white">
          <span className="text-[10px] font-black text-amber-200">
            INTEGRATION CENTER
          </span>
          <h2 className="mt-2 text-3xl font-black">Connecteam + HAAT</h2>
          <p className="mt-2 max-w-2xl text-xs leading-6 text-rose-100">
            مزامنة ورديات الموظفين تلقائياً وإظهار وردية اليوم والوردية القادمة
            على لوحة كل موظف.
          </p>
        </section>
        <article className="card mt-5 p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <i className="grid size-14 place-items-center rounded-2xl bg-blue-50 text-blue-700">
                <CloudCog size={28} />
              </i>
              <div>
                <h3 className="text-lg font-black">Connecteam Workforce</h3>
                <p className="mt-1 text-[10px] text-[var(--muted)]">
                  جدول الدوام والورديات
                </p>
              </div>
            </div>
            <span
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-black ${status.connected ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}
            >
              {status.connected ? (
                <CheckCircle2 size={15} />
              ) : (
                <XCircle size={15} />
              )}{" "}
              {status.connected ? "متصل" : "بانتظار بيانات الربط"}
            </span>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {[
              ["البيانات", "ورديات الموظفين"],
              ["التحديث", "عند فتح الجدول"],
              ["المطابقة", "الرقم الوظيفي"],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-2xl bg-[var(--surface-2)] p-4"
              >
                <span className="text-[8px] font-bold text-[var(--muted)]">
                  {label}
                </span>
                <b className="mt-1 block text-xs">{value}</b>
              </div>
            ))}
          </div>
          {!status.connected && (
            <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-[10px] leading-6 text-amber-900">
              <b>لاستكمال التفعيل:</b> أضف القيمتين{" "}
              <code className="rounded bg-white px-1.5 py-1">
                CONNECTEAM_API_KEY
              </code>{" "}
              و{" "}
              <code className="rounded bg-white px-1.5 py-1">
                CONNECTEAM_SCHEDULER_ID
              </code>{" "}
              كمتغيرات سرية في إعدادات استضافة الموقع. لا يتم حفظ رمز الدخول
              داخل قاعدة بيانات المنصة.
            </div>
          )}
          <div className="mt-5 flex flex-wrap gap-2">
            <button
              onClick={check}
              className="btn btn-primary"
              disabled={checking}
            >
              <RefreshCw size={16} className={checking ? "animate-spin" : ""} />
              فحص الاتصال
            </button>
            <a
              href="https://developer.connecteam.com/"
              target="_blank"
              rel="noreferrer"
              className="btn btn-secondary"
            >
              <ExternalLink size={16} />
              توثيق Connecteam
            </a>
          </div>
        </article>
        <article className="card mt-5 p-6">
          <h3 className="flex items-center gap-2 font-black">
            <ShieldCheck className="text-emerald-600" />
            أمان الربط
          </h3>
          <ul className="mt-4 grid gap-3 text-[10px] leading-5 text-[var(--muted)] sm:grid-cols-3">
            <li className="rounded-xl bg-[var(--surface-2)] p-3">
              رمز API يبقى على الخادم ولا يصل إلى متصفح الموظف.
            </li>
            <li className="rounded-xl bg-[var(--surface-2)] p-3">
              كل موظف يرى جدوله باستخدام رقمه الوظيفي فقط.
            </li>
            <li className="rounded-xl bg-[var(--surface-2)] p-3">
              عند تعذر الاتصال يظهر جدول احتياطي واضح المصدر.
            </li>
          </ul>
        </article>
      </div>
    </AppShell>
  );
}
