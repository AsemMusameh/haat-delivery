"use client";

import { BookOpenText, Check, ChevronDown, ChevronUp, Copy, Headphones, Languages, LayoutGrid, MessageSquareText, MessagesSquare, Search, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { useLocale } from "@/components/locale-provider";
import { defaultReplies, replyCategories, type ReplyDepartment, type ReplyTemplate } from "@/lib/content-defaults";

type ReplyLanguage = "ar" | "he" | "en";
const languageNames: Record<ReplyLanguage, string> = { ar: "العربية", he: "עברית", en: "English" };

export default function QuickRepliesPage() {
  const { locale } = useLocale();
  const ar = locale === "ar";
  const [replies, setReplies] = useState<ReplyTemplate[]>(defaultReplies);
  const [department, setDepartment] = useState<Exclude<ReplyDepartment, "both">>();
  const [category, setCategory] = useState("all");
  const [language, setLanguage] = useState<ReplyLanguage>("ar");
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState<string>();
  const [expanded, setExpanded] = useState<Set<string>>(new Set(["guide-chat-basics"]));

  useEffect(() => {
    fetch("/api/content", { cache: "no-store" })
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((data) => data.replies?.length && setReplies(data.replies))
      .catch(() => undefined);
  }, []);

  const departmentItems = useMemo(() => department ? replies.filter((item) => item.department === department || item.department === "both") : [], [replies, department]);
  const countFor = (value: Exclude<ReplyDepartment, "both">) => replies.filter((item) => item.department === value || item.department === "both").length;
  const availableCategories = useMemo(() => replyCategories.filter((entry) => departmentItems.some((item) => item.category === entry.id)), [departmentItems]);
  const visible = useMemo(() => {
    const value = query.trim().toLowerCase();
    return departmentItems.filter((item) =>
      (category === "all" || item.category === category) &&
      (!value || `${item.title} ${item.bodyAr} ${item.bodyHe} ${item.bodyEn}`.toLowerCase().includes(value))
    );
  }, [departmentItems, category, query]);

  const guideCount = departmentItems.filter((item) => item.contentType === "guide").length;
  const macroCount = departmentItems.length - guideCount;
  const chooseDepartment = (value: Exclude<ReplyDepartment, "both">) => {
    setDepartment(value);
    setCategory("all");
    setQuery("");
  };
  const bodyFor = (item: ReplyTemplate) => language === "ar" ? item.bodyAr : language === "he" ? item.bodyHe : item.bodyEn;
  const copy = async (item: ReplyTemplate) => {
    await navigator.clipboard.writeText(bodyFor(item));
    setCopied(item.id);
    toast.success(ar ? "تم نسخ الماكرو" : "Macro copied");
    window.setTimeout(() => setCopied(undefined), 1600);
  };
  const toggleGuide = (id: string) => setExpanded((current) => {
    const next = new Set(current);
    if (next.has(id)) next.delete(id); else next.add(id);
    return next;
  });

  return <AppShell title={ar ? "دليل الموظف والردود" : "Employee Guide & Replies"}>
    <div className="mx-auto max-w-7xl">
      {!department ? <>
        <section className="relative mb-6 overflow-hidden rounded-[30px] border border-rose-100 bg-gradient-to-br from-white via-rose-50 to-amber-50 p-7 text-center shadow-[0_20px_55px_rgba(126,0,35,.08)] dark:border-rose-950/50 dark:from-[var(--surface)] dark:via-rose-950/20 dark:to-amber-950/10 sm:p-10">
          <div className="absolute -left-12 -top-20 size-48 rounded-full bg-rose-200/35 blur-2xl" />
          <div className="relative z-10 mx-auto max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-[var(--primary)] px-3 py-1.5 text-[10px] font-black text-white"><Sparkles size={13}/>{ar ? "دليل واضح وردود معتمدة" : "Clear guide and approved replies"}</span>
            <h2 className="mt-4 text-2xl font-black sm:text-3xl">{ar ? "أي قسم تعمل عليه الآن؟" : "Which team are you working with?"}</h2>
            <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{ar ? "اختر القسم لتظهر لك الإرشادات والردود الخاصة بعملك فقط." : "Choose a team to see only its relevant guidance and replies."}</p>
          </div>
        </section>
        <section className="grid gap-5 md:grid-cols-2">
          <DepartmentCard icon={MessagesSquare} title={ar ? "تشات الزبائن" : "Customer Chat"} description={ar ? "دليل الشات حسب السياسات، مع ماكرو جاهزة بالعربية والعبرية والإنجليزية." : "Chat policy guide with ready macros in Arabic, Hebrew, and English."} count={countFor("chat")} countLabel={ar ? "عنصر" : "items"} action={ar ? "فتح دليل التشات" : "Open chat guide"} tone="rose" onClick={() => chooseDepartment("chat")} />
          <DepartmentCard icon={Headphones} title={ar ? "فويس الزبائن" : "Customer Voice"} description={ar ? "نصوص مكالمات مرتبة من افتتاح المكالمة حتى الإغلاق والمتابعة." : "Call scripts from the opening through follow-up and closing."} count={countFor("voice")} countLabel={ar ? "رد" : "replies"} action={ar ? "فتح ردود الفويس" : "Open voice replies"} tone="blue" onClick={() => chooseDepartment("voice")} />
        </section>
      </> : <>
        <section className="relative mb-6 overflow-hidden rounded-[28px] border border-rose-100 bg-gradient-to-br from-white via-rose-50 to-amber-50 p-6 shadow-[0_20px_55px_rgba(126,0,35,.08)] dark:border-rose-950/50 dark:from-[var(--surface)] dark:via-rose-950/20 dark:to-amber-950/10 sm:p-8">
          <div className="absolute -left-12 -top-20 size-48 rounded-full bg-rose-200/35 blur-2xl" />
          <div className="relative z-10 grid gap-6 lg:grid-cols-[1fr_420px] lg:items-end">
            <div>
              <button onClick={() => setDepartment(undefined)} className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-white/80 px-3 py-1.5 text-[10px] font-black text-[var(--primary)] dark:bg-[var(--surface)]">{department === "chat" ? <MessagesSquare size={13}/> : <Headphones size={13}/>} {department === "chat" ? (ar ? "تشات الزبائن" : "Customer Chat") : (ar ? "فويس الزبائن" : "Customer Voice")} · {ar ? "تغيير القسم" : "Change team"}</button>
              <h2 className="mt-4 text-2xl font-black sm:text-3xl">{department === "chat" ? (ar ? "دليل الشات والماكرو الجاهزة" : "Chat guide and ready macros") : (ar ? "ردود الفويس الجاهزة" : "Ready voice replies")}</h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)]">{department === "chat" ? (ar ? "الإرشادات مرتبة بنفس تسلسل دليل الموظف، والماكرو قابلة للنسخ بثلاث لغات." : "Guidance follows the employee guide order, with copy-ready macros in three languages.") : (ar ? "اختر الحالة، راجع النص، وانسخه للاستخدام." : "Choose a case, review the text, and copy it.")}</p>
            </div>
            <label className="relative"><Search className="absolute start-4 top-1/2 -translate-y-1/2 text-[var(--muted)]" size={18}/><input className="input h-12 ps-11" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={ar ? "ابحث داخل الدليل أو الماكرو..." : "Search the guide or macros..."}/></label>
          </div>
        </section>
        <div className="mb-5 flex flex-col gap-4">
          <section className="quick-category-shell" aria-label={ar ? "تصفّح حالات الدليل" : "Browse guide categories"}>
            <header className="quick-category-heading"><span><LayoutGrid size={18}/></span><div><b>{ar ? "تصفّح حسب الحالة" : "Browse by case"}</b><small>{ar ? "اختر الحالة التي تعمل عليها الآن" : "Choose the case you are handling now"}</small></div></header>
            <div className="quick-category-track">
              <button aria-pressed={category === "all"} onClick={() => setCategory("all")} className={`quick-category-item ${category === "all" ? "active" : ""}`}><i><LayoutGrid size={18}/></i><span>{ar ? "كل المحتوى" : "All content"}</span><small>{departmentItems.length}</small></button>
              {availableCategories.map((item) => {const itemCount=departmentItems.filter((reply)=>reply.category===item.id).length;return <button aria-pressed={category === item.id} key={item.id} onClick={() => setCategory(item.id)} className={`quick-category-item ${category === item.id ? "active" : ""}`}><i>{item.emoji}</i><span>{ar ? item.ar : item.en}</span><small>{itemCount}</small></button>})}
            </div>
          </section>
          <div className="inline-flex w-fit items-center gap-1 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-1"><Languages className="mx-2 text-[var(--muted)]" size={17}/>{(["ar", "he", "en"] as ReplyLanguage[]).map((value) => <button key={value} onClick={() => setLanguage(value)} className={language === value ? "rounded-xl bg-[var(--primary)] px-4 py-2 text-xs font-black text-white" : "rounded-xl px-4 py-2 text-xs font-black text-[var(--muted)] hover:bg-[var(--surface-2)]"}>{languageNames[value]}</button>)}</div>
        </div>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2"><h3 className="font-black">{department === "chat" ? (ar ? `${guideCount} قسم إرشادي · ${macroCount} ماكرو` : `${guideCount} guide sections · ${macroCount} macros`) : (ar ? `${visible.length} رد جاهز` : `${visible.length} ready replies`)}</h3><span className="text-[10px] font-bold text-[var(--muted)]">{ar ? "افتح الإرشاد أو انسخ الماكرو مباشرة" : "Open guidance or copy a macro"}</span></div>
        {visible.length ? <section className="space-y-3">{visible.map((item) => {
          const categoryInfo = replyCategories.find((entry) => entry.id === item.category);
          const isGuide = item.contentType === "guide";
          const isOpen = expanded.has(item.id);
          return isGuide ? <article key={item.id} className="card overflow-hidden">
            <button onClick={() => toggleGuide(item.id)} className="flex w-full items-center gap-4 p-5 text-start hover:bg-[var(--surface-2)]"><span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[var(--primary-soft)] text-[var(--primary)]"><BookOpenText size={20}/></span><span className="min-w-0 flex-1"><small className="font-black text-[var(--primary)]">{categoryInfo?.emoji} {ar ? categoryInfo?.ar : categoryInfo?.en}</small><b className="mt-1 block text-sm sm:text-base">{item.title}</b></span><span className="grid size-9 shrink-0 place-items-center rounded-xl bg-[var(--surface-2)] text-[var(--muted)]">{isOpen ? <ChevronUp size={18}/> : <ChevronDown size={18}/>}</span></button>
            {isOpen && <div dir={language === "en" ? "ltr" : "rtl"} className="border-t border-[var(--line)] bg-[var(--surface-2)] p-5 text-sm leading-8 whitespace-pre-wrap sm:px-7">{bodyFor(item)}</div>}
          </article> : <article key={item.id} className="card overflow-hidden p-5"><div className="flex items-start justify-between gap-3"><div><span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-black text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300"><MessageSquareText size={12}/>{ar ? "ماكرو جاهز" : "Ready macro"}</span><span className="ms-2 text-[10px] font-black text-[var(--primary)]">{categoryInfo?.emoji} {ar ? categoryInfo?.ar : categoryInfo?.en}</span><h4 className="mt-2 font-black">{item.title}</h4></div><button onClick={() => copy(item)} className={copied === item.id ? "btn bg-emerald-600 !px-3 !py-2 text-xs text-white" : "btn btn-secondary !px-3 !py-2 text-xs"}>{copied === item.id ? <Check size={15}/> : <Copy size={15}/>} {copied === item.id ? (ar ? "تم النسخ" : "Copied") : (ar ? "نسخ الماكرو" : "Copy macro")}</button></div><p dir={language === "en" ? "ltr" : "rtl"} className="mt-4 whitespace-pre-wrap rounded-2xl border border-[var(--line)] bg-[var(--surface-2)] p-4 text-sm leading-8">{bodyFor(item)}</p></article>;
        })}</section> : <div className="card p-12 text-center"><Search className="mx-auto text-[var(--muted)]"/><h3 className="mt-3 font-black">{ar ? "لا توجد نتائج مطابقة" : "No matching results"}</h3><button className="mt-3 text-xs font-black text-[var(--primary)]" onClick={() => { setQuery(""); setCategory("all"); }}>{ar ? "عرض كل المحتوى" : "Show all content"}</button></div>}
      </>}
    </div>
  </AppShell>;
}

