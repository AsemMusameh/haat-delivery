"use client";

import {
  AppWindow, Bell, Bookmark, BookOpenCheck, BrainCircuit, CalendarDays, ChartNoAxesCombined, ChevronLeft, ChevronRight,
  CircleDollarSign, CircleUserRound, ClipboardList, FileImage, FileWarning, Home,
  KeyRound, LayoutGrid, LayoutList, LockKeyhole, LogOut, MapPinned, Megaphone, Menu, MessageCircleMore,
  MessageSquareText, MessagesSquare, Moon, Plus, Plug, Search, Settings, Sparkles, Sun, Users, UsersRound,
  UtensilsCrossed, X, GraduationCap,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { demoEmployees, demoNotifications, departmentHeadEmails } from "@/lib/demo-data";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { isLockedFeature } from "@/lib/locked-features";
import { useProfile } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import { CelebrationStrip } from "./celebration-strip";
import { useLocale } from "./locale-provider";
import { Logo } from "./logo";
import { useTheme } from "./theme-provider";

export function AppShell({ children, title, admin = false, action }: { children: React.ReactNode; title: string; admin?: boolean; action?: React.ReactNode }) {
  const path = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [signingOut, setSigningOut] = useState(false);
  const [pendingPath, setPendingPath] = useState("");
  const [sessionProfile, setSessionProfile] = useState<(typeof demoEmployees)[number] | null>(null);
  const [accountPermissions, setAccountPermissions] = useState<Record<string, boolean>>({});
  const { theme, toggle } = useTheme();
  const { locale, t } = useLocale();
  const profile = useProfile();
  const activeProfile = sessionProfile ?? profile;
  const ar = locale === "ar";
  const roleLabel = departmentHeadEmails.has(activeProfile.email.toLowerCase())
    ? (ar ? "مسؤول قسم" : "Department head")
    : activeProfile.department_id === "quality-assurance"
      ? (ar ? "جودة" : "Quality")
      : ({ employee: ar ? "موظف" : "Employee", supervisor: ar ? "مسؤول شفتات" : "Shift manager", manager: ar ? "مدير" : "Manager", admin: ar ? "مدير" : "Manager" } as const)[activeProfile.role];
  const roleAdmin = sessionProfile ? ["manager", "admin"].includes(sessionProfile.role) : admin;
  const shellAdmin = admin || roleAdmin;
  const showCelebrationStrip = path === "/community" || path === "/messages";

  const employeeNav = [
    { href: "/dashboard", label: t.home, icon: Home },
    { href: "/requests", label: ar ? "الطلبات" : "Requests", icon: ClipboardList },
    { href: "/announcements", label: t.announcements, icon: Megaphone },
    { href: "/guidelines", label: "التوجيهات", icon: BookOpenCheck },
    { href: "/coverage", label: ar ? "مناطق التشغيل" : "Operating Areas", icon: MapPinned },
    { href: "/daily-reports", label: "التقارير اليومية", icon: CalendarDays },
    { href: "/monthly-reports", label: "التقارير الشهرية", icon: FileImage },
    { href: "/order-complaints", label: "شكوى طلبية", icon: FileWarning },
    { href: "/shift-leads", label: "مسؤولو الشفت الحالي", icon: UsersRound },
    { href: "/ads", label: "الإعلانات", icon: Megaphone },
    { href: "/compensations", label: ar ? "التعويضات" : "Compensations", icon: CircleDollarSign },
    { href: "/restaurants", label: ar ? "التواصل مع المطاعم" : "Restaurant Contacts", icon: UtensilsCrossed },
    { href: "/community", label: ar ? "مجتمع الشركة" : "Company Feed", icon: MessagesSquare },
    { href: "/messages", label: ar ? "الرسائل" : "Messages", icon: MessageCircleMore },
    { href: "/apps", label: ar ? "الروابط والأدوات" : "Links & Tools", icon: AppWindow },
    { href: "/quick-replies", label: ar ? "الردود الجاهزة" : "Quick Replies", icon: MessageSquareText },
    { href: "/performance", label: ar ? "الجودة والأداء" : "Quality & Performance", icon: ChartNoAxesCombined },
    { href: "/ai-assist", label: "AI Agent Assist", icon: Sparkles },
    { href: "/simulator", label: "HAAT Simulator", icon: GraduationCap },
    { href: "/office-brain", label: "Office Brain", icon: BrainCircuit },
    { href: "/bookmarks", label: t.bookmarks, icon: Bookmark },
    { href: "/notifications", label: t.notifications, icon: Bell },
    { href: "/settings", label: "الإعدادات", icon: Settings },
    { href: "/profile", label: t.profile, icon: CircleUserRound },
  ];
  const adminNav = [
    { href: "/admin", label: t.admin, icon: ChartNoAxesCombined },
    { href: "/admin/announcements/new", label: t.newAnnouncement, icon: Megaphone },
    { href: "/announcements", label: t.announcements, icon: Megaphone },
    { href: "/admin/reports", label: t.reports, icon: ChartNoAxesCombined },
    { href: "/guidelines", label: "التوجيهات", icon: BookOpenCheck },
    { href: "/daily-reports", label: "التقارير اليومية", icon: CalendarDays },
    { href: "/monthly-reports", label: "التقارير الشهرية", icon: FileImage },
    { href: "/order-complaints", label: "شكاوى الطلبيات", icon: FileWarning },
    { href: "/shift-leads", label: "مسؤولو الشفت الحالي", icon: UsersRound },
    { href: "/admin/shift-leads", label: "إدارة مسؤولي الشفت", icon: UsersRound },
    { href: "/ads", label: "الإعلانات", icon: Megaphone },
    { href: "/admin/requests", label: ar ? "إدارة الطلبات" : "Manage Requests", icon: ClipboardList },
    { href: "/admin/employees", label: t.employees, icon: Users },
    { href: "/admin/permissions", label: ar ? "الحسابات والصلاحيات" : "Accounts & Permissions", icon: KeyRound },
    { href: "/admin/coverage", label: ar ? "مناطق التشغيل" : "Coverage Areas", icon: MapPinned },
    { href: "/admin/integrations", label: ar ? "التكاملات" : "Integrations", icon: Plug },
    { href: "/admin/records", label: t.records, icon: FileWarning },
    { href: "/admin/compensations", label: ar ? "إدارة التعويضات" : "Compensation Policy", icon: CircleDollarSign },
    { href: "/admin/content", label: ar ? "إدارة الإضافات" : "Manage Additions", icon: LayoutList },
    { href: "/admin/office-brain", label: ar ? "إدارة Office Brain" : "Manage Office Brain", icon: BrainCircuit },
    { href: "/admin/settings", label: t.settings, icon: Settings },
  ];
  const permissionForPath: Record<string, string> = {
    "/announcements": "view_announcements", "/requests": "create_requests",
    "/daily-reports": "view_reports", "/monthly-reports": "view_reports",
    "/apps": "use_tools", "/order-complaints": "submit_complaints", "/guidelines": "read_guidelines",
  };
  const visibleEmployeeNav = employeeNav.filter((item) => accountPermissions[permissionForPath[item.href]] !== false);
  const groups = shellAdmin
    ? [{ label: ar ? "إدارة المنصة" : "Management", items: adminNav }]
    : [{ label: ar ? "العمل اليومي" : "Daily work", items: visibleEmployeeNav.slice(0, 15) }, { label: ar ? "الأدوات والمتابعة" : "Tools & activity", items: visibleEmployeeNav.slice(15) }];
  const allNav = shellAdmin ? adminNav : visibleEmployeeNav;
  const needle = query.trim().toLocaleLowerCase(ar ? "ar" : "en");
  const filteredNav = allNav.filter((item) => !needle || item.label.toLocaleLowerCase(ar ? "ar" : "en").includes(needle)).slice(0, 9);
  const mobileNav = shellAdmin
    ? ["/admin", "/admin/requests", "/monthly-reports", "/admin/employees", "/admin/settings"].map((href) => adminNav.find((item) => item.href === href)!).filter(Boolean)
    : ["/dashboard", "/requests", "/daily-reports", "/monthly-reports", "/settings"].map((href) => visibleEmployeeNav.find((item) => item.href === href)!).filter(Boolean);

  useEffect(() => {
    if (isSupabaseConfigured) return;
    const id = window.localStorage.getItem("haat-current-user");
    const current = demoEmployees.find((employee) => employee.id === id);
    if (!current) { window.location.replace("/login"); return; }
    setSessionProfile(current);
    const token = window.localStorage.getItem("haat-session-token");
    if (token) fetch(`/api/account-permissions?userId=${encodeURIComponent(current.id)}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((response) => response.ok ? response.json() : { permissions: {} })
      .then((data) => setAccountPermissions(data.permissions || {}))
      .catch(() => setAccountPermissions({}));
  }, []);

  useEffect(() => {
    if (isSupabaseConfigured || !sessionProfile) return;
    const privileged = ["manager", "admin"].includes(sessionProfile.role);
    const sharedRolePages = [
      "/profile",
      "/guidelines",
      "/coverage",
      "/daily-reports",
      "/monthly-reports",
      "/announcements",
      "/notifications",
      "/settings",
      "/ads",
      "/order-complaints",
      "/shift-leads",
    ];
    if (privileged && !path.startsWith("/admin") && !sharedRolePages.some((page) => path === page || path.startsWith(`${page}/`))) router.replace("/admin");
    if (!privileged && path.startsWith("/admin")) router.replace("/dashboard");
  }, [path, router, sessionProfile]);

  useEffect(() => {
    allNav.filter((item) => !isLockedFeature(item.href)).forEach((item) => router.prefetch(item.href));
  }, [router, shellAdmin]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCommandOpen((value) => !value);
      }
      if (event.key === "Escape") {
        setCommandOpen(false);
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const go = (href: string) => {
    setCommandOpen(false);
    setQuery("");
    setPendingPath(href);
    router.push(href);
  };

  const signOut = async () => {
    if (signingOut) return;
    setSigningOut(true);
    try {
      if (isSupabaseConfigured) await createClient()?.auth.signOut({ scope: "local" });
      else {
        const token = window.localStorage.getItem("haat-session-token");
        if (token) await fetch("/api/account-auth", { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }).catch(() => {});
      }
    } finally {
      window.localStorage.removeItem("haat-current-user");
      window.localStorage.removeItem("haat-session-token");
      window.location.replace("/login");
    }
  };

  return (
    <div className="app-shell min-h-screen" data-locale={locale}>
      <aside className={cn("sidebar fixed inset-y-0 z-50 flex w-[282px] flex-col p-3 transition-transform duration-300 lg:translate-x-0", open ? "translate-x-0" : ar ? "translate-x-full lg:translate-x-0" : "-translate-x-full lg:translate-x-0")} style={ar ? { right: 0, left: "auto" } : { left: 0, right: "auto" }}>
        <div className="sidebar-head flex items-center justify-between">
          <Logo />
        </div>
        <button className="sidebar-command" onClick={() => setCommandOpen(true)}><Search size={16} /><span>{ar ? "بحث سريع في المنصة" : "Quick search"}</span><kbd>⌘K</kbd></button>
        <nav className="sidebar-scroll flex-1 overflow-y-auto py-2">
          {groups.map((group) => <section className="sidebar-section" key={group.label}>
            <p className="sidebar-section-label">{group.label}</p>
            <div className="space-y-0.5">
              {group.items.map(({ href, label, icon: Icon }) => {
                const active = path === href || path.startsWith(href + "/") || pendingPath === href;
                if (isLockedFeature(href)) return <div key={href} aria-disabled="true" className="sidebar-link flex cursor-not-allowed items-center gap-3 opacity-50">
                  <span className="sidebar-icon"><Icon size={17} /></span>
                  <span className="min-w-0 flex-1 truncate">{label}</span>
                  <span className="flex items-center gap-1 rounded-full bg-[var(--surface-2)] px-2 py-1 text-[9px] font-bold text-[var(--muted)]"><LockKeyhole size={10} />{ar ? "قيد الإنشاء" : "Coming soon"}</span>
                </div>;
                return <Link prefetch key={href} href={href} onPointerEnter={() => router.prefetch(href)} onPointerDown={() => router.prefetch(href)} onClick={() => { setPendingPath(href); setOpen(false); }} className={cn("sidebar-link group flex items-center gap-3", active && "active")}>
                  <span className="sidebar-icon"><Icon size={17} /></span>
                  <span className="min-w-0 flex-1 truncate">{label}</span>
                  {href === "/notifications" && <span className="sidebar-badge">{demoNotifications.filter((notification) => !notification.is_read).length}</span>}
                  {active && (ar ? <ChevronLeft className="sidebar-chevron" size={14} /> : <ChevronRight className="sidebar-chevron" size={14} />)}
                </Link>;
              })}
            </div>
          </section>)}
        </nav>
        <div className="sidebar-footer">
          <Link href="/profile" className="sidebar-user"><span className="sidebar-avatar">{activeProfile.full_name[0]}<i /></span><div className="min-w-0 flex-1"><b className="block truncate text-xs">{activeProfile.full_name}</b><span className="mt-0.5 block truncate text-[10px]">{roleLabel} · {activeProfile.department?.name}</span></div>{ar ? <ChevronLeft size={15} /> : <ChevronRight size={15} />}</Link>
          <button type="button" className="sidebar-logout w-full" onClick={signOut} disabled={signingOut}><LogOut size={16} /><span>{signingOut ? (ar ? "جارٍ تسجيل الخروج..." : "Signing out...") : t.logout}</span></button>
        </div>
      </aside>

      {open && <button className="fixed inset-0 z-40 bg-black/30 lg:hidden" onClick={() => setOpen(false)} aria-label={ar ? "إغلاق القائمة" : "Close menu"} />}

      <header className="topbar sticky top-0 z-30 flex h-[74px] items-center gap-3 px-4 sm:px-7">
        <button className="toolbar-btn lg:hidden" onClick={() => setOpen(true)} aria-label={ar ? "فتح القائمة" : "Open menu"}><Menu size={20} /></button>
        <div className="min-w-0"><div className="topbar-context"><LayoutGrid size={11} />{shellAdmin ? (ar ? "الإدارة" : "Admin") : (ar ? "مساحة العمل" : "Workspace")}</div><h1 className="truncate text-lg font-black sm:text-xl">{title}</h1></div>
        <div className="mr-auto flex items-center gap-2 rtl:mr-auto ltr:ml-auto ltr:mr-0">
          {action}
          <button className="topbar-search hidden md:flex" onClick={() => setCommandOpen(true)}><Search size={16} /><span>{ar ? "ابحث أو انتقل..." : "Search or jump..."}</span><kbd>⌘K</kbd></button>
          <Link href={shellAdmin ? "/admin/announcements/new" : "/requests?new=other"} className="toolbar-btn toolbar-primary" aria-label={ar ? "إضافة جديد" : "Create new"}><Plus size={18} /></Link>
          <button className="toolbar-btn" onClick={toggle} aria-label={ar ? "تبديل الوضع" : "Toggle theme"}>{theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}</button>
          <Link href="/notifications" className="toolbar-btn relative" aria-label={t.notifications}><Bell size={18} /><i className="absolute left-2 top-2 size-2 rounded-full bg-[var(--primary)] ring-2 ring-white" /></Link>
        </div>
      </header>

      {showCelebrationStrip && <CelebrationStrip />}
      <main className="workspace-main w-full p-4 sm:p-7">{children}</main>
      <nav className="mobile-dock fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 px-1 pb-[max(8px,env(safe-area-inset-bottom))] pt-2 lg:hidden">
        {mobileNav.map(({ href, label, icon: Icon }) => isLockedFeature(href)
          ? <div key={href} aria-disabled="true" className="flex cursor-not-allowed flex-col items-center gap-1 text-[9px] text-[var(--muted)] opacity-45"><span className="relative"><Icon size={19} /><LockKeyhole className="absolute -bottom-1 -right-2 rounded-full bg-[var(--surface)] p-0.5" size={11} /></span>{label}</div>
          : <Link prefetch key={href} href={href} onPointerEnter={() => router.prefetch(href)} onPointerDown={() => router.prefetch(href)} onClick={() => setPendingPath(href)} className={cn("flex flex-col items-center gap-1 text-[9px] text-[var(--muted)]", (path === href || path.startsWith(href + "/") || pendingPath === href) && "font-bold text-[var(--primary)]")}><Icon size={19} />{label}</Link>)}
      </nav>

      {commandOpen && <div className="command-backdrop" onMouseDown={() => setCommandOpen(false)}><section className="command-panel" onMouseDown={(event) => event.stopPropagation()} role="dialog" aria-modal="true" aria-label={ar ? "بحث سريع" : "Quick search"}>
        <header><Search size={20} /><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder={ar ? "اكتب اسم صفحة أو مهمة..." : "Type a page or task..."} /><button onClick={() => setCommandOpen(false)} aria-label={ar ? "إغلاق" : "Close"}><X size={18} /></button></header>
        <div className="command-results"><span>{ar ? "انتقال سريع" : "Quick jump"}</span>{filteredNav.map(({ href, label, icon: Icon }) => isLockedFeature(href)
          ? <button key={href} type="button" disabled onClick={() => setCommandOpen(false)} className="cursor-not-allowed opacity-50"><i><Icon size={18} /></i><b>{label}</b><small>{ar ? "قيد الإنشاء" : "Coming soon"}</small><LockKeyhole size={15} /></button>
          : <button key={href} onClick={() => go(href)}><i><Icon size={18} /></i><b>{label}</b><small>{href}</small><ChevronLeft size={16} /></button>)}{filteredNav.length === 0 && <p>{ar ? "لا توجد نتيجة مطابقة" : "No matching result"}</p>}</div>
        <footer><span><kbd>Esc</kbd> {ar ? "إغلاق" : "Close"}</span><span><kbd>↵</kbd> {ar ? "فتح" : "Open"}</span></footer>
      </section></div>}
    </div>
  );
}

export function SearchBox({ placeholder, value, onChange }: { placeholder?: string; value?: string; onChange?: (value: string) => void }) {
  const { t } = useLocale();
  return <label className="relative block"><Search className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)] rtl:right-3 ltr:left-3 ltr:right-auto" size={18} /><input className="input rtl:pr-10 ltr:pl-10" placeholder={placeholder ?? t.search} value={value} onChange={(event) => onChange?.(event.target.value)} /></label>;
}
