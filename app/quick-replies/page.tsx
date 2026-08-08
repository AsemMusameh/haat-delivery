"use client";

import { Check, Copy, Headphones, Languages, MessageSquareText, MessagesSquare, Search, Sparkles } from "lucide-react";
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

  useEffect(() => {
    fetch("/api/content", { cache: "no-store" })
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((data) => data.replies?.length && setReplies(data.replies))
      .catch(() => undefined);
  }, []);

  const countFor = (value: Exclude<ReplyDepartment, "both">) => replies.filter((item) => item.department === value || item.department === "both").length;

  const visible = useMemo(() => {
    if (!department) return [];
    const value = query.trim().toLowerCase();
    return replies.filter((item) =>
      (item.department === department || item.department === "both") &&
      (category === "all" || item.category === category) &&
      (!value || `${item.title} ${item.bodyAr} ${item.bodyHe} ${item.bodyEn}`.toLowerCase().includes(value))
    );
  }, [replies, department, category, query]);

  const chooseDepartment = (value: Exclude<ReplyDepartment, "both">) => {
    setDepartment(value);
    setCategory("all");
    setQuery("");
  };
  const replyBody = (item: ReplyTemplate) => language === "ar" ? item.bodyAr : language === "he" ? item.bodyHe : item.bodyEn;
  const copy = async (item: ReplyTemplate) => {
    await navigator.clipboard.writeText(replyBody(item));
    setCopied(item.id);
    toast.success(ar ? "تم نسخ الرد" : "Reply copied");
    window.setTimeout(() => setCopied(undefined), 1600);
  };

  return <AppShell title={ar ? "الردود الجاهزة" : "Quick Replies"}>
    <div className="mx-auto max-w-7xl">
      {!department ? <>
        <section className="relative mb-6 overflow-hidden rounded-[30px] border border-rose-100 bg-gradient-to-br from-white via-rose-50 to-amber-50 p-7 text-center shadow-[0_20px_55px_rgba(126,0,35,.08)] dark:border-rose-950/50 dark:from-[var(--surface)] dark:via-rose-950/20 dark:to-amber-950/10 sm:p-10">
          <div className="absolute -left-12 -top-20 size-48 rounded-full bg-rose-200/35 blur-2xl" />
          <div className="relative z-10 mx-auto max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-[var(--primary)] px-3 py-1.5 text-[10px] font-black text-white"><Sparkles size={13}/>{ar ? "رد أسرع وأكثر احترافية" : "Faster, professional support"}</span>
            <h2 className="mt-4 text-2xl font-black sm:text-3xl">{ar ? "أي قسم تعمل عليه الآن؟" : "Which team are you working with?"}</h2>
            <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{ar ? "اختر القسم أولًا لتظهر لك الردود المناسبة فقط، بدون ازدحام أو بحث طويل." : "Choose a team to see only the replies relevant to your work."}</p>
          </div>
        </section>
        <section className="grid gap-5 md:grid-cols-2">
          <DepartmentCard icon={MessagesSquare} title={ar ? "تشات الزبائن" : "Customer Chat"} description={ar ? "ردود مكتوبة للمحادثات، المتابعة، الطلبات والتعويضات." : "Written replies for chats, follow-ups, orders, and compensation."} count={countFor("chat")} action={ar ? "فتح ردود التشات" : "Open chat replies"} tone="rose" onClick={() => chooseDepartment("chat")} />
          <DepartmentCard icon={Headphones} title={ar ? "فويس الزبائن" : "Customer Voice"} description={ar ? "نصوص مكالمات مرتبة من افتتاح المكالمة حتى الإغلاق والمتابعة." : "Call scripts from the opening through follow-up and closing."} count={countFor("voice")} action={ar ? "فتح ردود الفويس" : "Open voice replies"} tone="blue" onClick={() => chooseDepartment("voice")} />
        </section>
      </> : <>
        <section className="relative mb-6 overflow-hidden rounded-[28px] border border-rose-100 bg-gradient-to-br from-white via-rose-50 to-amber-50 p-6 shadow-[0_20px_55px_rgba(126,0,35,.08)] dark:border-rose-950/50 dark:from-[var(--surface)] dark:via-rose-950/20 dark:to-amber-950/10 sm:p-8">
          <div className="absolute -left-12 -top-20 size-48 rounded-full bg-rose-200/35 blur-2xl" />
          <div className="relative z-10 grid gap-6 lg:grid-cols-[1fr_420px] lg:items-end">
            <div>
              <button onClick={() => setDepartment(undefined)} className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-white/80 px-3 py-1.5 text-[10px] font-black text-[var(--primary)] dark:bg-[var(--surface)]">{department === "chat" ? <MessagesSquare size={13}/> : <Headphones size={13}/>} {department === "chat" ? (ar ? "تشات الزبائن" : "Customer Chat") : (ar ? "فويس الزبائن" : "Customer Voice")} · {ar ? "تغيير القسم" : "Change team"}</button>
              <h2 className="mt-4 text-2xl font-black sm:text-3xl">{ar ? "اختر الحالة، انسخ الرد، وأرسله" : "Choose, copy, and send"}</h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)]">{ar ? "الردود مرتبة حسب الحالة ومتوفرة بالعربية والعبرية والإنجليزية. راجع الكلمات بين الأقواس قبل الاستخدام." : "Replies are organized by case in Arabic, Hebrew, and English."}</p>
            </div>
            <label className="relative"><Search className="absolute start-4 top-1/2 -translate-y-1/2 text-[var(--muted)]" size={18}/><input className="input h-12 ps-11" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={ar ? "ابحث باسم الحالة أو كلمة من الرد..." : "Search replies..."}/></label>
          </div>
        </section>
        <div className="mb-5 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex gap-2 overflow-x-auto pb-1"><button onClick={() => setCategory("all")} className={category === "all" ? "btn btn-primary whitespace-nowrap !py-2 text-xs" : "btn btn-secondary whitespace-nowrap !py-2 text-xs"}>{ar ? "الكل" : "All"}</button>{replyCategories.map((item) => <button key={item.id} onClick={() => setCategory(item.id)} className={category === item.id ? "btn btn-primary whitespace-nowrap !py-2 text-xs" : "btn btn-secondary whitespace-nowrap !py-2 text-xs"}>{item.emoji} {ar ? item.ar : item.en}</button>)}</div>
          <div className="inline-flex w-fit items-center gap-1 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-1"><Languages className="mx-2 text-[var(--muted)]" size={17}/>{(["ar", "he", "en"] as ReplyLanguage[]).map((value) => <button key={value} onClick={() => setLanguage(value)} className={language === value ? "rounded-xl bg-[var(--primary)] px-4 py-2 text-xs font-black text-white" : "rounded-xl px-4 py-2 text-xs font-black text-[var(--muted)] hover:bg-[var(--surface-2)]"}>{languageNames[value]}</button>)}</div>
        </div>
        <div className="mb-4 flex items-center justify-between"><h3 className="font-black">{ar ? `${visible.length} رد جاهز` : `${visible.length} ready replies`}</h3><span className="text-[10px] font-bold text-[var(--muted)]">{ar ? "اضغط على نسخ الرد لاستخدامه مباشرة" : "Copy a reply to use it"}</span></div>
        {visible.length ? <section className="grid items-start gap-4 lg:grid-cols-2">{visible.map((item) => { const categoryInfo = replyCategories.find((entry) => entry.id === item.category); return <article key={item.id} className="card overflow-hidden p-5"><div className="flex items-start justify-between gap-3"><div><span className="text-[10px] font-black text-[var(--primary)]">{categoryInfo?.emoji} {ar ? categoryInfo?.ar : categoryInfo?.en}</span><h4 className="mt-1.5 font-black">{item.title}</h4></div><button onClick={() => copy(item)} className={copied === item.id ? "btn bg-emerald-600 !px-3 !py-2 text-xs text-white" : "btn btn-secondary !px-3 !py-2 text-xs"}>{copied === item.id ? <Check size={15}/> : <Copy size={15}/>} {copied === item.id ? (ar ? "تم النسخ" : "Copied") : (ar ? "نسخ الرد" : "Copy")}</button></div><p dir={language === "he" ? "rtl" : language === "en" ? "ltr" : "rtl"} className="mt-4 whitespace-pre-wrap rounded-2xl border border-[var(--line)] bg-[var(--surface-2)] p-4 text-sm leading-8">{replyBody(item)}</p><div className="mt-3 flex items-center gap-2 text-[10px] text-[var(--muted)]"><MessageSquareText size={13}/>{ar ? "راجع البيانات بين الأقواس قبل الاستخدام" : "Review placeholders before use"}</div></article>})}</section> : <div className="card p-12 text-center"><Search className="mx-auto text-[var(--muted)]"/><h3 className="mt-3 font-black">{ar ? "لا توجد ردود مطابقة" : "No matching replies"}</h3><button className="mt-3 text-xs font-black text-[var(--primary)]" onClick={() => { setQuery(""); setCategory("all"); }}>{ar ? "عرض كل الردود" : "Show all replies"}</button></div>}
      </>}
    </div>
  </AppShell>;
}

