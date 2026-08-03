"use client";

import { CheckCheck, Megaphone } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { AnnouncementCard } from "@/components/announcement-card";
import { AppShell, SearchBox } from "@/components/app-shell";
import { EmptyState } from "@/components/ui";
import { useLocale } from "@/components/locale-provider";
import { useAnnouncements } from "@/lib/hooks";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export default function Announcements(){
 const{locale}=useLocale();const ar=locale==="ar";const[q,setQ]=useState("");const[filter,setFilter]=useState("all");const{data,setData}=useAnnouncements();
 const items=useMemo(()=>data.filter(item=>(filter==="all"||filter==="unread"&&!item.is_read||filter===item.priority)&&(item.title+item.body).toLowerCase().includes(q.toLowerCase())),[q,filter,data]);
 const markAll=async()=>{const unread=data.filter(item=>!item.is_read);if(isSupabaseConfigured){const s=createClient()!;const{data:{user}}=await s.auth.getUser();if(user&&unread.length){const{error}=await s.from("announcement_reads").upsert(unread.map(item=>({announcement_id:item.id,user_id:user.id,read_at:new Date().toISOString(),acknowledged:true})));if(error)return toast.error(error.message)}}setData(data.map(item=>({...item,is_read:true,read_at:item.read_at||new Date().toISOString()})));toast.success(ar?"تم تحديد جميع التعميمات كمقروءة":"All announcements marked as read")};
 return <AppShell title={ar?"التعميمات":"Announcements"} action={<button onClick={markAll} className="btn btn-secondary hidden text-xs sm:flex"><CheckCheck size={16}/>{ar?"تحديد الكل كمقروء":"Mark all read"}</button>}>
  <div className="mb-5 grid gap-3 sm:grid-cols-[1fr_auto]"><SearchBox value={q} onChange={setQ}/><select className="input sm:w-48" value={filter} onChange={e=>setFilter(e.target.value)}><option value="all">{ar?"جميع التعميمات":"All announcements"}</option><option value="unread">{ar?"غير المقروءة":"Unread"}</option><option value="urgent">{ar?"عاجلة":"Urgent"}</option><option value="important">{ar?"مهمة":"Important"}</option><option value="normal">{ar?"عادية":"Normal"}</option></select></div>
  <div className="mb-5 flex gap-2 overflow-auto pb-1">{[["all",ar?"الكل":"All"],["unread",ar?"غير المقروءة":"Unread"],["urgent",ar?"العاجلة":"Urgent"],["important",ar?"المهمة":"Important"]].map(([value,label])=><button key={value} onClick={()=>setFilter(value)} className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold ${filter===value?"bg-[var(--primary)] text-white":"border border-[var(--line)] bg-[var(--surface)]"}`}>{label}</button>)}</div>
  {items.length?<div className="grid gap-4 xl:grid-cols-2">{items.map(item=><AnnouncementCard key={item.id} item={item}/>)}</div>:<EmptyState icon={Megaphone} title={ar?"لا توجد تعميمات":"No announcements"} body={ar?"لم نعثر على نتائج مطابقة لبحثك.":"No results match your search."}/>} 
 </AppShell>
}
