"use client";

import {
  Bike, BookOpenCheck, Building2, ClipboardCheck, Copy, ExternalLink, Headphones,
  MapPinned, MonitorCog, Store, TimerReset, UserRoundCheck, WalletCards,
} from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";

const areas = [
  { ids: "1، 2، 4", areas: "Umm al-Fahem · Kfar Qaree - Arara · Baqa al-Gharbiyye", manager: "Nassim Masarwy", phone: "+972545026965" },
  { ids: "5، 7، 13", areas: "Sakhnin - Arraba - Deir Hanna · Shefa-Amr - I'billin · Tamra - Kabul", manager: "Seif Abualheja", phone: "+972549580852" },
  { ids: "8، 12", areas: "Kfar Qasem · Taybeh - Tira - Qalansawe", manager: "Naseem Mwasi", phone: "+972544732050" },
  { ids: "9", areas: "Jerusalem", manager: "Wisam Abugharbeyye", phone: "+972544371004" },
  { ids: "10", areas: "Nazareth area", manager: "Kosai Abofoul", phone: "+972547905048" },
  { ids: "16، 19", areas: "Judaydah Almaker - Yarka - Yassif · Karmiel - Shaghur", manager: "Essam Jammal", phone: "+972542785813" },
  { ids: "20", areas: "Rahat", manager: "Adham", phone: "+972543687217" },
];

const hcrmRoutes = [
  { name: "Finance", label: "قسم الحسابات", icon: WalletCards },
  { name: "Content", label: "قسم المنيو", icon: ClipboardCheck },
  { name: "Account Manager", label: "مشكلة محددة وتحتاج تواصلاً من مسؤول المحل", icon: UserRoundCheck },
  { name: "Device New Ticket", label: "مشكلة بالجهاز (المخشير)", icon: MonitorCog },
];

