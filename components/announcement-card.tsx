"use client";
import Link from "next/link";
import { Clock3, FileText, Megaphone, Pin, UserRound } from "lucide-react";
import type { Announcement } from "@/lib/types";
import { cn, priorityLabel, relativeTime } from "@/lib/utils";

export function AnnouncementCard({item, compact=false, draggable=false, onDragStart, onDrop}:{item:Announcement;compact?:boolean;draggable?:boolean;onDragStart?:()=>void;onDrop?:()=>void}) {
  const tones = { urgent:"from-red-600 to-rose-500", important:"from-amber-500 to-orange-500", normal:"from-slate-700 to-slate-500" };
  return <Link href={`/announcements/${item.id}`} draggable={draggable} onDragStart={onDragStart} onDragOver={(event)=>draggable&&event.preventDefault()} onDrop={(event)=>{if(draggable){event.preventDefault();onDrop?.();}}} className={cn("card group relative min-h-56 overflow-hidden p-0 transition hover:-translate-y-1 hover:shadow-xl",draggable&&"cursor-grab active:cursor-grabbing",!item.is_read&&"ring-2 ring-[color-mix(in_srgb,var(--primary)_25%,transparent)]")}>
    <div className={cn("flex h-24 items-center justify-between bg-gradient-to-br px-5 text-white",tones[item.priority])}><span className="grid size-12 place-items-center rounded-2xl bg-white/15"><Megaphone size={25}/></span>{item.is_pinned&&<Pin size={16}/>}</div>
    <div className="p-5"><div className="mb-2 flex items-center justify-between gap-2"><span className="text-[9px] font-black uppercase text-[var(--primary)]">{priorityLabel[item.priority]}</span>{!item.is_read&&<span className="rounded-full bg-[var(--primary-soft)] px-2 py-1 text-[9px] font-black text-[var(--primary)]">جديد</span>}</div><h3 className="line-clamp-2 min-h-12 text-sm font-black leading-6">{item.title}</h3>{!compact&&<div className="mt-4 space-y-2 text-[10px] text-[var(--muted)]"><span className="flex items-center gap-2"><UserRound size={13}/>{item.author?.full_name||"إدارة HAAT"}</span><span className="flex items-center gap-2"><Clock3 size={13}/>{relativeTime(item.published_at)}</span></div>}<span className="mt-4 flex items-center justify-between border-t border-[var(--line)] pt-3 text-[10px] font-black text-[var(--primary)]"><span className="flex items-center gap-1"><FileText size={14}/>فتح التعميم</span><span>←</span></span></div>
  </Link>;
}