function DepartmentCard({ icon: Icon, title, description, count, countLabel, action, tone, onClick }: { icon: typeof MessagesSquare; title: string; description: string; count: number; countLabel: string; action: string; tone: "rose" | "blue"; onClick: () => void }) {
  const colors = tone === "rose" ? "from-rose-50 to-orange-50 text-rose-700 dark:from-rose-950/30 dark:to-orange-950/20" : "from-sky-50 to-indigo-50 text-sky-700 dark:from-sky-950/30 dark:to-indigo-950/20";
  return <button onClick={onClick} className={`group relative overflow-hidden rounded-[28px] border border-[var(--line)] bg-gradient-to-br ${colors} p-6 text-start shadow-[0_16px_40px_rgba(15,23,42,.07)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_55px_rgba(15,23,42,.12)] sm:p-8`}>
    <div className="flex items-start justify-between gap-4"><span className="grid size-16 place-items-center rounded-[22px] bg-white shadow-sm dark:bg-[var(--surface)]"><Icon size={30}/></span><span className="rounded-full bg-white/80 px-3 py-1.5 text-[10px] font-black text-[var(--muted)] dark:bg-[var(--surface)]">{count} {countLabel}</span></div>
    <h3 className="mt-6 text-2xl font-black text-[var(--foreground)]">{title}</h3><p className="mt-3 max-w-md text-sm leading-7 text-[var(--muted)]">{description}</p>
    <span className="mt-6 inline-flex items-center gap-2 text-xs font-black">{action}<span className="transition-transform group-hover:-translate-x-1">←</span></span>
  </button>;
}
