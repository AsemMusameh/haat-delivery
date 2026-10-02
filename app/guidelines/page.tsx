"use client";

import {
  Bike, BookOpenCheck, Building2, ClipboardCheck, Copy, ExternalLink, Headphones,
  MapPinned, MonitorCog, Store, TimerReset, UserRoundCheck, WalletCards,
  Search,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";

const areas = [
  { ids: "1، 2، 4", areas: "Umm al-Fahem · Kafr Qara - Arara · Baqa al-Gharbiyye", areasAr: "أم الفحم · كفر قرع - عرعرة · باقة الغربية", manager: "Nassim Masarwy", phone: "+972545026965" },
  { ids: "5، 7، 13", areas: "Sakhnin - Arraba - Deir Hanna · Shefa-Amr - I'billin · Tamra - Kabul", areasAr: "سخنين - عرابة - دير حنا · شفاعمرو - إعبلين · طمرة - كابول", manager: "Seif Abualheja", phone: "+972549580852" },
  { ids: "8، 12", areas: "Kafr Qasem · Taybeh - Tira - Qalansawe", areasAr: "كفر قاسم · الطيبة - الطيرة - قلنسوة", manager: "Naseem Mwasi", phone: "+972544732050" },
  { ids: "9", areas: "Jerusalem", areasAr: "القدس", manager: "Wisam Abugharbeyye", phone: "+972544371004" },
  { ids: "10", areas: "Nazareth area", areasAr: "منطقة الناصرة", manager: "Kosai Abofoul", phone: "+972547905048" },
  { ids: "16، 19", areas: "Judaydah Almaker - Yarka - Yassif · Karmiel - Shaghur", areasAr: "الجديدة المكر - يركا - ياسيف · كرمئيل - الشاغور", manager: "Essam Jammal", phone: "+972542785813" },
  { ids: "20", areas: "Rahat", areasAr: "رهط", manager: "Adham", phone: "+972543687217" },
];

const hcrmRoutes = [
  { name: "Finance", label: "قسم الحسابات", icon: WalletCards },
  { name: "Content", label: "قسم المنيو", icon: ClipboardCheck },
  { name: "Account Manager", label: "مشكلة محددة وتحتاج تواصلاً من مسؤول المحل", icon: UserRoundCheck },
  { name: "Device New Ticket", label: "مشكلة بالجهاز (المخشير)", icon: MonitorCog },
];

export default function GuidelinesPage() {
  const [areaQuery, setAreaQuery] = useState("");
  const visibleAreas = useMemo(() => {
    const query = areaQuery.trim().toLowerCase();
    return query ? areas.filter((item) => `${item.areas} ${item.areasAr} ${item.manager} ${item.phone} ${item.ids}`.toLowerCase().includes(query)) : areas;
  }, [areaQuery]);
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
        <article className="card p-5 sm:p-6"><i className="row-icon mb-4 !size-12"><Store size={21} /></i><span className="text-[10px] font-black text-[var(--primary)]">الحالة 02</span><h3 className="mt-2 font-black">مطعم يريد الانضمام</h3><p className="mt-3 text-xs leading-6 text-[var(--muted)]">يُرفع طلب انضمام رسمي من HAAT Hub عبر مسار New Lead Request.</p><a className="btn btn-secondary mt-5 w-full" href="#restaurant-join"><ClipboardCheck size={16} />عرض خطوات التسجيل</a></article>
        <article className="card p-5 sm:p-6"><i className="row-icon mb-4 !size-12"><Headphones size={21} /></i><span className="text-[10px] font-black text-[var(--primary)]">الحالة 03</span><h3 className="mt-2 font-black">مطعم موجود وعنده مشكلة</h3><p className="mt-3 text-xs leading-6 text-[var(--muted)]">حوّل المشكلة على HCRM إلى القسم الصحيح حسب نوعها. إذا لم يظهر المحل، أرسل الحالة إلى مكتب HAAT.</p></article>
      </div>

      <section id="restaurant-join" className="card scroll-mt-24 overflow-hidden"><header className="flex flex-wrap items-center justify-between gap-4 bg-gradient-to-l from-[#7b001b] to-[#d71943] p-5 text-white sm:p-6"><div className="flex items-center gap-3"><i className="grid size-12 place-items-center rounded-2xl bg-white/15"><Store size={22}/></i><div><span className="text-[9px] font-black text-rose-100">NEW LEAD REQUEST</span><h3 className="mt-1 text-lg font-black">تسجيل مطعم جديد</h3><p className="mt-1 text-[10px] text-rose-100">مسار واضح من الداشبورد حتى إرسال بيانات المطعم.</p></div></div><a className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-[10px] font-black text-[#b10831] shadow-lg" href="https://hub.haat.delivery/dashboard" target="_blank" rel="noreferrer"><ExternalLink size={15}/>فتح HAAT Hub</a></header><div className="p-5 sm:p-6"><div className="grid gap-3 md:grid-cols-3">{[{n:"01",title:"افتح Dashboard",text:"ادخل إلى HAAT Hub من الرابط الرسمي."},{n:"02",title:"اختر Create Request",text:"من لوحة التحكم افتح إنشاء طلب جديد."},{n:"03",title:"اختر New Lead Request",text:"ابدأ نموذج انضمام المطعم الجديد."}].map((step)=><div key={step.n} className="relative overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface-2)] p-4"><span className="absolute -left-1 -top-4 text-6xl font-black text-[var(--primary)] opacity-[.07]">{step.n}</span><b className="relative text-xs font-black">{step.title}</b><p className="relative mt-2 text-[9px] leading-5 text-[var(--muted)]">{step.text}</p></div>)}</div><div className="mt-5 rounded-[22px] border border-sky-200 bg-sky-50 p-4 dark:border-sky-900 dark:bg-sky-950/25"><div className="flex items-center gap-2 text-sky-800 dark:text-sky-200"><ClipboardCheck size={18}/><b className="text-xs">عبّئ بيانات التواصل التالية</b></div><div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">{[{en:"Contact Person",ar:"اسم شخص التواصل"},{en:"Phone",ar:"رقم الهاتف"},{en:"Email",ar:"البريد الإلكتروني"},{en:"Venue",ar:"اسم المطعم"}].map((field)=><div key={field.en} className="rounded-xl bg-white p-3 shadow-sm dark:bg-[var(--surface)]"><b dir="ltr" className="block text-start text-[10px]">{field.en} *</b><small className="mt-1 block text-[8px] text-[var(--muted)]">{field.ar}</small></div>)}</div><p className="mt-3 text-[8px] leading-5 text-sky-700 dark:text-sky-300">بعد التعبئة اضغط Create New Lead Request؛ سيُنشأ طلب لقسم Commercial → Sales Operations.</p></div></div></section>

      <section className="card p-5 sm:p-6"><div className="mb-5 flex items-center gap-3"><i className="row-icon"><Building2 size={19} /></i><div><h3 className="font-black">تحويل المشكلة على HCRM</h3><p className="text-xs text-[var(--muted)]">اختر المسار المطابق لنوع المشكلة.</p></div></div><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{hcrmRoutes.map(({ name, label, icon: Icon }) => <div key={name} className="rounded-2xl border border-[var(--line)] p-4"><i className="grid size-10 place-items-center rounded-xl bg-[var(--primary-soft)] text-[var(--primary)]"><Icon size={18} /></i><h4 className="mt-3 text-sm font-black" dir="ltr">{name}</h4><p className="mt-2 text-xs leading-6 text-[var(--muted)]">{label}</p></div>)}</div><p className="mt-4 rounded-xl bg-amber-50 p-3 text-xs font-bold leading-6 text-amber-900 dark:bg-amber-950/20 dark:text-amber-100">إذا لم يكن المحل موجوداً على HCRM، أرسل الحالة إلى مكتب HAAT.</p></section>

      <div className="grid gap-5 lg:grid-cols-2">
        <article className="card p-5 sm:p-6"><div className="flex items-center gap-3"><i className="row-icon"><UserRoundCheck size={19} /></i><h3 className="font-black">المطعم يصر على تواصل مسؤول المنطقة</h3></div><ol className="mt-5 space-y-3 text-xs leading-6"><li className="rounded-xl bg-[var(--surface-2)] p-3"><b className="ml-2 text-[var(--primary)]">1.</b>من الداشبورد ابحث عن المطعم.</li><li className="rounded-xl bg-[var(--surface-2)] p-3"><b className="ml-2 text-[var(--primary)]">2.</b>استخرج اسم مسؤول المنطقة ورقم هاتفه.</li><li className="rounded-xl bg-[var(--surface-2)] p-3"><b className="ml-2 text-[var(--primary)]">3.</b>أرسل الاسم والرقم للمطعم.</li></ol></article>
        <article className="card p-5 sm:p-6"><div className="flex items-center gap-3"><i className="row-icon"><TimerReset size={19} /></i><h3 className="font-black">المطعم يريد زيادة وقت التحضير</h3></div><div className="mt-5 flex flex-wrap items-center gap-2 text-xs font-bold"><span className="rounded-xl bg-[var(--surface-2)] px-4 py-3">HCRM</span><span>←</span><span className="rounded-xl bg-[var(--surface-2)] px-4 py-3">Customer Service</span><span>←</span><span className="rounded-xl bg-[var(--primary-soft)] px-4 py-3 text-[var(--primary)]">Preparation Time Update</span></div><p className="mt-4 text-xs leading-6 text-[var(--muted)]">ادخل إلى HCRM، ثم Customer Service، وبعدها Preparation Time Update.</p></article>
      </div>

      <section id="area-managers" className="card scroll-mt-24 overflow-hidden"><header className="flex flex-col gap-3 border-b border-[var(--line)] p-4 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-3"><i className="grid size-10 place-items-center rounded-xl bg-[var(--primary-soft)] text-[var(--primary)]"><MapPinned size={17}/></i><div><h3 className="text-sm font-black">مسؤولو المناطق</h3><p className="text-[9px] text-[var(--muted)]">قائمة مختصرة للأسماء والأرقام.</p></div></div><label className="relative w-full sm:w-72"><Search className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" size={14}/><input className="input !h-10 pr-9 text-[10px]" value={areaQuery} onChange={(event) => setAreaQuery(event.target.value)} placeholder="ابحث بالمنطقة أو المسؤول..."/></label></header><div className="divide-y divide-[var(--line)] px-4">{visibleAreas.map((item) => <article key={item.ids} className="grid items-center gap-3 py-3 transition hover:bg-[var(--surface-2)] sm:grid-cols-[auto_minmax(0,1fr)_190px_auto] sm:px-2"><span className="grid h-9 min-w-12 place-items-center rounded-xl bg-[var(--primary-soft)] px-2 text-[9px] font-black text-[var(--primary)]">#{item.ids}</span><div className="min-w-0"><h4 className="truncate text-[10px] font-black">{item.areasAr}</h4><p dir="ltr" className="mt-1 truncate text-start text-[7px] text-[var(--muted)]">{item.areas}</p></div><div className="min-w-0"><b dir="ltr" className="block truncate text-start text-[10px]">{item.manager}</b><a dir="ltr" className="mt-1 block text-start font-mono text-[9px] font-bold text-[var(--primary)]" href={`tel:${item.phone}`}>{item.phone}</a></div><div className="flex gap-1.5"><button aria-label="نسخ الرقم" className="grid size-9 place-items-center rounded-xl border border-[var(--line)] text-[var(--muted)] transition hover:border-[var(--primary)] hover:text-[var(--primary)]" onClick={() => void copy(item.phone, "رقم الهاتف")}><Copy size={14}/></button><a aria-label="اتصال" className="grid size-9 place-items-center rounded-xl bg-[var(--primary)] text-white" href={`tel:${item.phone}`}><Headphones size={14}/></a></div></article>)}{visibleAreas.length===0&&<div className="p-8 text-center text-xs text-[var(--muted)]">لا توجد منطقة مطابقة للبحث.</div>}</div></section>
    </div>
  </AppShell>;
}
