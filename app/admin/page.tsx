"use client";

import Link from "next/link";
import { Building2, ChartNoAxesCombined, ClipboardList, Megaphone, Plus, Users } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { PageIntro, StatCard } from "@/components/ui";
import { useAnnouncements, useDepartments, useEmployees } from "@/lib/hooks";

export default function Admin() {
  const employees = useEmployees();
  const departments = useDepartments();
  const { data: announcements } = useAnnouncements();
  const activeEmployees = employees.filter((employee) => employee.is_active).length;

  return <AppShell admin title="لوحة الإدارة" action={<Link href="/admin/announcements/new" className="btn btn-primary hidden sm:flex"><Plus size={17}/>تعميم جديد</Link>}>
    <div className="mx-auto max-w-7xl">
      <div className="mb-6"><PageIntro eyebrow="TULKARM OFFICE" title="مساحة إدارة نظيفة وجاهزة للعمل" description="تمت إزالة البيانات والتقارير التجريبية. الأرقام هنا تعكس القوائم الحالية فقط." icon={ChartNoAxesCombined} action={<Link href="/admin/employees" className="btn btn-primary"><Users size={17}/>إدارة الموظفين</Link>}/></div>
      <div className="mb-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="إجمالي الموظفين" value={employees.length} icon={Users} tone="blue" note={`${activeEmployees} حسابًا نشطًا`}/>
        <StatCard label="الأقسام" value={departments.length} icon={Building2} note="حسب القوائم المرفوعة"/>
        <StatCard label="التعميمات المنشورة" value={announcements.length} icon={Megaphone} tone="orange" note="لا توجد بيانات تجريبية"/>
        <StatCard label="الطلبات المفتوحة" value="0" icon={ClipboardList} tone="red" note="تبدأ من الصفر"/>
      </div>

      <section className="card p-5 sm:p-6">
        <div className="flex items-center justify-between"><div><span className="text-[10px] font-black text-[var(--primary)]">ابدأ العمل</span><h2 className="mt-1 font-black">إجراءات الإدارة الأساسية</h2></div><ClipboardList className="text-[var(--primary)]"/></div>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <Link href="/admin/employees" className="rounded-2xl bg-[var(--surface-2)] p-5 text-xs font-black hover:text-[var(--primary)]">مراجعة الموظفين والإيميلات<span className="mt-2 block text-[9px] font-normal leading-5 text-[var(--muted)]">كل الحسابات موزعة حسب الأقسام التي أرسلتها.</span></Link>
          <Link href="/admin/announcements/new" className="rounded-2xl bg-[var(--surface-2)] p-5 text-xs font-black hover:text-[var(--primary)]">إنشاء أول تعميم<span className="mt-2 block text-[9px] font-normal leading-5 text-[var(--muted)]">ابدأ المحتوى الفعلي بدون أي تعميمات وهمية.</span></Link>
          <Link href="/admin/records" className="rounded-2xl bg-[var(--surface-2)] p-5 text-xs font-black hover:text-[var(--primary)]">إنشاء أول سجل<span className="mt-2 block text-[9px] font-normal leading-5 text-[var(--muted)]">الشكاوى والإنذارات تبدأ بقائمة فارغة.</span></Link>
        </div>
      </section>

      <section className="card mt-6 overflow-hidden"><div className="border-b border-[var(--line)] p-5"><h2 className="font-black">الأقسام الحالية</h2><p className="mt-1 text-xs text-[var(--muted)]">توزيع الموظفين حسب القوائم المرفوعة</p></div><div className="grid gap-px bg-[var(--line)] sm:grid-cols-2 xl:grid-cols-4">{departments.map((department) => <article key={department.id} className="bg-[var(--surface)] p-5"><span className="block text-xs font-black">{department.name}</span><b className="mt-2 block text-2xl text-[var(--primary)]">{employees.filter((employee) => employee.department_id === department.id).length}</b><small className="text-[var(--muted)]">موظف</small></article>)}</div></section>
    </div>
  </AppShell>;
}
