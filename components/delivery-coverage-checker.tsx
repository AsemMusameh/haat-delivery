"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Map as LeafletMap, Marker as LeafletMarker } from "leaflet";
import { CheckCircle2, CircleAlert, Layers3, LocateFixed, MapPin, MousePointer2, Navigation, Search, ShieldCheck, XCircle } from "lucide-react";

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

const geoBounds = { north: 32.35, south: 32.21, west: 35.0, east: 35.18 };
type MapPoint = [number, number];
const coverageShapes: MapPoint[][] = [
  [[7,2],[20,0],[36,0],[47,2],[65,0],[70,0],[71,12],[78,21],[92,22],[98,29],[94,42],[85,51],[78,48],[74,36],[62,37],[53,42],[43,40],[37,42],[30,36],[29,31],[32,29],[35,36],[43,42],[37,49],[21,45],[10,46],[6,44],[7,35],[5,38],[6,25]],
  [[21,45],[37,49],[52,49],[64,51],[80,57],[75,71],[63,75],[51,66],[44,78],[33,80],[19,62]],
  [[7,86],[20,82],[33,79],[44,78],[56,80],[61,87],[55,100],[6,100]],
];
const excludedShapes: MapPoint[][] = [
  [[32,29],[35,36],[38,40],[44,42],[53,38],[62,37],[74,36],[78,48],[74,50],[61,49],[44,49],[37,48],[34,43],[30,36]],
];
const toLatLng = ([x,y]: MapPoint): [number,number] => [geoBounds.north-(y/100)*(geoBounds.north-geoBounds.south),geoBounds.west+(x/100)*(geoBounds.east-geoBounds.west)];
const toMapPoint = (lat:number,lng:number):MapPoint => [((lng-geoBounds.west)/(geoBounds.east-geoBounds.west))*100,((geoBounds.north-lat)/(geoBounds.north-geoBounds.south))*100];
const inside = ([x,y]:MapPoint, polygon:MapPoint[]) => { let hit=false; for(let i=0,j=polygon.length-1;i<polygon.length;j=i++){const[xi,yi]=polygon[i],[xj,yj]=polygon[j];if(((yi>y)!==(yj>y))&&(x<(xj-xi)*(y-yi)/(yj-yi)+xi))hit=!hit} return hit };
const isCoveredPoint = (point:MapPoint) => coverageShapes.some((shape)=>inside(point,shape))&&!excludedShapes.some((shape)=>inside(point,shape));

