import Link from "next/link";
import {
  BellRing,
  Building2,
  ChartNoAxesCombined,
  ClipboardList,
  Megaphone,
  Plus,
  TrendingUp,
  Users,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { PulseSummary } from "@/components/haat-pulse";
import { PageIntro, Progress, StatCard } from "@/components/ui";
import { demoAnnouncements, departments } from "@/lib/demo-data";
import { formatDate, priorityLabel } from "@/lib/utils";
export default function Admin() {
  const rates = [78, 84, 72, 91, 86];
  return (
    <AppShell
      admin
      title="لوحة الإدارة"
      action={
        <Link
          href="/admin/announcements/new"
          className="btn btn-primary hidden sm:flex"
        >
          <Plus size={17} />
          تعميم جديد
        </Link>
      }
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-6"><PageIntro eyebrow="CONTROL CENTER" title="كل ما تحتاجه الإدارة في شاشة واحدة" description="راقب النشر والقراءة والطلبات، وانتقل مباشرة إلى الإجراء المطلوب." icon={ChartNoAxesCombined} action={<Link href="/admin/announcements/new" className="btn btn-primary"><Plus size={17}/>إنشاء تعميم</Link>}/></div>
        <div className="mb-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <StatCard
            label="إجمالي الموظفين"
            value="150"
            icon={Users}
            tone="blue"
            note="142 حسابًا نشطًا"
          />
          <StatCard
            label="الأقسام"
            value={departments.length}
            icon={Building2}
          />
          <StatCard
            label="التعميمات المنشورة"
            value="48"
            icon={Megaphone}
            tone="orange"
            note="6 هذا الأسبوع"
          />
          <StatCard
            label="متوسط القراءة"
            value="82%"
            icon={TrendingUp}
            note="+4.2% عن الشهر الماضي"
          />
          <StatCard
            label="لديهم غير مقروء"
            value="31"
            icon={BellRing}
            tone="red"
            note="20.6% من الموظفين"
          />
        </div>
        <div className="mb-6 grid gap-5 xl:grid-cols-[.8fr_1.2fr]">
          <PulseSummary />
          <article className="card p-5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black text-[var(--primary)]">
                  مركز العمليات
                </span>
                <h2 className="mt-1 font-black">إجراءات الإدارة السريعة</h2>
              </div>
              <ClipboardList className="text-[var(--primary)]" />
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <Link
                href="/admin/requests"
                className="rounded-2xl bg-[var(--surface-2)] p-4 text-xs font-black hover:text-[var(--primary)]"
              >
                مراجعة الطلبات
                <span className="mt-1 block text-[9px] font-normal text-[var(--muted)]">
                  الإجازات والشكاوى والتقنية
                </span>
              </Link>
              <Link
                href="/admin/employees"
                className="rounded-2xl bg-[var(--surface-2)] p-4 text-xs font-black hover:text-[var(--primary)]"
              >
                إنشاء الحسابات
                <span className="mt-1 block text-[9px] font-normal text-[var(--muted)]">
                  استيراد الموظفين من Excel
                </span>
              </Link>
              <Link
                href="/admin/couriers"
                className="rounded-2xl bg-[var(--surface-2)] p-4 text-xs font-black hover:text-[var(--primary)]"
              >
                أرقام المرسلين
                <span className="mt-1 block text-[9px] font-normal text-[var(--muted)]">
                  إضافة وتحديث الدليل
                </span>
              </Link>
            </div>
          </article>
        </div>
        <div className="grid gap-6 xl:grid-cols-[1fr_1.25fr]">
          <section className="card p-5 sm:p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="font-black">نسب القراءة حسب القسم</h2>
                <p className="mt-1 text-xs text-[var(--muted)]">آخر 30 يومًا</p>
              </div>
              <span className="rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
                متوسط 82%
              </span>
            </div>
            <div className="space-y-5">
              {departments.map((d, i) => (
                <div key={d.id}>
                  <div className="mb-2 flex justify-between text-xs">
                    <b>{d.name}</b>
                    <span className="font-bold text-[var(--primary)]">
                      {rates[i]}%
                    </span>
                  </div>
                  <Progress value={rates[i]} />
                </div>
              ))}
            </div>
          </section>
          <section className="card overflow-hidden">
            <div className="flex items-center justify-between border-b border-[var(--line)] p-5">
              <div>
                <h2 className="font-black">أحدث التعميمات</h2>
                <p className="mt-1 text-xs text-[var(--muted)]">
                  متابعة سريعة لأداء النشر
                </p>
              </div>
              <Link
                href="/announcements"
                className="text-xs font-bold text-[var(--primary)]"
              >
                عرض الكل
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[620px] text-right text-xs">
                <thead className="bg-[var(--surface-2)] text-[var(--muted)]">
                  <tr>
                    <th className="p-4">التعميم</th>
                    <th className="p-4">الأهمية</th>
                    <th className="p-4">تاريخ النشر</th>
                    <th className="p-4">القراءة</th>
                  </tr>
                </thead>
                <tbody>
                  {demoAnnouncements.map((a) => (
                    <tr key={a.id} className="border-t border-[var(--line)]">
                      <td className="p-4">
                        <Link
                          href={`/announcements/${a.id}`}
                          className="font-bold hover:text-[var(--primary)]"
                        >
                          {a.title}
                        </Link>
                        <span className="mt-1 block text-[10px] text-[var(--muted)]">
                          {a.target_label}
                        </span>
                      </td>
                      <td className="p-4">{priorityLabel[a.priority]}</td>
                      <td className="p-4 text-[var(--muted)]">
                        {formatDate(a.published_at)}
                      </td>
                      <td className="p-4">
                        <b>
                          {Math.round((a.read_count / a.recipient_count) * 100)}
                          %
                        </b>
                        <Progress
                          value={(a.read_count / a.recipient_count) * 100}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
      <Link
        href="/admin/announcements/new"
        className="btn btn-primary fixed bottom-20 left-5 z-30 shadow-xl lg:hidden"
      >
        <Plus />
        تعميم جديد
      </Link>
    </AppShell>
  );
}
