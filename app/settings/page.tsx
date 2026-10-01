"use client";

import { BellRing, Check, Download, KeyRound, Palette, Settings2, ShieldCheck, Smartphone } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { colorPalettes, useTheme } from "@/components/theme-provider";
import { disablePushNotifications, enablePushNotifications } from "@/lib/firebase/client";
import { isSupabaseConfigured } from "@/lib/supabase/client";

const permissions = ["قراءة التعميمات", "إرسال الطلبات ومتابعتها", "استخدام الردود الجاهزة", "عرض أدوات العمل", "تأكيد الاطلاع"];

export default function EmployeeSettings() {
  const [push, setPush] = useState(false);
  const { palette, setPalette } = useTheme();
  useEffect(() => {
    if (typeof Notification !== "undefined") setPush(Notification.permission === "granted" && window.localStorage.getItem("haat-notifications-disabled") !== "1");
  }, []);
  const togglePush = async () => {
    try {
      if (push) {
        if (isSupabaseConfigured) await disablePushNotifications();
        window.localStorage.setItem("haat-notifications-disabled", "1");
        setPush(false);
        toast.success("تم تعطيل إشعارات هذا الجهاز");
      } else {
        if (isSupabaseConfigured) await enablePushNotifications();
        else {
          if (!("Notification" in window)) throw new Error("هذا المتصفح لا يدعم الإشعارات");
          if (await Notification.requestPermission() !== "granted") throw new Error("لم يتم السماح بالإشعارات");
          const registration = await navigator.serviceWorker.ready;
          await registration.showNotification("تم تفعيل إشعارات HAAT", { body: "سيصلك تنبيه عند وجود تعميم جديد.", icon: "/icons/haat-app-icon.png", badge: "/icons/haat-app-icon.png", tag: "haat-notifications-enabled" });
        }
        window.localStorage.removeItem("haat-notifications-disabled");
        setPush(true);
        toast.success("تم تفعيل إشعارات هذا الجهاز");
      }
    } catch (error) { toast.error(error instanceof Error ? error.message : "تعذر تحديث الإشعارات"); }
  };

  return <AppShell title="الإعدادات">
    <div className="mx-auto max-w-6xl space-y-6">
      <section className="page-intro">
        <div className="page-intro-copy"><i><Settings2 size={25} /></i><div><span>إعدادات الحساب</span><h2>تحكم بحسابك وتجربة التطبيق</h2><p>الأمان، الصلاحيات، الإشعارات، وقالب الألوان في مكان واحد.</p></div></div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <article className="card p-5 sm:p-6"><h3 className="flex items-center gap-2 font-black"><ShieldCheck size={19} />الصلاحيات</h3><div className="mt-5 grid gap-3 sm:grid-cols-2">{permissions.map((item) => <div className="flex items-center gap-2 rounded-xl bg-[var(--surface-2)] p-3 text-xs font-bold" key={item}><i className="grid size-6 place-items-center rounded-full bg-emerald-50 text-emerald-600"><Check size={14} /></i>{item}</div>)}</div></article>

        <article className="card p-5 sm:p-6"><h3 className="mb-5 flex items-center gap-2 font-black"><KeyRound size={19} />التحقق والأمان</h3><div className="space-y-3 text-sm"><div className="flex items-center justify-between rounded-xl bg-[var(--surface-2)] p-3"><span>البريد الرسمي</span><span className="badge read">تم التحقق</span></div><div className="flex items-center justify-between rounded-xl bg-[var(--surface-2)] p-3"><span>حساب Google</span><span className="badge">متاح</span></div></div><Link href="/reset-password" className="btn btn-secondary mt-4 w-full"><KeyRound size={16} />تغيير كلمة المرور</Link></article>

        <article className="card p-5 sm:p-6"><h3 className="mb-5 flex items-center gap-2 font-black"><BellRing size={19} />إشعارات الجهاز</h3><div className="flex items-center gap-3"><i className="row-icon !size-11"><BellRing size={19} /></i><div className="flex-1"><b className="text-sm">الإشعارات الفورية</b><p className="text-xs text-[var(--muted)]">التعميمات والتنبيهات الجديدة</p></div><button onClick={togglePush} className={`relative h-7 w-12 rounded-full ${push ? "bg-[var(--primary)]" : "bg-slate-300"}`} aria-label="تبديل الإشعارات"><i className={`absolute top-1 size-5 rounded-full bg-white transition-all ${push ? "left-1" : "left-6"}`} /></button></div><div className="mt-4 flex items-center gap-2 rounded-xl bg-[var(--surface-2)] p-3 text-xs text-[var(--muted)]"><Smartphone size={16} />{push ? "هذا الجهاز يستقبل الإشعارات" : "الإشعارات معطلة"}</div></article>

        <article className="card p-5 sm:p-6"><h3 className="mb-2 flex items-center gap-2 font-black"><Download size={19} />تطبيق Android</h3><p className="text-xs leading-6 text-[var(--muted)]">نزّل نسخة HAAT على هاتف Android مع شعار التطبيق الرسمي.</p><a href="/downloads/haat-tulkarm.apk" download className="btn btn-primary mt-4 w-full"><Download size={16} />تنزيل نسخة APK</a></article>
      </div>

      <article className="card p-5 sm:p-6"><div className="mb-5"><h3 className="flex items-center gap-2 font-black"><Palette size={20} />القوالب</h3><p className="mt-2 text-xs text-[var(--muted)]">اختر قالب الألوان الذي يناسبك، وسيُحفظ على هذا الجهاز.</p></div><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{colorPalettes.map((item) => <button key={item.id} onClick={() => { setPalette(item.id); toast.success(`تم تطبيق قالب ${item.name}`); }} className={`flex items-center gap-3 rounded-2xl border p-4 text-start transition ${palette === item.id ? "border-[var(--primary)] bg-[var(--primary-soft)]" : "border-[var(--line)] bg-[var(--surface)] hover:border-[var(--primary)]"}`}><span className="flex -space-x-2 rtl:space-x-reverse"><i className="size-9 rounded-full border-2 border-white" style={{ background: item.primary }} /><i className="size-9 rounded-full border-2 border-white" style={{ background: item.secondary }} /></span><b className="flex-1 text-sm">{item.name}</b>{palette === item.id && <Check className="text-[var(--primary)]" size={18} />}</button>)}</div></article>
    </div>
  </AppShell>;
}
