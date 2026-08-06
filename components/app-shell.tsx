"use client";

import {
  Bell, Bookmark, CalendarDays, ChartNoAxesCombined, CircleDollarSign, CircleUserRound, ClipboardCheck,
  ChevronLeft, ChevronRight, FileWarning, Globe2, Home, LogOut, Megaphone, Menu, MessageCircleMore, MessagesSquare, Moon, Search, Settings, Sun, Users, UtensilsCrossed,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { demoNotifications } from "@/lib/demo-data";
import { cn } from "@/lib/utils";
import { useLocale } from "./locale-provider";
import { Logo } from "./logo";
import { CelebrationStrip } from "./celebration-strip";
import { useTheme } from "./theme-provider";

export function AppShell({ children, title, admin = false, action }: { children: React.ReactNode; title: string; admin?: boolean; action?: React.ReactNode }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const { theme, toggle } = useTheme();
  const { locale, setLocale, t } = useLocale();
  const showCelebrationStrip = path === "/community" || path === "/messages";
  const employeeNav = [
    { href: "/dashboard", label: t.home, icon: Home },
    { href: "/announcements", label: t.announcements, icon: Megaphone },
    { href: "/compensations", label: locale==="ar"?"التعويضات":"Compensations", icon: CircleDollarSign },
    { href: "/restaurants", label: locale==="ar"?"التواصل مع المطاعم":"Restaurant Contacts", icon: UtensilsCrossed },
    { href: "/community", label: locale==="ar"?"مجتمع الشركة":"Company Feed", icon: MessagesSquare },
    { href: "/messages", label: locale==="ar"?"الرسائل":"Messages", icon: MessageCircleMore },
    { href: "/schedule", label: t.schedule, icon: CalendarDays },
    { href: "/performance", label: t.performance, icon: ChartNoAxesCombined },
    { href: "/reviews", label: t.reviews, icon: ClipboardCheck },
    { href: "/bookmarks", label: t.bookmarks, icon: Bookmark },
    { href: "/notifications", label: t.notifications, icon: Bell },
    { href: "/profile", label: t.profile, icon: CircleUserRound },
  ];
  const adminNav = [
    { href: "/admin", label: t.admin, icon: ChartNoAxesCombined },
    { href: "/admin/announcements/new", label: t.newAnnouncement, icon: Megaphone },
    { href: "/admin/reports", label: t.reports, icon: ChartNoAxesCombined },
    { href: "/admin/employees", label: t.employees, icon: Users },
    { href: "/admin/records", label: t.records, icon: FileWarning },
    { href: "/admin/compensations", label: locale==="ar"?"إدارة التعويضات":"Compensation Policy", icon: CircleDollarSign },
    { href: "/admin/settings", label: t.settings, icon: Settings },
  ];
  const groups = admin
    ? [{ label: locale === "ar" ? "الإدارة" : "Management", items: adminNav }, { label: locale === "ar" ? "مساحة الموظف" : "Employee space", items: employeeNav.slice(0, 6) }]
    : [{ label: locale === "ar" ? "مساحة العمل" : "Workspace", items: employeeNav.slice(0, 6) }, { label: locale === "ar" ? "متابعتي" : "My activity", items: employeeNav.slice(6) }];

  return (
    <div className="app-shell min-h-screen" data-locale={locale}>
      <aside className={cn("sidebar fixed inset-y-0 z-50 flex w-[304px] flex-col p-4 transition-transform duration-300 lg:translate-x-0", open?"translate-x-0":locale==="ar"?"translate-x-full lg:translate-x-0":"-translate-x-full lg:translate-x-0")} style={locale==="ar"?{right:0,left:"auto"}:{left:0,right:"auto"}}>
        <div className="sidebar-head flex items-center justify-between">
          <Logo />
        </div>
        <nav className="sidebar-scroll flex-1 overflow-y-auto py-3">
          {groups.map((group) => <section className="sidebar-section" key={group.label}>
            <p className="sidebar-section-label">{group.label}</p>
            <div className="space-y-1">
              {group.items.map(({ href, label, icon: Icon }) => {
                const active = path === href || path.startsWith(href + "/");
                return <Link key={href} href={href} onClick={() => setOpen(false)} className={cn("sidebar-link group flex items-center gap-3", active && "active")}>
                  <span className="sidebar-icon"><Icon size={18} /></span>
                  <span className="min-w-0 flex-1 truncate">{label}</span>
                  {href === "/notifications" && <span className="sidebar-badge">{demoNotifications.filter((notification) => !notification.is_read).length}</span>}
                  {active && (locale === "ar" ? <ChevronLeft className="sidebar-chevron" size={15} /> : <ChevronRight className="sidebar-chevron" size={15} />)}
                </Link>;
              })}
            </div>
          </section>)}
        </nav>
        <div className="sidebar-footer">
          <Link href="/profile" className="sidebar-user">
            <span className="sidebar-avatar">أ<i /></span>
            <div className="min-w-0 flex-1"><b className="block truncate text-xs">{locale === "ar" ? "أحمد محمد" : "Ahmad Mohammad"}</b><span className="mt-0.5 block truncate text-[10px]">Customer Chat</span></div>
            {locale === "ar" ? <ChevronLeft size={15} /> : <ChevronRight size={15} />}
          </Link>
          <Link href="/login" className="sidebar-logout"><LogOut size={16} /><span>{t.logout}</span></Link>
        </div>
      </aside>

      {open && <button className="fixed inset-0 z-40 bg-black/30 lg:hidden" onClick={() => setOpen(false)} aria-label="إغلاق القائمة" />}

      <header className="topbar sticky top-0 z-30 flex h-[88px] items-center gap-3 px-4 sm:px-8">
        <button className="lg:hidden" onClick={() => setOpen(true)} aria-label="فتح القائمة"><Menu /></button>
        <div><h1 className="text-xl font-black sm:text-2xl">{title}</h1><p className="hidden text-xs text-[var(--muted)] sm:block">{t.follow}</p></div>
        <div className="mr-auto flex items-center gap-2 rtl:mr-auto ltr:ml-auto ltr:mr-0">
          {action}
          <button data-no-auto-translate className="toolbar-btn hidden sm:flex" onClick={() => setLocale(locale === "ar" ? "en" : "ar")} aria-label="تبديل اللغة"><Globe2 size={18} /><span className="text-xs font-bold">{locale === "ar" ? "English" : "العربية"}</span></button>
          <button className="toolbar-btn" onClick={toggle} aria-label="تبديل الوضع">{theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}</button>
          <Link href="/notifications" className="toolbar-btn relative"><Bell size={18} /><i className="absolute left-2 top-2 size-2 rounded-full bg-[var(--primary)] ring-2 ring-white" /></Link>
        </div>
      </header>

      {showCelebrationStrip && <CelebrationStrip />}
      <main className="w-full p-4 sm:p-8">{children}</main>
      <nav className="mobile-dock fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 px-1 pb-[max(8px,env(safe-area-inset-bottom))] pt-2 lg:hidden">
        {employeeNav.slice(0, 5).map(({ href, label, icon: Icon }) => <Link key={href} href={href} className={cn("flex flex-col items-center gap-1 text-[9px] text-[var(--muted)]", path === href && "font-bold text-[var(--primary)]")}><Icon size={19} />{label}</Link>)}
      </nav>
    </div>
  );
}

export function SearchBox({ placeholder, value, onChange }: { placeholder?: string; value?: string; onChange?: (value: string) => void }) {
  const { t } = useLocale();
  return <label className="relative block"><Search className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)] rtl:right-3 ltr:left-3 ltr:right-auto" size={18} /><input className="input rtl:pr-10 ltr:pl-10" placeholder={placeholder ?? t.search} value={value} onChange={(event) => onChange?.(event.target.value)} /></label>;
}
