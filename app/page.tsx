"use client";

import Link from "next/link";
import { ArrowLeft, Globe2, Newspaper, ShieldCheck, Sparkles, Users } from "lucide-react";
import { useEffect, useState } from "react";

export default function Home() {
  const [numbers, setNumbers] = useState({ team: "+500", areas: "+20", support: "24/7", satisfaction: "98%" });
  useEffect(() => {
    fetch("/api/portal-settings").then((response) => response.json()).then((result) => {
      const settings = new Map<string,string>((result.settings || []).map((item: { key: string; value: string }) => [item.key, item.value]));
      setNumbers({ team: settings.get("public_team_count") || "+500", areas: settings.get("public_area_count") || "+20", support: settings.get("public_support_hours") || "24/7", satisfaction: settings.get("public_satisfaction") || "98%" });
    }).catch(() => {});
  }, []);
  return (
    <main className="public-home" dir="rtl">
      <header className="public-header">
        <div className="public-container public-nav">
          <Link href="/" className="public-logo" aria-label="HAAT الصفحة الرئيسية"><img src="/haat-logo.png" alt="HAAT" width="106" height="52" /></Link>
          <nav aria-label="التنقل الرئيسي">
            <a href="#about">عن HAAT</a><a href="#numbers">أرقامنا</a>
          </nav>
          <div className="public-actions"><Link href="/login" className="employee-login">دخول الموظفين <ArrowLeft size={17} /></Link></div>
        </div>
      </header>

      <section className="public-hero">
        <div className="hero-orb hero-orb-one" /><div className="hero-orb hero-orb-two" />
        <div className="public-container public-hero-grid">
          <div className="public-hero-copy">
            <span className="public-eyebrow"><Sparkles size={16} /> من قلب HAAT</span>
            <h1>نقرّب الناس،<br /><em>ونحرّك الحياة.</em></h1>
            <p>مرحبًا بكم في مساحة HAAT العامة — قصص فريقنا، خدمتنا، والأثر الذي نصنعه معًا كل يوم.</p>
            <div className="public-hero-buttons"><a href="#about" className="hero-primary">تعرّف على HAAT <ArrowLeft size={18} /></a><Link href="/login" className="hero-secondary">منصة الموظفين</Link></div>
          </div>
          <div className="public-hero-art" aria-hidden="true">
            <div className="delivery-card"><span>HAAT</span><strong>أقرب مما تتخيّل</strong><i>من الطلب إلى بابك</i></div>
            <div className="route-line"><i /><i /><i /></div>
            <div className="floating-note"><ShieldCheck size={25} /><span><b>خدمة موثوقة</b><small>فريق واحد، هدف واحد</small></span></div>
          </div>
        </div>
        <div className="hero-wave" />
      </section>

      <section id="numbers" className="public-numbers"><div className="public-container"><div className="numbers-intro"><span>HAAT بالأرقام</span><h2>أثرٌ يكبر كل يوم</h2><p>ننمو بفضل ثقة زبائننا، شركائنا، وكل فرد في فريقنا.</p></div><div className="numbers-grid"><div><Users size={24} /><strong>{numbers.team}</strong><span>فرد في الفريق</span></div><div><Globe2 size={24} /><strong>{numbers.areas}</strong><span>منطقة نخدمها</span></div><div><Newspaper size={24} /><strong>{numbers.support}</strong><span>دعم متواصل</span></div><div><ShieldCheck size={24} /><strong>{numbers.satisfaction}</strong><span>رضا عن الخدمة</span></div></div></div></section>

      <section id="about" className="public-cta public-container"><div><span>حول HAAT</span><h2>نقرّب الناس ونحرّك الحياة</h2><p>تابع صفحات HAAT الرسمية، أو ادخل إلى منصة الموظفين لمتابعة أدوات العمل والتعميمات.</p><div className="mt-5 flex flex-wrap gap-3"><a href="https://www.instagram.com/haat.palestine" target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-4 py-3 text-xs font-black text-white"><b className="grid size-6 place-items-center rounded-full bg-white text-[10px] text-[#c50c32]">IG</b>Instagram</a><a href="https://www.facebook.com/haatpalestine/" target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-4 py-3 text-xs font-black text-white"><b className="grid size-6 place-items-center rounded-full bg-white text-sm text-[#c50c32]">f</b>Facebook</a></div></div><Link href="/login">الدخول إلى المنصة <ArrowLeft size={18} /></Link></section>

      <footer className="public-footer"><div className="public-container"><img src="/haat-logo.png" alt="HAAT" width="90" height="45" /><p>© 2026 HAAT. معًا، نقرّب كل شيء.</p><div className="flex items-center gap-4"><a href="https://www.instagram.com/haat.palestine" target="_blank" rel="noreferrer" aria-label="Instagram" className="font-black">IG</a><a href="https://www.facebook.com/haatpalestine/" target="_blank" rel="noreferrer" aria-label="Facebook" className="font-black">f</a><Link href="/login">دخول الموظفين</Link></div></div></footer>
    </main>
  );
}
