"use client";
import { Bell, Building2, CalendarHeart, CheckCircle2, Clock3, Gauge, Search, ShieldCheck, Sparkles, Trophy } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { PwaInstall } from "@/components/pwa-install";
import { useLocale } from "@/components/locale-provider";
import { StatCard } from "@/components/ui";
import Link from "next/link";

export default function Dashboard(){const{locale,t}=useLocale();const ar=locale==="ar";return <AppShell title={t.dashboardTitle}><PwaInstall/>
 <section className="dashboard-hero mb-6"><div className="hero-shape one"/><div className="hero-shape two"/><div className="relative z-10"><span className="hero-kicker"><Sparkles size={14}/>{ar?"مرحباً بعودتك":"Welcome back"}</span><h2>{ar?"صباح الخير، أحمد 👋":"Good morning, Ahmad 👋"}</h2><p>{ar?"هذه نظرة سريعة على يومك وأحدث نشاطات فريقك.":"Here’s a quick look at your day and your team’s latest activity."}</p><div className="hero-meta"><span><Building2 size={15}/>{t.department}</span><span><Clock3 size={15}/>{ar?"الوردية 09:00 – 17:00":"Shift 09:00 – 17:00"}</span></div></div><label className="hero-search"><Search size={19}/><input aria-label={t.search} placeholder={t.search}/></label></section>
 <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><StatCard label={ar?"درجة الأداء":"Performance score"} value="92%" icon={Gauge} tone="red" trend={5.2} note={ar?"أعلى من متوسط الفريق":"Above team average"}/><StatCard label={ar?"نسبة الحضور":"Attendance rate"} value="97%" icon={CheckCircle2} tone="green" trend={1.4} note={ar?"28 يوم عمل":"28 working days"}/><StatCard label={t.unread} value="3" icon={Bell} tone="orange" trend={-25} note={ar?"تحتاج إلى مراجعتك":"Need your attention"}/><StatCard label={ar?"ترتيب القسم":"Department rank"} value="#3" icon={Trophy} tone="blue" trend={8} note={ar?"من أصل 32 موظف":"Out of 32 employees"}/></div>
 <section className="mb-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{[
  {icon:Building2,title:ar?"حول الشركة":"About HAAT",body:ar?"تعرّف على رؤيتنا، قيمنا، والفرق التي تصنع التجربة.":"Explore our vision, values, and the teams behind the experience.",href:"/community"},
  {icon:ShieldCheck,title:ar?"سياسات الشركة":"Company Policies",body:ar?"مرجع واضح لسياسات العمل وخدمة الزبائن والسلوك المهني.":"A clear reference for workplace, service, and conduct policies.",href:"/announcements"},
  {icon:Trophy,title:ar?"إنجازات الشركة":"Company Achievements",body:ar?"نحتفل بإنجازات الفرق والنتائج التي نصنعها معاً.":"Celebrating the teams and results we build together.",href:"/community"},
  {icon:CalendarHeart,title:ar?"العطل الرسمية":"Official Holidays",body:ar?"راجع العطل الرسمية وخطط لجدولك مسبقاً.":"Review public holidays and plan your schedule ahead.",href:"/schedule"}
 ].map(({icon:Icon,title,body,href})=><Link key={title} href={href} className="company-section card p-5 transition-transform hover:-translate-y-1"><i className="row-icon mb-4"><Icon size={22}/></i><h3 className="text-lg font-black">{title}</h3><p className="relative z-10 mt-2 text-sm leading-7 text-[var(--muted)]">{body}</p></Link>)}</section>
 </AppShell>}
