"use client";

import { Check, Copy, Languages, MessageSquareText, Search, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { useLocale } from "@/components/locale-provider";
import { defaultReplies, replyCategories, type ReplyTemplate } from "@/lib/content-defaults";

type ReplyLanguage = "ar" | "he" | "en";
const languageNames: Record<ReplyLanguage, string> = { ar: "العربية", he: "עברית", en: "English" };

export default function QuickRepliesPage() {
  const { locale } = useLocale();
  const ar = locale === "ar";
  const [replies, setReplies] = useState<ReplyTemplate[]>(defaultReplies);
  const [category, setCategory] = useState("all");
  const [language, setLanguage] = useState<ReplyLanguage>("ar");
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState<string>();

  useEffect(() => {
    fetch("/api/content", { cache: "no-store" }).then((response)=>response.ok?response.json():Promise.reject()).then((data)=>data.replies?.length&&setReplies(data.replies)).catch(()=>undefined);
  }, []);

  const visible = useMemo(()=>{
    const value=query.trim().toLowerCase();
    return replies.filter((item)=>(category==="all"||item.category===category)&&(!value||`${item.title} ${item.bodyAr} ${item.bodyHe} ${item.bodyEn}`.toLowerCase().includes(value)));
  },[replies,category,query]);

  const replyBody=(item:ReplyTemplate)=>language==="ar"?item.bodyAr:language==="he"?item.bodyHe:item.bodyEn;
  const copy=async(item:ReplyTemplate)=>{await navigator.clipboard.writeText(replyBody(item));setCopied(item.id);toast.success(ar?"تم نسخ الرد":"Reply copied");window.setTimeout(()=>setCopied(undefined),1600)};

  return <AppShell title={ar?"الردود الجاهزة":"Quick Replies"}>
    <div className="mx-auto max-w-7xl">
      <section className="relative mb-6 overflow-hidden rounded-[28px] border border-rose-100 bg-gradient-to-br from-white via-rose-50 to-amber-50 p-6 shadow-[0_20px_55px_rgba(126,0,35,.08)] dark:border-rose-950/50 dark:from-[var(--surface)] dark:via-rose-950/20 dark:to-amber-950/10 sm:p-8">
        <div className="absolute -left-12 -top-20 size-48 rounded-full bg-rose-200/35 blur-2xl"/><div className="relative z-10 grid gap-6 lg:grid-cols-[1fr_420px] lg:items-end"><div><span className="inline-flex items-center gap-2 rounded-full bg-[var(--primary)] px-3 py-1.5 text-[10px] font-black text-white"><Sparkles size={13}/>{ar?"أسرع وأوضح للزبون":"Faster, clearer support"}</span><h2 className="mt-4 text-2xl font-black sm:text-3xl">{ar?"اختر الحالة، انسخ الرد، وأرسله":"Choose, copy, and send"}</h2><p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)]">{ar?"ردود موحّدة لكل الحالات باللغات العربية والعبرية والإنجليزية. يمكنك تعديل الكلمات الموجودة بين الأقواس قبل الإرسال.":"Approved replies for common cases in Arabic, Hebrew, and English."}</p></div><label className="relative"><Search className="absolute start-4 top-1/2 -translate-y-1/2 text-[var(--muted)]" size={18}/><input className="input h-12 ps-11" value={query} onChange={(event)=>setQuery(event.target.value)} placeholder={ar?"ابحث باسم الحالة أو كلمة من الرد...":"Search replies..."}/></label></div>
      </section>
      <div className="mb-5 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between"><div className="flex gap-2 overflow-x-auto pb-1"><button onClick={()=>setCategory("all")} className={category==="all"?"btn btn-primary whitespace-nowrap !py-2 text-xs":"btn btn-secondary whitespace-nowrap !py-2 text-xs"}>{ar?"الكل":"All"}</button>{replyCategories.map((item)=><button key={item.id} onClick={()=>setCategory(item.id)} className={category===item.id?"btn btn-primary whitespace-nowrap !py-2 text-xs":"btn btn-secondary whitespace-nowrap !py-2 text-xs"}>{item.emoji} {ar?item.ar:item.en}</button>)}</div><div className="inline-flex w-fit items-center gap-1 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-1"><Languages className="mx-2 text-[var(--muted)]" size={17}/>{(["ar","he","en"] as ReplyLanguage[]).map((value)=><button key={value} onClick={()=>setLanguage(value)} className={language===value?"rounded-xl bg-[var(--primary)] px-4 py-2 text-xs font-black text-white":"rounded-xl px-4 py-2 text-xs font-black text-[var(--muted)] hover:bg-[var(--surface-2)]"}>{languageNames[value]}</button>)}</div></div>
      <div className="mb-4 flex items-center justify-between"><h3 className="font-black">{ar?`${visible.length} رد جاهز`:`${visible.length} ready replies`}</h3><span className="text-[10px] font-bold text-[var(--muted)]">{ar?"اضغط على نسخ الرد لإرساله مباشرة":"Copy a reply to use it"}</span></div>
      {visible.length?<section className="grid items-start gap-4 lg:grid-cols-2">{visible.map((item)=>{const categoryInfo=replyCategories.find((entry)=>entry.id===item.category);return <article key={item.id} className="card overflow-hidden p-5"><div className="flex items-start justify-between gap-3"><div><span className="text-[10px] font-black text-[var(--primary)]">{categoryInfo?.emoji} {ar?categoryInfo?.ar:categoryInfo?.en}</span><h4 className="mt-1.5 font-black">{item.title}</h4></div><button onClick={()=>copy(item)} className={copied===item.id?"btn bg-emerald-600 !px-3 !py-2 text-xs text-white":"btn btn-secondary !px-3 !py-2 text-xs"}>{copied===item.id?<Check size={15}/>:<Copy size={15}/>} {copied===item.id?(ar?"تم النسخ":"Copied"):(ar?"نسخ الرد":"Copy")}</button></div><p dir={language==="he"?"rtl":language==="en"?"ltr":"rtl"} className="mt-4 whitespace-pre-wrap rounded-2xl border border-[var(--line)] bg-[var(--surface-2)] p-4 text-sm leading-8">{replyBody(item)}</p><div className="mt-3 flex items-center gap-2 text-[10px] text-[var(--muted)]"><MessageSquareText size={13}/>{ar?"راجع البيانات بين الأقواس قبل الإرسال":"Review placeholders before sending"}</div></article>})}</section>:<div className="card p-12 text-center"><Search className="mx-auto text-[var(--muted)]"/><h3 className="mt-3 font-black">{ar?"لا توجد ردود مطابقة":"No matching replies"}</h3><button className="mt-3 text-xs font-black text-[var(--primary)]" onClick={()=>{setQuery("");setCategory("all")}}>{ar?"عرض كل الردود":"Show all replies"}</button></div>}
    </div>
  </AppShell>;
}
