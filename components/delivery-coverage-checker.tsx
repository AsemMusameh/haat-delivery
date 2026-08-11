"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, CircleAlert, MapPin, Navigation, Search, ShieldCheck, XCircle } from "lucide-react";

type Place = {
  name: string;
  english: string;
  aliases?: string[];
  x: number;
  y: number;
  covered: boolean;
  note: string;
};

const places: Place[] = [
  { name: "طولكرم", english: "Tulkarm", x: 13, y: 19, covered: true, note: "داخل نطاق التشغيل الظاهر في الخريطة" },
  { name: "مخيم نور شمس", english: "Nur Shams", aliases: ["نور شمس"], x: 27, y: 19, covered: true, note: "داخل نطاق التشغيل" },
  { name: "بلعا", english: "Bal'a", aliases: ["بلعة"], x: 58, y: 11, covered: true, note: "داخل نطاق التشغيل" },
  { name: "عنبتا", english: "Anabta", x: 62, y: 26, covered: true, note: "داخل نطاق التشغيل" },
  { name: "بزاريا", english: "Bazariya", x: 86, y: 26, covered: true, note: "داخل نطاق التشغيل" },
  { name: "كفر اللبد", english: "Kafr alLabed", aliases: ["كفر لبد"], x: 58, y: 32, covered: true, note: "داخل نطاق التشغيل" },
  { name: "شوفة", english: "Shufa", x: 42, y: 44, covered: true, note: "داخل نطاق التشغيل" },
  { name: "سفارين", english: "Safarin", x: 57, y: 53, covered: true, note: "داخل نطاق التشغيل" },
  { name: "بيت ليد", english: "Bayt Lid", x: 68, y: 53, covered: true, note: "داخل نطاق التشغيل" },
  { name: "كفر جمال", english: "Kafr Jamal", x: 25, y: 75, covered: true, note: "داخل نطاق التشغيل الجنوبي" },
  { name: "كفر عبوش", english: "Kafr Abush", x: 42, y: 76, covered: true, note: "داخل نطاق التشغيل الجنوبي" },
  { name: "عيناف", english: "Inei Hefetz", aliases: ["عيني حيفتس"], x: 40, y: 40, covered: false, note: "منطقة مستثناة داخل الحدود حسب الصورة" },
  { name: "كفر قدوم", english: "Kafr Qaddum", x: 77, y: 77, covered: false, note: "خارج النطاق الأخضر" },
  { name: "عتارا", english: "Atara", x: 86, y: 14, covered: false, note: "خارج النطاق الأخضر" },
  { name: "سلفيت", english: "Salit", aliases: ["سليت"], x: 28, y: 65, covered: false, note: "خارج النطاق الأخضر الظاهر" },
  { name: "الطيبة", english: "Tayibe", x: 6, y: 51, covered: false, note: "خارج النطاق الأخضر" },
];

const normalise = (value: string) => value.trim().toLowerCase().replace(/[إأآ]/g, "ا").replace(/ة/g, "ه");

