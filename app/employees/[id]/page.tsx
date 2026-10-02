"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowRight, Building2, CalendarDays, Hash, LockKeyhole, Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { communityPeople, type CommunityPerson } from "@/lib/community-people";
import { departmentHeadEmails } from "@/lib/demo-data";

const roleLabel = (person: CommunityPerson) => {
  if (departmentHeadEmails.has(person.email.toLowerCase())) return "مسؤول قسم";
  if (person.department.includes("جودة") || person.department.toLowerCase().includes("quality")) return "جودة";
  return ({ employee: "موظف", supervisor: "مسؤول شفتات", manager: "مدير", admin: "مدير" } as const)[person.role];
};

export default function EmployeeProfile() {
  const params = useParams<{ id: string }>();
  const person = communityPeople.find((item) => item.id === params.id);

  return <AppShell title="ملف الموظف"><div className="mx-auto max-w-5xl">
    {!person ? <article className="card p-10 text-center"><h2 className="font-black">الموظف غير موجود</h2><Link href="/community" className="btn btn-primary mt-5">العودة للمجتمع</Link></article> : <>
      <Link href="/community" className="mb-4 inline-flex items-center gap-2 text-xs font-bold text-[var(--muted)]"><ArrowRight size={16}/>العودة إلى مجتمع الشركة</Link>
      <section className="relative overflow-hidden rounded-[30px] bg-gradient-to-l from-[#780018] via-[#b50b2f] to-[#e63255] p-7 text-white shadow-xl">
        <div className="absolute -left-10 -top-16 size-52 rounded-full border-[30px] border-white/10"/>
        <div className="relative flex flex-col items-center gap-5 text-center sm:flex-row sm:text-start">
          <span className="grid size-24 shrink-0 place-items-center rounded-[28px] border border-white/35 bg-black/15 text-4xl font-black shadow-inner">{person.name[0]}</span>
          <div>
            <span className="inline-flex rounded-full bg-white px-3 py-1 text-[10px] font-black text-[#8a0020] shadow-sm">{roleLabel(person)}</span>
            <h2 className="mt-3 text-3xl font-black">{person.name}</h2>
            <p className="mt-1 text-sm text-white/90">{person.title} • {person.department}</p>
          </div>
          <Link href={`/messages?employee=${person.employeeId}`} className="btn mt-2 border-white/20 bg-white text-[var(--primary)] sm:ms-auto"><LockKeyhole size={17}/>إرسال رسالة خاصة</Link>
        </div>
      </section>
      <div className="mt-5 grid gap-5 lg:grid-cols-[1.2fr_.8fr]">
        <article className="card p-6"><h3 className="font-black">معلومات العمل</h3><div className="mt-5 grid gap-3 sm:grid-cols-2">
          {[[Hash,"الرقم الوظيفي",person.employeeId],[Building2,"القسم",person.department],[Mail,"البريد",person.email],[Phone,"الهاتف الداخلي",person.phone],[MapPin,"الموقع",person.location],[CalendarDays,"سنة الانضمام",person.joined]].map(([Icon,label,value])=>{const ItemIcon=Icon as typeof Hash;return <div key={String(label)} className="flex items-center gap-3 rounded-2xl bg-[var(--surface-2)] p-4"><i className="grid size-9 place-items-center rounded-xl bg-white text-[var(--primary)] dark:bg-[var(--surface)]"><ItemIcon size={17}/></i><div><span className="block text-[8px] font-bold text-[var(--muted)]">{String(label)}</span><b className="mt-1 block text-[10px]">{String(value)}</b></div></div>})}
        </div></article>
        <article className="card p-6"><h3 className="flex items-center gap-2 font-black"><ShieldCheck className="text-[var(--primary)]"/>المهارات</h3><div className="mt-4 flex flex-wrap gap-2">{person.skills.map((skill)=><span key={skill} className="rounded-full bg-[var(--primary-soft)] px-3 py-2 text-[9px] font-bold text-[var(--primary)]">{skill}</span>)}</div><div className="mt-6 rounded-2xl border border-emerald-700 bg-emerald-600 p-4 text-[11px] font-black text-white shadow-sm dark:border-emerald-300 dark:bg-emerald-500">● حساب نشط على منصة HAAT</div></article>
      </div>
    </>}
  </div></AppShell>;
}
