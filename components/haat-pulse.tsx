"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { HeartPulse } from "lucide-react";

const moods = [
  { value: 1, emoji: "😞", label: "صعب" },
  { value: 2, emoji: "😕", label: "متعب" },
  { value: 3, emoji: "😐", label: "عادي" },
  { value: 4, emoji: "🙂", label: "جيد" },
  { value: 5, emoji: "😄", label: "ممتاز" },
];
export function HaatPulse() {
  const [selected, setSelected] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    fetch("/api/pulse")
      .then((r) => r.json())
      .then((d) => setSelected(d.mood || null))
      .catch(() => {});
  }, []);
  const submit = async (value: number) => {
    setLoading(true);
    const response = await fetch("/api/pulse", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mood: value }),
    });
    setLoading(false);
    if (response.ok) {
      setSelected(value);
      toast.success("شكراً لمشاركتك — تم تسجيل النبض اليومي");
    } else toast.error("تعذر حفظ النبض حالياً");
  };
  return (
    <article className="card overflow-hidden p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="inline-flex items-center gap-1.5 text-[10px] font-black text-[var(--primary)]">
            <HeartPulse size={15} /> HAAT PULSE
          </span>
          <h3 className="mt-1 text-base font-black">كيف طاقتك اليوم؟</h3>
          <p className="mt-1 text-[10px] text-[var(--muted)]">
            اختيار واحد يومياً، ويظهر للإدارة كمؤشر جماعي فقط.
          </p>
        </div>
        {selected && (
          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[9px] font-bold text-emerald-700">
            تم التسجيل
          </span>
        )}
      </div>
      <div className="mt-4 grid grid-cols-5 gap-2">
        {moods.map((mood) => (
          <button
            key={mood.value}
            disabled={loading}
            onClick={() => submit(mood.value)}
            className={`rounded-2xl border p-2 text-center transition ${selected === mood.value ? "border-[var(--primary)] bg-[var(--primary-soft)] shadow-sm" : "border-[var(--line)] bg-[var(--surface-2)] hover:border-rose-300"}`}
          >
            <span className="block text-2xl">{mood.emoji}</span>
            <small className="mt-1 block text-[8px] font-bold text-[var(--muted)]">
              {mood.label}
            </small>
          </button>
        ))}
      </div>
    </article>
  );
}

export function PulseSummary() {
  const [counts, setCounts] = useState<Record<number, number>>({});
  useEffect(() => {
    fetch("/api/pulse?summary=1")
      .then((r) => r.json())
      .then((d) =>
        setCounts(
          Object.fromEntries(
            (d.summary || []).map((item: { mood: number; count: number }) => [
              item.mood,
              item.count,
            ]),
          ),
        ),
      )
      .catch(() => {});
  }, []);
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  return (
    <article className="card p-5">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-black text-[var(--primary)]">
            HAAT PULSE
          </span>
          <h3 className="mt-1 font-black">نبض الفريق اليوم</h3>
        </div>
        <span className="rounded-full bg-[var(--surface-2)] px-3 py-1 text-xs font-black">
          {total} مشاركة
        </span>
      </div>
      <div className="mt-4 flex items-end justify-between gap-2">
        {moods.map((mood) => {
          const count = counts[mood.value] || 0;
          const height = total
            ? Math.max(12, Math.round((count / total) * 72))
            : 12;
          return (
            <div
              key={mood.value}
              className="flex flex-1 flex-col items-center gap-1"
            >
              <b className="text-[9px]">{count}</b>
              <i
                className="w-full rounded-t-lg bg-gradient-to-t from-rose-700 to-rose-400"
                style={{ height }}
              />
              <span className="text-xl">{mood.emoji}</span>
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-[9px] leading-5 text-[var(--muted)]">
        المؤشر مجمّع لحماية خصوصية الموظفين؛ لا يعرض أسماء المشاركين.
      </p>
    </article>
  );
}