export function DeliveryCoverageChecker() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Place | null>(null);
  const matches = useMemo(() => {
    const value = normalise(query);
    if (!value) return [];
    return places.filter((place) => normalise([place.name, place.english, ...(place.aliases ?? [])].join(" ")).includes(value)).slice(0, 6);
  }, [query]);

  const choose = (place: Place) => {
    setSelected(place);
    setQuery(place.name);
  };

  return (
    <section className="card overflow-hidden border-[color-mix(in_srgb,var(--primary)_18%,var(--line))]">
      <header className="bg-gradient-to-l from-[#7a001b] via-[#b41035] to-[#e8395a] p-5 text-white sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <i className="grid size-11 shrink-0 place-items-center rounded-2xl bg-white/15"><Navigation size={22}/></i>
            <div><span className="text-[9px] font-black text-rose-100">نسخة تجريبية • منطقة طولكرم</span><h2 className="mt-1 text-lg font-black">هل يوجد توصيل لهذا الموقع؟</h2><p className="mt-1 text-[10px] text-rose-100">ابحث باسم البلدة وسيظهر نطاق التوصيل مباشرة على الخريطة.</p></div>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-2 text-[9px] font-bold"><ShieldCheck size={14}/>مخصص لموظفي HAAT</span>
        </div>
        <div className="relative mt-5">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={19}/>
          <input value={query} onChange={(event) => { setQuery(event.target.value); setSelected(null); }} onKeyDown={(event) => { if (event.key === "Enter" && matches[0]) choose(matches[0]); }} className="h-14 w-full rounded-2xl border-0 bg-white pr-12 pl-4 text-sm font-bold text-slate-900 shadow-xl outline-none ring-0 placeholder:font-normal placeholder:text-slate-400" placeholder="اكتب مثلاً: عنبتا، شوفة، كفر قدوم..." aria-label="ابحث عن موقع التوصيل"/>
          {query && !selected && <div className="absolute inset-x-0 top-[60px] z-30 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 text-slate-900 shadow-2xl">
            {matches.length ? matches.map((place) => <button type="button" key={place.name} onClick={() => choose(place)} className="flex w-full items-center gap-3 rounded-xl p-3 text-start hover:bg-rose-50"><MapPin size={17} className="text-[var(--primary)]"/><span className="flex-1"><b className="block text-xs">{place.name}</b><small dir="ltr" className="mt-0.5 block text-start text-[9px] text-slate-500">{place.english}</small></span><span className={`rounded-full px-2 py-1 text-[8px] font-bold ${place.covered ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>{place.covered ? "يوجد توصيل" : "لا يوجد"}</span></button>) : <div className="p-4 text-center text-xs text-slate-500"><CircleAlert className="mx-auto mb-2" size={20}/>الموقع غير موجود في النسخة التجريبية</div>}
          </div>}
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-[9px]"><span className="text-rose-100">جرّب سريعًا:</span>{["عنبتا", "شوفة", "كفر قدوم"].map((name) => { const place = places.find((item) => item.name === name)!; return <button type="button" key={name} onClick={() => choose(place)} className="rounded-full bg-white/15 px-3 py-1.5 font-bold hover:bg-white/25">{name}</button>; })}</div>
      </header>

      <div className="grid lg:grid-cols-[1.05fr_.95fr]">
        <div className="relative aspect-square min-h-[360px] overflow-hidden bg-slate-100">
          <img src="/tulkarm-coverage-demo.png" alt="خريطة نطاق التوصيل التجريبية لمنطقة طولكرم" className="absolute inset-0 h-full w-full object-contain"/>
          {selected && <button type="button" className="absolute z-10 -translate-x-1/2 -translate-y-full" style={{ left: `${selected.x}%`, top: `${selected.y}%` }} aria-label={`الموقع المحدد: ${selected.name}`}>
            <span className={`grid size-10 place-items-center rounded-full border-4 border-white text-white shadow-xl ${selected.covered ? "bg-emerald-600" : "bg-red-600"}`}><MapPin size={19}/></span>
            <span className={`absolute left-1/2 top-[34px] h-4 w-4 -translate-x-1/2 rotate-45 border-b-4 border-r-4 border-white ${selected.covered ? "bg-emerald-600" : "bg-red-600"}`}/>
          </button>}
          <div className="absolute bottom-3 right-3 flex gap-2 rounded-xl bg-white/90 p-2 text-[8px] font-bold shadow-lg backdrop-blur"><span className="flex items-center gap-1 text-emerald-700"><i className="size-2 rounded-full bg-emerald-600"/>داخل التوصيل</span><span className="flex items-center gap-1 text-red-700"><i className="size-2 rounded-full bg-red-600"/>خارج التوصيل</span></div>
        </div>
        <aside className="flex min-h-[420px] flex-col justify-center p-6 sm:p-8">
          {!selected ? <div className="text-center"><i className="mx-auto grid size-16 place-items-center rounded-[22px] bg-[var(--primary-soft)] text-[var(--primary)]"><Search size={27}/></i><h3 className="mt-5 text-lg font-black">ابحث عن البلدة أولاً</h3><p className="mx-auto mt-2 max-w-sm text-xs leading-6 text-[var(--muted)]">سنحددها على الخريطة ونخبرك فورًا إن كانت ضمن منطقة التوصيل.</p></div> : <div>
            <div className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-[10px] font-black ${selected.covered ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>{selected.covered ? <CheckCircle2 size={16}/> : <XCircle size={16}/>}نتيجة البحث</div>
            <h3 className="mt-5 text-2xl font-black">{selected.name}</h3><p dir="ltr" className="mt-1 text-start text-xs text-[var(--muted)]">{selected.english}</p>
            <div className={`mt-6 rounded-[24px] border p-5 ${selected.covered ? "border-emerald-200 bg-emerald-50" : "border-red-200 bg-red-50"}`}><strong className={`flex items-center gap-2 text-xl ${selected.covered ? "text-emerald-800" : "text-red-800"}`}>{selected.covered ? <CheckCircle2/> : <XCircle/>}{selected.covered ? "نعم، يوجد توصيل" : "لا يوجد توصيل حاليًا"}</strong><p className={`mt-2 text-xs leading-6 ${selected.covered ? "text-emerald-700" : "text-red-700"}`}>{selected.note}</p></div>
            <div className="mt-4 flex items-start gap-2 rounded-2xl bg-[var(--surface-2)] p-4 text-[9px] leading-5 text-[var(--muted)]"><CircleAlert size={16} className="mt-0.5 shrink-0"/>هذه نتيجة تجريبية مستخرجة من الصورة المرفوعة. المواقع الواقعة على حدود اللون الأخضر تحتاج مراجعة نهائية قبل اعتمادها.</div>
          </div>}
        </aside>
      </div>
    </section>
  );
}
