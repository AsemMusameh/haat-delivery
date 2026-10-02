"use client";

import { MapPinned, Sparkles } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { CoverageMap } from "@/components/coverage-map";

export default function CoveragePage() {
  return <AppShell title="مناطق التشغيل">
    <div className="mx-auto max-w-[1420px] space-y-5">
      <section className="relative overflow-hidden rounded-[28px] bg-gradient-to-l from-[#83001d] via-[#bd1037] to-[#ee3c5d] p-6 text-white shadow-[0_22px_55px_rgba(130,0,29,.2)] sm:p-8">
        <div className="absolute -left-14 -top-20 size-64 rounded-full border-[45px] border-white/10"/>
        <div className="relative flex flex-wrap items-center justify-between gap-5">
          <div className="flex items-start gap-4"><i className="grid size-14 shrink-0 place-items-center rounded-[20px] bg-white/15 shadow-inner"><MapPinned size={27}/></i><div><span className="inline-flex items-center gap-1.5 rounded-full bg-white/12 px-3 py-1.5 text-[9px] font-black"><Sparkles size={12}/>HAAT OPERATIONS</span><h2 className="mt-3 text-2xl font-black sm:text-3xl">مناطقنا وساعات العمل</h2><p className="mt-2 max-w-2xl text-xs leading-6 text-rose-100">خارطة بصرية لكل مناطق التشغيل، أرقام المناطق، أوقات البداية والنهاية والاستثناءات اليومية في مكان واحد.</p></div></div>
          <div className="rounded-2xl border border-white/20 bg-white/10 px-5 py-3 text-center backdrop-blur"><b className="block text-2xl">40</b><small className="text-[9px] text-rose-100">منطقة مسجلة</small></div>
        </div>
      </section>
      <CoverageMap/>
    </div>
  </AppShell>;
}
