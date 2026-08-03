"use client";

import { AppShell } from "@/components/app-shell";
import { useLocale } from "@/components/locale-provider";

export default function SchedulePage(){
 const{locale}=useLocale();
 return <AppShell title={locale==="ar"?"جدول الموظف":"Employee Schedule"}><section className="min-h-[calc(100vh-168px)] w-full rounded-3xl border border-[#f3e8eb] bg-white" aria-label={locale==="ar"?"مساحة جدول الموظف":"Employee schedule workspace"}/></AppShell>;
}
