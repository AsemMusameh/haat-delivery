"use client";

import { CheckCheck, CheckCircle2, Megaphone, Paperclip, Pin, TriangleAlert } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { AnnouncementCard } from "@/components/announcement-card";
import { AppShell, SearchBox } from "@/components/app-shell";
import { EmptyState, PageIntro } from "@/components/ui";
import { useLocale } from "@/components/locale-provider";
import { useAnnouncements } from "@/lib/hooks";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { formatDate } from "@/lib/utils";

export default function Announcements(){
 const{locale}=useLocale();const ar=locale==="ar";const[q,setQ]=useState("");const[filter,setFilter]=useState("all");const{data,setData}=useAnnouncements();
 const items=useMemo(()=>data.filter(item=>(filter==="all"||filter==="unread"&&!item.is_read||filter===item.priority)&&(item.title+item.body).toLowerCase().includes(q.toLowerCase())),[q,filter,data]);
 const featured=data[0];const recent=data.slice(1,4);
 const markAll=async()=>{const unread=data.filter(item=>!item.is_read);if(isSupabaseConfigured){const s=createClient()!;const{data:{user}}=await s.auth.getUser();if(user&&unread.length){const{error}=await s.from("announcement_reads").upsert(unread.map(item=>({announcement_id:item.id,user_id:user.id,read_at:new Date().toISOString(),acknowledged:true})));if(error)return toast.error(error.message)}}setData(data.map(item=>({...item,is_read:true,read_at:item.read_at||new Date().toISOString()})));toast.success(ar?"تم تحديد جميع التعميمات كمقروءة":"All announcements marked as read")};
 return <AppShell title={ar?"التعميمات":"Announcements"} action={<button onClick={markAll} className="btn btn-secondary hidden text-xs sm:flex"><CheckCheck size={16}/>{ar?"تحديد الكل كمقروء":"Mark all read"}</button>}>
  {featured&&<section className="mb-8 space-y-4">
   <PageIntro eyebrow={ar?"مركز التحديثات":"UPDATES CENTER"} title={ar?"ما تحتاج معرفته، بدون تشتيت":"Everything important, without the noise"} description={ar?"العاجل والمهم أولاً، ثم أرشيف كامل قابل للبحث والتصفية.":"Urgent updates first, followed by a searchable, filtered archive."} icon={Megaphone}/>
   <article className="urgent-card card p-6 sm:p-7"><div className="flex flex-col gap-5 lg:flex-row lg:items-center"><div className="min-w-0 flex-1"><div className="mb-3 flex flex-wrap items-center gap-2"><span className="badge urgent"><TriangleAlert size={13}/>{featured.priority==="urgent"?(ar?"عاجل":"Urgent"):featured.priority==="important"?(ar?"مهم":"Important"):(ar?"جديد":"New")}</span>{featured.is_pinned&&<span className="badge"><Pin size={13}/>{ar?"مثبّت":"Pinned"}</span>}</div><h3 className="text-xl font-black sm:text-2xl">{featured.title}</h3><p className="mt-3 max-w-3xl line-clamp-2 leading-8 text-[var(--muted)]">{featured.body}</p><div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-[var(--muted)]"><span>{featured.author?.full_name||"إدارة HAAT"}</span><span>{formatDate(featured.published_at)}</span>{featured.attachments?.length?<span className="flex items-center gap-1"><Paperclip size={14}/>{featured.attachments.length} {ar?"مرفق":"attachments"}</span>:null}</div></div><Link href={`/announcements/${featured.id}`} className="btn btn-primary min-w-44 self-start lg:self-center">{ar?"قراءة التعميم":"Read announcement"}<span>←</span></Link></div></article>
   {recent.length>0&&<div className="space-y-3">{recent.map(item=><Link href={`/announcements/${item.id}`} key={item.id} className="announcement-row card"><i className="row-icon">{item.priority==="urgent"||item.priority==="important"?<TriangleAlert size={21}/>:<CheckCircle2 size={21}/>}</i><div className="min-w-0 flex-1"><h3 className="truncate font-extrabold">{item.title}</h3><p className="mt-1 truncate text-xs text-[var(--muted)]">{item.body}</p></div><span className={`badge ${item.is_read?"read":"unread"}`}>{item.is_read?(ar?"مقروءة":"Read"):(ar?"غير مقروءة":"Unread")}</span></Link>)}</div>}
  </section>}
  <div className="mb-4 flex items-center justify-between"><div><span className="text-[10px] font-black text-[var(--primary)]">{ar?"الأرشيف الكامل":"Full archive"}</span><h2 className="mt-1 text-xl font-black">{ar?"جميع التعميمات":"All announcements"}</h2></div></div>
  <div className="mb-5 grid gap-3 sm:grid-cols-[1fr_auto]"><SearchBox value={q} onChange={setQ}/><select className="input sm:w-48" value={filter} onChange={e=>setFilter(e.target.value)}><option value="all">{ar?"جميع التعميمات":"All announcements"}</option><option value="unread">{ar?"غير المقروءة":"Unread"}</option><option value="urgent">{ar?"عاجلة":"Urgent"}</option><option value="important">{ar?"مهمة":"Important"}</option><option value="normal">{ar?"عادية":"Normal"}</option></select></div>
  <div className="mb-5 flex gap-2 overflow-auto pb-1">{[["all",ar?"الكل":"All"],["unread",ar?"غير المقروءة":"Unread"],["urgent",ar?"العاجلة":"Urgent"],["important",ar?"المهمة":"Important"]].map(([value,label])=><button key={value} onClick={()=>setFilter(value)} className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold ${filter===value?"bg-[var(--primary)] text-white":"border border-[var(--line)] bg-[var(--surface)]"}`}>{label}</button>)}</div>
  {items.length?<div className="grid gap-4 xl:grid-cols-2">{items.map(item=><AnnouncementCard key={item.id} item={item}/>)}</div>:<EmptyState icon={Megaphone} title={ar?"لا توجد تعميمات":"No announcements"} body={ar?"لم نعثر على نتائج مطابقة لبحثك.":"No results match your search."}/>} 
 </AppShell>
}
