"use client";

import { CheckCheck, GripVertical, Megaphone } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { AnnouncementCard } from "@/components/announcement-card";
import { AppShell, SearchBox } from "@/components/app-shell";
import { EmptyState, PageIntro } from "@/components/ui";
import { useLocale } from "@/components/locale-provider";
import { useAnnouncements } from "@/lib/hooks";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export default function Announcements(){
 const{locale}=useLocale();const ar=locale==="ar";const[q,setQ]=useState("");const[filter,setFilter]=useState("all");const{data,setData}=useAnnouncements();const[order,setOrder]=useState<string[]>([]);const[dragged,setDragged]=useState<string|null>(null);
 useEffect(()=>{const timer=window.setTimeout(()=>{const saved=window.localStorage.getItem("haat-announcement-order");try{setOrder(saved?JSON.parse(saved):data.map(item=>item.id))}catch{setOrder(data.map(item=>item.id))}},0);return()=>window.clearTimeout(timer)},[data]);
 const items=useMemo(()=>data.filter(item=>(filter==="all"||filter==="unread"&&!item.is_read||filter===item.priority)&&(item.title+item.body).toLowerCase().includes(q.toLowerCase())).sort((a,b)=>{const ai=order.indexOf(a.id),bi=order.indexOf(b.id);return(ai<0?999:ai)-(bi<0?999:bi)}),[q,filter,data,order]);
 const move=(target:string)=>{if(!dragged||dragged===target)return;const next=[...order];const from=next.indexOf(dragged),to=next.indexOf(target);if(from<0||to<0)return;next.splice(from,1);next.splice(to,0,dragged);setOrder(next);window.localStorage.setItem("haat-announcement-order",JSON.stringify(next));setDragged(null)};
 const markAll=async()=>{const unread=data.filter(item=>!item.is_read);if(isSupabaseConfigured){const s=createClient()!;const{data:{user}}=await s.auth.getUser();if(user&&unread.length){const{error}=await s.from("announcement_reads").upsert(unread.map(item=>({announcement_id:item.id,user_id:user.id,read_at:new Date().toISOString(),acknowledged:true})));if(error)return toast.error(error.message)}}setData(data.map(item=>({...item,is_read:true,read_at:item.read_at||new Date().toISOString()})));toast.success(ar?"تم تحديد جميع التعميمات كمقروءة":"All announcements marked as read")};
 return <AppShell title={ar?"التعميمات":"Announcements"} action={<button onClick={markAll} className="btn btn-secondary hidden text-xs sm:flex"><CheckCheck size={16}/>{ar?"تحديد الكل كمقروء":"Mark all read"}</button>}>
  <div className="mx-auto max-w-[1480px] space-y-5"><PageIntro eyebrow={ar?"مركز التعميمات":"ANNOUNCEMENT CENTER"} title={ar?"كل تعميم في بطاقة واضحة":"Every update in one clear tile"} description={ar?"اسحب البطاقات لترتيبها، واضغط على أي بطاقة لعرض التعميم كاملًا.":"Drag tiles to reorder them, then open any tile for full details."} icon={Megaphone}/>
  <div className="grid gap-3 sm:grid-cols-[1fr_auto]"><SearchBox value={q} onChange={setQ}/><select className="input sm:w-48" value={filter} onChange={e=>setFilter(e.target.value)}><option value="all">{ar?"جميع التعميمات":"All announcements"}</option><option value="unread">{ar?"غير المقروءة":"Unread"}</option><option value="urgent">{ar?"عاجلة":"Urgent"}</option><option value="important">{ar?"مهمة":"Important"}</option><option value="normal">{ar?"عادية":"Normal"}</option></select></div>
  <div className="flex items-center gap-2 text-[10px] text-[var(--muted)]"><GripVertical size={14}/>{ar?"يمكنك سحب المربعات وحفظ ترتيبك على هذا الجهاز.":"Drag tiles to save your preferred order on this device."}</div>
  {items.length?<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">{items.map(item=><AnnouncementCard key={item.id} item={item} draggable onDragStart={()=>setDragged(item.id)} onDrop={()=>move(item.id)}/>)}</div>:<EmptyState icon={Megaphone} title={ar?"لا توجد تعميمات":"No announcements"} body={ar?"لم نعثر على نتائج مطابقة لبحثك.":"No results match your search."}/>} 
  </div>
 </AppShell>
}
