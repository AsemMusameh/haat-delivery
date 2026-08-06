"use client";

import { CakeSlice, ChevronLeft, ChevronRight, PartyPopper, Send, Sparkles, Trophy } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { useLocale } from "./locale-provider";

type Celebration = {
  id: string;
  full_name: string;
  avatar_url?: string;
  event_type: "birthday" | "anniversary";
  event_date: string;
  years?: number;
  days_until: number;
};

function demoCelebrations(): Celebration[] {
  const date = (days: number) => {
    const value = new Date();
    value.setHours(12, 0, 0, 0);
    value.setDate(value.getDate() + days);
    return value.toISOString().slice(0, 10);
  };
  return [
    { id: "demo-birthday", full_name: "ليان سمير", event_type: "birthday", event_date: date(0), days_until: 0 },
    { id: "demo-anniversary", full_name: "رامي عادل", event_type: "anniversary", event_date: date(0), days_until: 0, years: 3 },
    { id: "demo-upcoming", full_name: "نور الحسن", event_type: "birthday", event_date: date(2), days_until: 2 },
  ];
}

export function CelebrationStrip() {
  const { locale } = useLocale();
  const ar = locale === "ar";
  const [events, setEvents] = useState<Celebration[]>(() => isSupabaseConfigured ? [] : demoCelebrations());
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    const supabase = createClient()!;
    supabase.rpc("get_company_celebrations", { p_days_ahead: 14 }).then(({ data }) => {
      if (data?.length) setEvents(data as Celebration[]);
    });
  }, []);

  useEffect(() => {
    if (events.length < 2) return;
    const timer = window.setInterval(() => setActive((current) => (current + 1) % events.length), 6500);
    return () => window.clearInterval(timer);
  }, [events.length]);

  const event = events[active % Math.max(events.length, 1)];
  const copy = useMemo(() => {
    if (!event) return null;
    const today = event.days_until === 0;
    if (event.event_type === "birthday") {
      return {
        label: today ? (ar ? "احتفال اليوم" : "Celebrating today") : (ar ? `بعد ${event.days_until} يوم` : `In ${event.days_until} days`),
        title: today ? (ar ? `عيد ميلاد سعيد، ${event.full_name}!` : `Happy birthday, ${event.full_name}!`) : (ar ? `عيد ميلاد ${event.full_name} قريبًا` : `${event.full_name}'s birthday is coming up`),
        subtitle: today ? (ar ? "فريق HAAT يتمنى لك عامًا مليئًا بالفرح والنجاح 🎉" : "The HAAT team wishes you a joyful and successful year 🎉") : (ar ? "حضّر تهنئتك وشارك زميلك هذه اللحظة الجميلة 🎈" : "Get your message ready and celebrate this special moment 🎈"),
      };
    }
    return {
      label: today ? (ar ? "ذكرى عمل اليوم" : "Work anniversary today") : (ar ? `بعد ${event.days_until} يوم` : `In ${event.days_until} days`),
      title: ar ? `${event.full_name} يكمل ${event.years ?? ""} سنوات معنا!` : `${event.full_name} marks ${event.years ?? ""} years with us!`,
      subtitle: ar ? "شكرًا لصنع الفرق يومًا بعد يوم—فخورون بوجودك ضمن العائلة 🌟" : "Thank you for making a difference every day—we are proud to have you 🌟",
    };
  }, [ar, event]);

  if (!event || !copy) return null;
  const birthday = event.event_type === "birthday";
  const next = () => setActive((active + 1) % events.length);
  const previous = () => setActive((active - 1 + events.length) % events.length);
  const post = birthday
    ? (ar ? `كل عام وأنت بخير ${event.full_name} 🎂🎉 نتمنى لك عامًا سعيدًا مليئًا بالنجاح!` : `Happy birthday ${event.full_name}! 🎂🎉 Wishing you a wonderful and successful year!`)
    : (ar ? `مبارك ذكرى انضمامك إلى HAAT يا ${event.full_name} 🌟 شكرًا لعطائك وتميّزك المستمر!` : `Happy HAAT work anniversary, ${event.full_name}! 🌟 Thank you for all you do!`);

  return (
    <section className="celebration-wrap" aria-label={ar ? "مناسبات فريق HAAT" : "HAAT team celebrations"}>
      <div className={`celebration-strip ${birthday ? "birthday" : "anniversary"}`} aria-live="polite">
        <div className="celebration-confetti" aria-hidden="true">
          {Array.from({ length: 14 }, (_, index) => <i key={index} />)}
        </div>
        <div className="celebration-icon" aria-hidden="true">
          {birthday ? <CakeSlice size={25} /> : <Trophy size={25} />}
          <span>{birthday ? "🎈" : "✨"}</span>
        </div>
        <div className="celebration-copy">
          <span className="celebration-label">{birthday ? <PartyPopper size={14} /> : <Sparkles size={14} />}{copy.label}</span>
          <strong>{copy.title} <em>{birthday ? "🎂" : "🏆"}</em></strong>
          <p>{copy.subtitle}</p>
        </div>
        <Link className="celebration-action" href={`/community?celebrate=${encodeURIComponent(post)}`}>
          <Send size={15} /><span>{ar ? "أرسل تهنئة" : "Send a wish"}</span>
        </Link>
        {events.length > 1 && (
          <div className="celebration-controls">
            <button type="button" onClick={previous} aria-label={ar ? "المناسبة السابقة" : "Previous celebration"}>{ar ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}</button>
            <div>{events.map((item, index) => <button type="button" key={`${item.id}-${item.event_type}`} className={index === active ? "active" : ""} onClick={() => setActive(index)} aria-label={`${index + 1}`} />)}</div>
            <button type="button" onClick={next} aria-label={ar ? "المناسبة التالية" : "Next celebration"}>{ar ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}</button>
          </div>
        )}
      </div>
    </section>
  );
}
