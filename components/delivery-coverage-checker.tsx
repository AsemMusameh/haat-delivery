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
  { name: "طولكرم", english: "Tulkarm", x: 12, y: 18, covered: true, note: "داخل نطاق التشغيل الظاهر في الخريطة" },
  { name: "شويكة", english: "Shuweika", aliases: ["شويكه"], x: 19, y: 6, covered: true, note: "داخل نطاق التشغيل الشمالي" },
  { name: "المسقوفة", english: "Al Masqufa", aliases: ["المسقوفه", "مسقوفة"], x: 33, y: 5, covered: true, note: "داخل نطاق التشغيل الشمالي" },
  { name: "اكتابا", english: "Iktaba", aliases: ["إكتابا", "اكتابة"], x: 30, y: 13, covered: true, note: "داخل نطاق التشغيل" },
  { name: "المنطار", english: "Al Montar", aliases: ["المنتار"], x: 29, y: 16, covered: true, note: "داخل نطاق التشغيل" },
  { name: "مخيم نور شمس", english: "Nur Shams", aliases: ["نور شمس"], x: 33, y: 19, covered: true, note: "داخل نطاق التشغيل" },
  { name: "ذنابة", english: "Danaba", aliases: ["ذنابه"], x: 23, y: 23, covered: true, note: "داخل نطاق التشغيل" },
  { name: "ارتاح", english: "Irtah", aliases: ["إرتاح", "ارتح"], x: 8, y: 35, covered: true, note: "داخل نطاق التشغيل" },
  { name: "فرعون", english: "Far'un", aliases: ["فارون"], x: 11, y: 45, covered: true, note: "داخل نطاق التشغيل" },
  { name: "بلعا", english: "Bal'a", aliases: ["بلعة"], x: 62, y: 8, covered: true, note: "داخل نطاق التشغيل" },
  { name: "كفر رمان", english: "Kafr Rumman", aliases: ["كفر رمانة"], x: 71, y: 20, covered: true, note: "داخل نطاق التشغيل" },
  { name: "عنبتا", english: "Anabta", x: 67, y: 28, covered: true, note: "داخل نطاق التشغيل" },
  { name: "بزاريا", english: "Bazariya", x: 93, y: 28, covered: true, note: "داخل نطاق التشغيل" },
  { name: "كفر اللبد", english: "Kafr alLabed", aliases: ["كفر لبد"], x: 62, y: 36, covered: true, note: "داخل نطاق التشغيل" },
  { name: "رامين", english: "Ramin", x: 84, y: 45, covered: true, note: "داخل نطاق التشغيل الشرقي" },
  { name: "شوفة", english: "Shufa", x: 45, y: 52, covered: true, note: "داخل نطاق التشغيل" },
  { name: "خربة جبارة", english: "Khirbet Jubara", aliases: ["خربه جباره", "جبارة"], x: 23, y: 58, covered: true, note: "داخل نطاق التشغيل" },
  { name: "سفارين", english: "Safarin", x: 62, y: 63, covered: true, note: "داخل نطاق التشغيل" },
  { name: "بيت ليد", english: "Bayt Lid", x: 74, y: 63, covered: true, note: "داخل نطاق التشغيل" },
  { name: "الرأس", english: "Al-Ra's", aliases: ["الراس"], x: 35, y: 71, covered: true, note: "داخل نطاق التشغيل الجنوبي" },
  { name: "كفر صور", english: "Kafr Sur", x: 36, y: 77, covered: true, note: "داخل نطاق التشغيل الجنوبي" },
  { name: "كور", english: "Kur", aliases: ["كُور"], x: 55, y: 84, covered: true, note: "داخل نطاق التشغيل الجنوبي" },
  { name: "فلامية", english: "Falame", aliases: ["فلاميه"], x: 11, y: 92, covered: true, note: "داخل نطاق التشغيل الجنوبي" },
  { name: "كفر جمال", english: "Kafr Jamal", x: 26, y: 91, covered: true, note: "داخل نطاق التشغيل الجنوبي" },
  { name: "كفر زيباد", english: "Kafr Zibad", x: 40, y: 91, covered: true, note: "داخل نطاق التشغيل الجنوبي" },
  { name: "كفر عبوش", english: "Kafr Abush", x: 47, y: 93, covered: true, note: "داخل نطاق التشغيل الجنوبي" },
  { name: "خربة سير", english: "Khirbat Sir", aliases: ["خربه سير"], x: 55, y: 96, covered: true, note: "داخل النطاق الأخضر في الصورة الإضافية" },
  { name: "عيناف", english: "Einav", aliases: ["عناف"], x: 71, y: 46, covered: false, note: "منطقة مستثناة داخل الحدود حسب الصورة" },
  { name: "أفني حيفتس", english: "Avnei Hefetz", aliases: ["عيني حيفتس", "افني حيفتس"], x: 41, y: 45, covered: false, note: "منطقة مستثناة داخل الحدود حسب الصورة" },
  { name: "كفر قدوم", english: "Kafr Qaddum", x: 81, y: 94, covered: false, note: "خارج النطاق الأخضر" },
  { name: "عتارا", english: "Atara", x: 92, y: 13, covered: false, note: "خارج النطاق الأخضر" },
  { name: "سليت", english: "Sal'it", aliases: ["سلفيت", "سليت"], x: 28, y: 78, covered: false, note: "خارج النطاق الأخضر الظاهر" },
  { name: "الطيبة", english: "Tayibe", x: 4, y: 59, covered: false, note: "خارج النطاق الأخضر" },
  { name: "فرديسيا", english: "Fardisiya", aliases: ["الفرديسية"], x: 8, y: 53, covered: false, note: "خارج النطاق الأخضر" },
  { name: "بات حيفر", english: "Bat Hefer", aliases: ["بات هيفر"], x: 6, y: 7, covered: false, note: "خارج النطاق الأخضر" },
  { name: "تسور نتان", english: "Tsur Natan", x: 6, y: 80, covered: false, note: "خارج النطاق الأخضر" },
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
            <div><span className="text-[9px] font-black text-rose-100">نسخة تجريبية • منطقة طولكرم • {places.length} موقعًا</span><h2 className="mt-1 text-lg font-black">هل يوجد توصيل لهذا الموقع؟</h2><p className="mt-1 text-[10px] text-rose-100">ابحث باسم البلدة أو القرية وسيظهر نطاق التوصيل مباشرة على الخريطة.</p></div>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-2 text-[9px] font-bold"><ShieldCheck size={14}/>مخصص لموظفي HAAT</span>
        </div>
        <div className="relative mt-5">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={19}/>
          <input value={query} onChange={(event) => { setQuery(event.target.value); setSelected(null); }} onKeyDown={(event) => { if (event.key === "Enter" && matches[0]) choose(matches[0]); }} className="h-14 w-full rounded-2xl border-0 bg-white pr-12 pl-4 text-sm font-bold text-slate-900 shadow-xl outline-none ring-0 placeholder:font-normal placeholder:text-slate-400" placeholder="اكتب مثلاً: شويكة، ذنابة، رامين، كفر قدوم..." aria-label="ابحث عن موقع التوصيل"/>
          {query && !selected && <div className="absolute inset-x-0 top-[60px] z-30 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 text-slate-900 shadow-2xl">
            {matches.length ? matches.map((place) => <button type="button" key={place.name} onClick={() => choose(place)} className="flex w-full items-center gap-3 rounded-xl p-3 text-start hover:bg-rose-50"><MapPin size={17} className="text-[var(--primary)]"/><span className="flex-1"><b className="block text-xs">{place.name}</b><small dir="ltr" className="mt-0.5 block text-start text-[9px] text-slate-500">{place.english}</small></span><span className={`rounded-full px-2 py-1 text-[8px] font-bold ${place.covered ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>{place.covered ? "يوجد توصيل" : "لا يوجد"}</span></button>) : <div className="p-4 text-center text-xs text-slate-500"><CircleAlert className="mx-auto mb-2" size={20}/>الموقع غير موجود في النسخة التجريبية</div>}
          </div>}
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-[9px]"><span className="text-rose-100">جرّب سريعًا:</span>{["شويكة", "ذنابة", "رامين", "أفني حيفتس"].map((name) => { const place = places.find((item) => item.name === name)!; return <button type="button" key={name} onClick={() => choose(place)} className="rounded-full bg-white/15 px-3 py-1.5 font-bold hover:bg-white/25">{name}</button>; })}</div>
      </header>

      <div className="grid lg:grid-cols-[1.05fr_.95fr]">
        <div className="relative aspect-[1013/882] min-h-[360px] overflow-hidden bg-slate-100">
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