export function DeliveryCoverageChecker() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Place | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const mapElement = useRef<HTMLDivElement>(null);
  const map = useRef<LeafletMap | null>(null);
  const marker = useRef<LeafletMarker | null>(null);
  const leaflet = useRef<typeof import("leaflet") | null>(null);
  const matches = useMemo(() => {
    const value = normalise(query);
    if (!value) return [];
    return places.filter((place) => normalise([place.name, place.english, ...(place.aliases ?? [])].join(" ")).includes(value)).slice(0, 6);
  }, [query]);

  const choose = (place: Place) => {
    setSelected(place);
    setQuery(place.name);
  };

  useEffect(()=>{
    let cancelled=false;
    const setup=async()=>{
      if(!mapElement.current||map.current)return;
      const L=await import("leaflet");
      if(cancelled||!mapElement.current)return;
      leaflet.current=L;
      const instance=L.map(mapElement.current,{zoomControl:false,attributionControl:true,minZoom:10,maxZoom:17}).setView([32.29,35.085],11);
      map.current=instance;
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:19,attribution:'&copy; OpenStreetMap'}).addTo(instance);
      L.control.zoom({position:"bottomleft"}).addTo(instance);
      coverageShapes.forEach((shape)=>L.polygon(shape.map(toLatLng),{color:"#079447",weight:3,fillColor:"#33b864",fillOpacity:.25}).addTo(instance));
      excludedShapes.forEach((shape)=>L.polygon(shape.map(toLatLng),{color:"#dc264b",weight:2,fillColor:"#ef4767",fillOpacity:.22,dashArray:"7 7"}).bindTooltip("منطقة مستثناة من التوصيل").addTo(instance));
      instance.on("click",(event:L.LeafletMouseEvent)=>{
        const point=toMapPoint(event.latlng.lat,event.latlng.lng);const covered=isCoveredPoint(point);
        setSelected({name:"موقع محدد على الخريطة",english:`${event.latlng.lat.toFixed(5)}, ${event.latlng.lng.toFixed(5)}`,x:point[0],y:point[1],covered,note:covered?"النقطة داخل حدود التوصيل":"النقطة خارج حدود التوصيل"});setQuery("موقع محدد");
      });
      setMapReady(true);
      setTimeout(()=>instance.invalidateSize(),80);
    };
    setup();
    return()=>{cancelled=true;map.current?.remove();map.current=null};
  },[]);

  useEffect(()=>{
    const L=leaflet.current,instance=map.current;if(!selected||!L||!instance)return;
    const position=toLatLng([selected.x,selected.y]);
    marker.current?.remove();
    const icon=L.divIcon({className:"haat-map-pin-shell",html:`<span class="haat-map-pin ${selected.covered?"covered":"outside"}"><span>${selected.covered?"✓":"×"}</span></span>`,iconSize:[46,54],iconAnchor:[23,52]});
    marker.current=L.marker(position,{icon}).addTo(instance).bindTooltip(selected.name,{direction:"top",offset:[0,-42]}).openTooltip();
    instance.flyTo(position,Math.max(instance.getZoom(),13),{duration:.75});
  },[selected]);

  const locateMe=()=>navigator.geolocation?.getCurrentPosition(({coords})=>{const point=toMapPoint(coords.latitude,coords.longitude);const covered=isCoveredPoint(point);setSelected({name:"موقعي الحالي",english:`${coords.latitude.toFixed(5)}, ${coords.longitude.toFixed(5)}`,x:point[0],y:point[1],covered,note:covered?"موقعك داخل حدود التوصيل":"موقعك خارج حدود التوصيل"});setQuery("موقعي الحالي")});

  return (
    <section className="card overflow-hidden border-[color-mix(in_srgb,var(--primary)_18%,var(--line))]">
      <header className="bg-gradient-to-l from-[#7a001b] via-[#b41035] to-[#e8395a] p-5 text-white sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <i className="grid size-11 shrink-0 place-items-center rounded-2xl bg-white/15"><Navigation size={22}/></i>
            <div><span className="text-[9px] font-black text-rose-100">منطقة طولكرم • {places.length} موقعًا</span><h2 className="mt-1 text-lg font-black">هل يوجد توصيل لهذا الموقع؟</h2><p className="mt-1 text-[10px] text-rose-100">ابحث باسم البلدة أو القرية وسيظهر نطاق التوصيل مباشرة على الخريطة.</p></div>
          </div>
          <div className="flex flex-wrap gap-2"><button type="button" onClick={locateMe} className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-2 text-[9px] font-black text-[#a7092c] shadow-lg"><LocateFixed size={14}/>استخدم موقعي</button><span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-2 text-[9px] font-bold"><ShieldCheck size={14}/>مخصص لموظفي HAAT</span></div>
        </div>
        <div className="relative mt-5">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={19}/>
          <input value={query} onChange={(event) => { setQuery(event.target.value); setSelected(null); }} onKeyDown={(event) => { if (event.key === "Enter" && matches[0]) choose(matches[0]); }} className="h-14 w-full rounded-2xl border-0 bg-white pr-12 pl-4 text-sm font-bold text-slate-900 shadow-xl outline-none ring-0 placeholder:font-normal placeholder:text-slate-400" placeholder="اكتب مثلاً: شويكة، ذنابة، رامين، كفر قدوم..." aria-label="ابحث عن موقع التوصيل"/>
          {query && !selected && <div className="absolute inset-x-0 top-[60px] z-30 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 text-slate-900 shadow-2xl">
            {matches.length ? matches.map((place) => <button type="button" key={place.name} onClick={() => choose(place)} className="flex w-full items-center gap-3 rounded-xl p-3 text-start hover:bg-rose-50"><MapPin size={17} className="text-[var(--primary)]"/><span className="flex-1"><b className="block text-xs">{place.name}</b><small dir="ltr" className="mt-0.5 block text-start text-[9px] text-slate-500">{place.english}</small></span><span className={`rounded-full px-2 py-1 text-[8px] font-bold ${place.covered ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>{place.covered ? "يوجد توصيل" : "لا يوجد"}</span></button>) : <div className="p-4 text-center text-xs text-slate-500"><CircleAlert className="mx-auto mb-2" size={20}/>الموقع غير موجود ضمن مناطق التشغيل</div>}
          </div>}
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-[9px]"><span className="text-rose-100">جرّب سريعًا:</span>{["شويكة", "ذنابة", "رامين", "أفني حيفتس"].map((name) => { const place = places.find((item) => item.name === name)!; return <button type="button" key={name} onClick={() => choose(place)} className="rounded-full bg-white/15 px-3 py-1.5 font-bold hover:bg-white/25">{name}</button>; })}</div>
      </header>

      <div className="grid lg:grid-cols-[1.05fr_.95fr]">
        <div className="relative min-h-[520px] overflow-hidden bg-slate-100">
          <div ref={mapElement} className="absolute inset-0 z-0" aria-label="خريطة تفاعلية لمناطق توصيل طولكرم"/>
          {!mapReady&&<div className="absolute inset-0 z-10 grid place-items-center bg-slate-100"><div className="text-center text-slate-500"><Layers3 className="mx-auto mb-3 animate-pulse"/><b className="text-xs">جارٍ تجهيز الخريطة التفاعلية...</b></div></div>}
          <div className="pointer-events-none absolute right-3 top-3 z-[500] flex items-center gap-2 rounded-xl bg-white/95 p-2 text-[8px] font-bold shadow-lg backdrop-blur"><MousePointer2 size={13} className="text-slate-500"/><span className="text-slate-700">اضغط أي نقطة لفحصها</span></div>
          <div className="pointer-events-none absolute bottom-3 right-3 z-[500] flex gap-2 rounded-xl bg-white/95 p-2 text-[8px] font-bold shadow-lg backdrop-blur"><span className="flex items-center gap-1 text-emerald-700"><i className="size-2 rounded-full bg-emerald-600"/>داخل التوصيل</span><span className="flex items-center gap-1 text-red-700"><i className="size-2 rounded-full bg-red-600"/>مستثنى/خارج</span></div>
        </div>
        <aside className="flex min-h-[420px] flex-col justify-center p-6 sm:p-8">
          {!selected ? <div className="text-center"><i className="mx-auto grid size-16 place-items-center rounded-[22px] bg-[var(--primary-soft)] text-[var(--primary)]"><Search size={27}/></i><h3 className="mt-5 text-lg font-black">ابحث عن البلدة أولاً</h3><p className="mx-auto mt-2 max-w-sm text-xs leading-6 text-[var(--muted)]">سنحددها على الخريطة ونخبرك فورًا إن كانت ضمن منطقة التوصيل.</p></div> : <div>
            <div className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-[10px] font-black ${selected.covered ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>{selected.covered ? <CheckCircle2 size={16}/> : <XCircle size={16}/>}نتيجة البحث</div>
            <h3 className="mt-5 text-2xl font-black">{selected.name}</h3><p dir="ltr" className="mt-1 text-start text-xs text-[var(--muted)]">{selected.english}</p>
            <div className={`mt-6 rounded-[24px] border p-5 ${selected.covered ? "border-emerald-200 bg-emerald-50" : "border-red-200 bg-red-50"}`}><strong className={`flex items-center gap-2 text-xl ${selected.covered ? "text-emerald-800" : "text-red-800"}`}>{selected.covered ? <CheckCircle2/> : <XCircle/>}{selected.covered ? "نعم، يوجد توصيل" : "لا يوجد توصيل حاليًا"}</strong><p className={`mt-2 text-xs leading-6 ${selected.covered ? "text-emerald-700" : "text-red-700"}`}>{selected.note}</p></div>
            <div className="mt-4 flex items-start gap-2 rounded-2xl bg-[var(--surface-2)] p-4 text-[9px] leading-5 text-[var(--muted)]"><CircleAlert size={16} className="mt-0.5 shrink-0"/>يمكن تحريك الخريطة وتكبيرها والضغط على أي نقطة للتحقق من توفر التوصيل.</div>
          </div>}
        </aside>
      </div>
    </section>
  );
}