export default function GuidelinesPage() {
  const copy = async (value: string, label: string) => {
    await navigator.clipboard.writeText(value);
    toast.success(`تم نسخ ${label}`);
  };

  return <AppShell title="التوجيهات">
    <div className="mx-auto max-w-7xl space-y-6">
      <section className="page-intro">
        <div className="page-intro-copy"><i><BookOpenCheck size={25} /></i><div><span>مرجع العمل السريع</span><h2>التوجيهات</h2><p>طريقة التعامل مع أكثر الحالات المتكررة، بخطوات مختصرة وواضحة.</p></div></div>
      </section>

      <div className="grid gap-5 lg:grid-cols-3">
        <article className="card p-5 sm:p-6"><i className="row-icon mb-4 !size-12"><Bike size={21} /></i><span className="text-[10px] font-black text-[var(--primary)]">الحالة 01</span><h3 className="mt-2 font-black">مرسل يريد الانضمام</h3><p className="mt-3 text-xs leading-6 text-[var(--muted)]">أرسل له نموذج التسجيل الرسمي التالي مباشرة.</p><a className="btn btn-primary mt-5 w-full" href="https://forms.monday.com/forms/e5ae7be198962b08a0f7d26596e1540a?r=use1" target="_blank" rel="noreferrer"><ExternalLink size={16} />فتح نموذج الانضمام</a></article>
        <article className="card p-5 sm:p-6"><i className="row-icon mb-4 !size-12"><Store size={21} /></i><span className="text-[10px] font-black text-[var(--primary)]">الحالة 02</span><h3 className="mt-2 font-black">مطعم يريد الانضمام</h3><p className="mt-3 text-xs leading-6 text-[var(--muted)]">اسأل المطعم عن المنطقة أولاً، ثم أرسل له رقم مسؤول المنطقة من الجدول الموجود أسفل الصفحة.</p><a className="btn btn-secondary mt-5 w-full" href="#area-managers"><MapPinned size={16} />جدول مسؤولي المناطق</a></article>
        <article className="card p-5 sm:p-6"><i className="row-icon mb-4 !size-12"><Headphones size={21} /></i><span className="text-[10px] font-black text-[var(--primary)]">الحالة 03</span><h3 className="mt-2 font-black">مطعم موجود وعنده مشكلة</h3><p className="mt-3 text-xs leading-6 text-[var(--muted)]">حوّل المشكلة على HCRM إلى القسم الصحيح حسب نوعها. إذا لم يظهر المحل، أرسل الحالة إلى مكتب HAAT.</p></article>
      </div>

      <section className="card p-5 sm:p-6"><div className="mb-5 flex items-center gap-3"><i className="row-icon"><Building2 size={19} /></i><div><h3 className="font-black">تحويل المشكلة على HCRM</h3><p className="text-xs text-[var(--muted)]">اختر المسار المطابق لنوع المشكلة.</p></div></div><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{hcrmRoutes.map(({ name, label, icon: Icon }) => <div key={name} className="rounded-2xl border border-[var(--line)] p-4"><i className="grid size-10 place-items-center rounded-xl bg-[var(--primary-soft)] text-[var(--primary)]"><Icon size={18} /></i><h4 className="mt-3 text-sm font-black" dir="ltr">{name}</h4><p className="mt-2 text-xs leading-6 text-[var(--muted)]">{label}</p></div>)}</div><p className="mt-4 rounded-xl bg-amber-50 p-3 text-xs font-bold leading-6 text-amber-900 dark:bg-amber-950/20 dark:text-amber-100">إذا لم يكن المحل موجوداً على HCRM، أرسل الحالة إلى مكتب HAAT.</p></section>

      <div className="grid gap-5 lg:grid-cols-2">
        <article className="card p-5 sm:p-6"><div className="flex items-center gap-3"><i className="row-icon"><UserRoundCheck size={19} /></i><h3 className="font-black">المطعم يصر على تواصل مسؤول المنطقة</h3></div><ol className="mt-5 space-y-3 text-xs leading-6"><li className="rounded-xl bg-[var(--surface-2)] p-3"><b className="ml-2 text-[var(--primary)]">1.</b>من الداشبورد ابحث عن المطعم.</li><li className="rounded-xl bg-[var(--surface-2)] p-3"><b className="ml-2 text-[var(--primary)]">2.</b>استخرج اسم مسؤول المنطقة ورقم هاتفه.</li><li className="rounded-xl bg-[var(--surface-2)] p-3"><b className="ml-2 text-[var(--primary)]">3.</b>أرسل الاسم والرقم للمطعم.</li></ol></article>
        <article className="card p-5 sm:p-6"><div className="flex items-center gap-3"><i className="row-icon"><TimerReset size={19} /></i><h3 className="font-black">المطعم يريد زيادة وقت التحضير</h3></div><div className="mt-5 flex flex-wrap items-center gap-2 text-xs font-bold"><span className="rounded-xl bg-[var(--surface-2)] px-4 py-3">HCRM</span><span>←</span><span className="rounded-xl bg-[var(--surface-2)] px-4 py-3">Customer Service</span><span>←</span><span className="rounded-xl bg-[var(--primary-soft)] px-4 py-3 text-[var(--primary)]">Preparation Time Update</span></div><p className="mt-4 text-xs leading-6 text-[var(--muted)]">ادخل إلى HCRM، ثم Customer Service، وبعدها Preparation Time Update.</p></article>
      </div>

      <section id="area-managers" className="card scroll-mt-24 overflow-hidden"><header className="flex items-center gap-3 border-b border-[var(--line)] p-5 sm:p-6"><i className="row-icon"><MapPinned size={19} /></i><div><h3 className="font-black">مسؤولو المناطق</h3><p className="text-xs text-[var(--muted)]">اسحب البطاقات يميناً ويساراً، واختر مسؤول المنطقة المطلوب.</p></div></header><div className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth p-5 pb-7 sm:p-6 sm:pb-8">{areas.map((item) => <article key={item.ids} className="min-w-[270px] max-w-[320px] snap-start rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-5 shadow-sm transition hover:-translate-y-1 hover:border-[var(--primary)] hover:shadow-lg sm:min-w-[310px]"><div className="flex items-center justify-between"><i className="grid size-11 place-items-center rounded-2xl bg-[var(--primary-soft)] text-[var(--primary)]"><MapPinned size={19} /></i><span className="rounded-full bg-[var(--surface-2)] px-3 py-1 text-[10px] font-black">ID {item.ids}</span></div><p className="mt-5 min-h-12 text-sm font-black leading-6" dir="ltr">{item.areas}</p><div className="mt-4 rounded-2xl bg-[var(--surface-2)] p-4"><span className="text-[10px] text-[var(--muted)]">مسؤول المنطقة</span><h4 className="mt-1 text-base font-black" dir="ltr">{item.manager}</h4><a className="mt-2 block font-mono text-sm font-bold text-[var(--primary)]" dir="ltr" href={`tel:${item.phone}`}>{item.phone}</a></div><div className="mt-4 grid grid-cols-2 gap-2"><button className="btn btn-secondary !min-h-0 !px-3 !py-2 text-[10px]" onClick={() => void copy(item.phone, "رقم الهاتف")}><Copy size={13} />نسخ الرقم</button><a className="btn btn-primary !min-h-0 !px-3 !py-2 text-[10px]" href={`tel:${item.phone}`}><Headphones size={13} />اتصال</a></div></article>)}</div></section>
    </div>
  </AppShell>;
}
