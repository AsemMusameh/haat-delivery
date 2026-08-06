"use client";

import { MessageCircleMore, Search, Send } from "lucide-react";
import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { useLocale } from "@/components/locale-provider";
import { demoEmployees } from "@/lib/demo-data";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

type ChatMessage={id:string;mine:boolean;body:string;time:string};
const seed:ChatMessage[]=[{id:"m1",mine:false,body:"مرحباً محمد، هل اطلعت على تحديث سياسة خدمة الزبائن؟",time:"10:24"},{id:"m2",mine:true,body:"نعم، قرأته وتم تأكيد الاطلاع. شكراً للتذكير.",time:"10:27"}];

export default function Messages(){
 const{locale}=useLocale();const ar=locale==="ar";const[active,setActive]=useState(demoEmployees[1]);const[messages,setMessages]=useState(seed);const[text,setText]=useState("");const[query,setQuery]=useState("");
 const send=async()=>{const body=text.trim();if(!body)return;setMessages([...messages,{id:`local-${Date.now()}-${Math.random().toString(36).slice(2)}`,mine:true,body,time:new Date().toLocaleTimeString(locale,{hour:"2-digit",minute:"2-digit"})}]);setText("");if(isSupabaseConfigured){const s=createClient()!;const{data:{user}}=await s.auth.getUser();if(user)await s.from("direct_messages").insert({sender_id:user.id,recipient_id:active.id,body})}};
 const employees=demoEmployees.filter(e=>e.full_name.includes(query)||e.email.includes(query));
 return <AppShell title={ar?"الرسائل":"Messages"}><div className="card grid min-h-[680px] overflow-hidden lg:grid-cols-[330px_1fr]">
  <aside className="border-b border-[var(--line)] lg:border-b-0 lg:border-e"><div className="p-4"><label className="relative block"><Search className="absolute start-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" size={17}/><input className="input ps-10" value={query} onChange={e=>setQuery(e.target.value)} placeholder={ar?"ابحث عن موظف...":"Search employees..."}/></label></div><div className="max-h-[610px] overflow-y-auto">{employees.map(e=><button key={e.id} onClick={()=>setActive(e)} className={`flex w-full items-center gap-3 border-t border-[var(--line)] p-4 text-start ${active.id===e.id?"bg-[var(--primary-soft)]":"hover:bg-[var(--surface-2)]"}`}><span className="grid size-11 shrink-0 place-items-center rounded-full bg-[var(--primary)] font-black text-white">{e.full_name[0]}</span><div className="min-w-0"><b className="block truncate text-sm">{e.full_name}</b><span className="block truncate text-[11px] text-[var(--muted)]">{e.role} · {e.department?.name}</span></div></button>)}</div></aside>
  <section className="flex min-h-[580px] flex-col"><header className="flex items-center gap-3 border-b border-[var(--line)] p-4"><span className="grid size-11 place-items-center rounded-full bg-[var(--primary-soft)] font-black text-[var(--primary)]">{active.full_name[0]}</span><div><b className="block text-sm">{active.full_name}</b><span className="text-[11px] text-emerald-600">● {ar?"متصل الآن":"Online"}</span></div></header><div className="flex-1 space-y-3 overflow-y-auto bg-[var(--surface-2)]/40 p-5">{messages.map(m=><div key={m.id} className={`flex ${m.mine?"justify-end":"justify-start"}`}><div className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-7 ${m.mine?"bg-[var(--primary)] text-white":"border border-[var(--line)] bg-white"}`}><p>{m.body}</p><span className={`mt-1 block text-[9px] ${m.mine?"text-rose-100":"text-[var(--muted)]"}`}>{m.time}</span></div></div>)}</div><footer className="flex gap-2 border-t border-[var(--line)] p-4"><input className="input" value={text} onChange={e=>setText(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder={ar?"اكتب رسالة...":"Write a message..."}/><button onClick={send} className="btn btn-primary"><Send size={18}/><span className="hidden sm:inline">{ar?"إرسال":"Send"}</span></button></footer></section>
 </div><p className="mt-3 text-xs text-[var(--muted)]">{!isSupabaseConfigured&&(ar?"وضع تجريبي: يتم عرض المحادثة داخل هذه الجلسة فقط.":"Demo mode: messages stay in this session only.")}</p></AppShell>
}