function DepartmentCard({ icon: Icon, title, description, count, action, tone, onClick }: { icon: typeof MessagesSquare; title: string; description: string; count: number; action: string; tone: "rose" | "blue"; onClick: () => void }) {
  const colors = tone === "rose" ? "from-rose-50 to-orange-50 text-rose-700 dark:from-rose-950/30 dark:to-orange-950/20" : "from-sky-50 to-indigo-50 text-sky-700 dark:from-sky-950/30 dark:to-indigo-950/20";
  return <button onClick={onClick} className={`group relative overflow-hidden rounded-[28px] border border-[var(--line)] bg-gradient-to-br ${colors} p-6 text-start shadow-[0_16px_40px_rgba(15,23,42,.07)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_55px_rgba(15,23,42,.12)] sm:p-8`}>
    <div className="flex items-start justify-between gap-4"><span className="grid size-16 place-items-center rounded-[22px] bg-white shadow-sm dark:bg-[var(--surface)]"><Icon size={30}/></span><span className="rounded-full bg-white/80 px-3 py-1.5 text-[10px] font-black text-[var(--muted)] dark:bg-[var(--surface)]">{count} رد</span></div>
    <h3 className="mt-6 text-2xl font-black text-[var(--foreground)]">{title}</h3><p className="mt-3 max-w-md text-sm leading-7 text-[var(--muted)]">{description}</p>
    <span className="mt-6 inline-flex items-center gap-2 text-xs font-black">{action}<span className="transition-transform group-hover:-translate-x-1">←</span></span>
  </button>;
}
