"use client";
import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Map, MapPin, Phone, Search, TestTube2 } from "lucide-react";
import { coverageAreas as defaultCoverageAreas, type CoverageArea } from "@/lib/coverage-areas";
export function CoverageMap() {
  const [coverageAreas, setCoverageAreas] = useState<CoverageArea[]>(defaultCoverageAreas);
  const [selected, setSelected] = useState(
    defaultCoverageAreas.find((a) => a.code === 17) ?? defaultCoverageAreas[0],
  );
  const [query, setQuery] = useState("");
  const [showTests, setShowTests] = useState(false);
  useEffect(() => {
    fetch("/api/coverage").then(response=>response.json()).then(data=>{if(Array.isArray(data.areas)&&data.areas.length)setCoverageAreas(data.areas)}).catch(()=>{});
  }, []);
  const visible = useMemo(
    () =>
      coverageAreas.filter(
        (a) =>
          (showTests || a.status !== "test") &&
          `${a.code} ${a.name} ${a.nameAr}`
            .toLowerCase()
            .includes(query.toLowerCase()),
      ),
    [coverageAreas, query, showTests],
  );
  return (
    <section className="card overflow-hidden">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--line)] p-5">
        <div className="flex items-center gap-3">
          <i className="grid size-11 place-items-center rounded-2xl bg-[var(--primary-soft)] text-[var(--primary)]">
            <Map />
          </i>
          <div>
            <span className="text-[9px] font-black text-[var(--primary)]">
              HAAT COVERAGE MAP
            </span>
            <h2 className="mt-1 text-base font-black">خارطة مناطق التشغيل</h2>
            <p className="mt-1 text-[9px] text-[var(--muted)]">
              {coverageAreas.filter((a) => a.status !== "test").length} منطقة
              ورمز تشغيلي • توزيع بصري تقريبي
            </p>
          </div>
        </div>
        <label className="relative w-full sm:w-64">
          <Search
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)]"
            size={15}
          />
          <input
            className="input h-10 pr-9"
            placeholder="ابحث بالمنطقة أو الرقم..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
      </header>
      <div className="grid lg:grid-cols-[1.05fr_.95fr]">
        <div className="relative min-h-[610px] overflow-hidden bg-gradient-to-br from-slate-50 via-white to-rose-50 p-4 dark:from-[#171216] dark:via-[#20171a] dark:to-[#2c171d]">
          <svg
            viewBox="0 0 390 720"
            className="mx-auto h-[590px] w-full max-w-md"
            role="img"
            aria-label="خارطة مناطق تشغيل HAAT"
          >
            <defs>
              <linearGradient id="land" x1="0" y1="0" x2="1" y2="1">
                <stop stopColor="#fff" />
                <stop offset="1" stopColor="#fde8ed" />
              </linearGradient>
              <filter id="shadow">
                <feDropShadow
                  dx="0"
                  dy="8"
                  stdDeviation="8"
                  floodColor="#7c0018"
                  floodOpacity=".12"
                />
              </filter>
            </defs>
            <path
              d="M164 25 C205 30 248 54 260 92 C273 132 259 167 274 204 C288 241 276 278 261 315 C248 347 262 382 271 414 C282 454 262 490 275 529 C289 570 263 613 246 691 L155 700 C144 663 130 635 137 598 C145 561 122 535 117 501 C112 468 130 438 121 405 C112 369 119 341 129 309 C139 276 125 246 131 215 C137 180 122 151 130 117 C139 82 146 52 164 25 Z"
              fill="url(#land)"
              stroke="#d9a6b2"
              strokeWidth="2"
              filter="url(#shadow)"
            />
            <path
              d="M144 288 C182 304 215 302 254 286M123 408 C169 424 218 424 270 407M119 507 C166 519 222 523 273 509"
              fill="none"
              stroke="#efd1d8"
              strokeDasharray="5 7"
            />
            <g>
              {visible
                .filter((a) => a.status !== "test")
                .map((area) => (
                  <g
                    key={area.code}
                    onClick={() => setSelected(area)}
                    className="cursor-pointer"
                  >
                    <circle
                      cx={area.x}
                      cy={area.y}
                      r={selected.code === area.code ? 13 : 9}
                      fill={
                        area.status === "pilot"
                          ? "#d97706"
                          : selected.code === area.code
                            ? "#8e0020"
                            : "#be123c"
                      }
                      stroke="#fff"
                      strokeWidth="3"
                    >
                      <title>
                        {area.code} - {area.nameAr}
                      </title>
                    </circle>
                    <text
                      x={area.x}
                      y={area.y + 3}
                      textAnchor="middle"
                      fill="#fff"
                      fontSize={selected.code === area.code ? 7 : 6}
                      fontWeight="900"
                    >
                      {area.code}
                    </text>
                    {selected.code === area.code && (
                      <>
                        <circle
                          cx={area.x}
                          cy={area.y}
                          r="20"
                          fill="none"
                          stroke="#be123c"
                          strokeWidth="1.5"
                          opacity=".35"
                        />
                        <text
                          x={area.x + (area.x < 200 ? 18 : -18)}
                          y={area.y - 15}
                          textAnchor={area.x < 200 ? "start" : "end"}
                          fill="#72001a"
                          fontSize="9"
                          fontWeight="900"
                        >
                          {area.nameAr}
                        </text>
                      </>
                    )}
                  </g>
                ))}
            </g>
            <g opacity={showTests ? 1 : 0.35}>
              {coverageAreas
                .filter((a) => a.status === "test")
                .map((area) => (
                  <g
                    key={area.code}
                    onClick={() => setSelected(area)}
                    className="cursor-pointer"
                  >
                    <circle
                      cx={area.x}
                      cy={area.y}
                      r="10"
                      fill="#64748b"
                      stroke="#fff"
                      strokeWidth="3"
                    />
                    <text
                      x={area.x}
                      y={area.y + 3}
                      textAnchor="middle"
                      fill="#fff"
                      fontSize="6"
                      fontWeight="900"
                    >
                      {area.code}
                    </text>
                  </g>
                ))}
            </g>
          </svg>
          <div className="absolute bottom-4 right-4 left-4 rounded-2xl border border-white/80 bg-white/90 p-4 shadow-xl backdrop-blur dark:border-white/10 dark:bg-black/60">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[9px] font-black text-[var(--primary)]">
                  المنطقة المحددة
                </span>
                <h3 className="mt-1 text-base font-black">{selected.nameAr}</h3>
                <p
                  dir="ltr"
                  className="mt-1 text-start text-[9px] text-[var(--muted)]"
                >
                  {selected.name}
                </p>
                {selected.phone && <a dir="ltr" className="mt-2 inline-flex items-center gap-1 text-xs font-black text-[var(--primary)]" href={`tel:${selected.phone.replace(/\D/g, "")}`}><Phone size={13}/>{selected.phone}</a>}
              </div>
              <span className="grid size-12 place-items-center rounded-2xl bg-[var(--primary)] text-lg font-black text-white">
                #{selected.code}
              </span>
            </div>
          </div>
        </div>
        <aside className="flex min-h-[610px] flex-col p-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-black">دليل المناطق</h3>
              <p className="mt-1 text-[9px] text-[var(--muted)]">
                اضغط على أي منطقة لتحديدها على الخارطة
              </p>
            </div>
            <button
              onClick={() => setShowTests(!showTests)}
              className={`rounded-full px-3 py-1.5 text-[8px] font-bold ${showTests ? "bg-slate-700 text-white" : "bg-slate-100 text-slate-600"}`}
            >
              <TestTube2 size={11} className="inline" />{" "}
              {showTests ? "إخفاء التجريبي" : "إظهار التجريبي"}
            </button>
          </div>
          <div className="mt-4 grid max-h-[520px] gap-2 overflow-y-auto pe-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {visible.map((area) => (
              <button
                key={area.code}
                onClick={() => setSelected(area)}
                className={`flex items-center gap-3 rounded-2xl border p-3 text-start transition ${selected.code === area.code ? "border-[var(--primary)] bg-[var(--primary-soft)]" : "border-[var(--line)] bg-[var(--surface-2)] hover:border-rose-200"}`}
              >
                <span
                  className={`grid size-9 shrink-0 place-items-center rounded-xl text-[10px] font-black ${area.status === "test" ? "bg-slate-500 text-white" : area.status === "pilot" ? "bg-amber-500 text-white" : "bg-white text-[var(--primary)] shadow-sm dark:bg-[var(--surface)]"}`}
                >
                  {area.code}
                </span>
                <span className="min-w-0">
                  <b className="block truncate text-[9px]">{area.nameAr}</b>
                  <small
                    dir="ltr"
                    className="mt-1 block truncate text-start text-[7px] text-[var(--muted)]"
                  >
                    {area.name}
                  </small>
                  {area.phone && <small dir="ltr" className="mt-1 block text-start text-[7px] font-bold text-[var(--primary)]">{area.phone}</small>}
                </span>
                {selected.code === area.code && (
                  <CheckCircle2
                    className="ms-auto shrink-0 text-[var(--primary)]"
                    size={15}
                  />
                )}
              </button>
            ))}
          </div>
          <div className="mt-auto flex items-start gap-2 rounded-2xl bg-emerald-50 p-3 text-[9px] leading-5 text-emerald-800">
            <MapPin size={15} className="mt-0.5 shrink-0" />
            الأرقام داخل الدوائر هي رموز المناطق، ورقم التواصل يظهر داخل بطاقة المنطقة عند توفره.
          </div>
        </aside>
      </div>
    </section>
  );
}
