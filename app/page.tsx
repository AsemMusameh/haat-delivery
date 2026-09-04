import Link from "next/link";
import { ArrowLeft, CalendarDays, ChevronLeft, Globe2, Newspaper, ShieldCheck, Sparkles, Users } from "lucide-react";

const news = [
  { tag: "أخبار الشركة", date: "4 أغسطس 2026", title: "HAAT تواصل تطوير تجربة التوصيل ودعم فرقها في الميدان", text: "خطوات جديدة لتعزيز جودة الخدمة، سرعة الاستجابة، وتجربة الزبائن في مختلف المناطق.", tone: "red" },
  { tag: "المجتمع", date: "28 يوليو 2026", title: "مبادرات محلية تصنع أثرًا أقرب إلى الناس", text: "نؤمن بأن كل توصيلة فرصة لربط الأشخاص ودعم الأعمال والمجتمعات المحلية.", tone: "yellow" },
  { tag: "فريق HAAT", date: "20 يوليو 2026", title: "قصص من قلب الفريق: الأشخاص الذين يحركون HAAT", text: "نتعرّف إلى زملائنا وإنجازاتهم اليومية، من الدعم وحتى العمليات والتوصيل.", tone: "dark" },
];

export default function Home() {
  return (
    <main className="public-home" dir="rtl">
      <header className="public-header">
        <div className="public-container public-nav">
          <Link href="/" className="public-logo" aria-label="HAAT الصفحة الرئيسية"><img src="/haat-logo.png" alt="HAAT" width="106" height="52" /></Link>
          <nav aria-label="التنقل الرئيسي">
            <a href="#news">الأخبار</a><a href="#about">عن HAAT</a><a href="#numbers">أرقامنا</a>
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
            <p>مرحبًا بكم في مساحة HAAT العامة — آخر أخبارنا، قصص فريقنا، والأثر الذي نصنعه معًا كل يوم.</p>
            <div className="public-hero-buttons"><a href="#news" className="hero-primary">اكتشف آخر الأخبار <ChevronLeft size={18} /></a><Link href="/login" className="hero-secondary">منصة الموظفين</Link></div>
          </div>
          <div className="public-hero-art" aria-hidden="true">
            <div className="delivery-card"><span>HAAT</span><strong>أقرب مما تتخيّل</strong><i>من الطلب إلى بابك</i></div>
            <div className="route-line"><i /><i /><i /></div>
            <div className="floating-note"><ShieldCheck size={25} /><span><b>خدمة موثوقة</b><small>فريق واحد، هدف واحد</small></span></div>
          </div>
        </div>
        <div className="hero-wave" />
      </section>

      <section id="news" className="public-section public-container">
        <div className="section-heading"><div><span>غرفة الأخبار</span><h2>آخر ما يحدث في HAAT</h2></div><a href="#news">جميع الأخبار <ArrowLeft size={17} /></a></div>
        <div className="news-grid">{news.map((item, index) => <article className="news-card" key={item.title}><div className={`news-visual ${item.tone}`}><span>0{index + 1}</span><Newspaper size={42} /></div><div className="news-content"><div><b>{item.tag}</b><time><CalendarDays size={13} />{item.date}</time></div><h3>{item.title}</h3><p>{item.text}</p><a href="#about">اقرأ المزيد <ChevronLeft size={15} /></a></div></article>)}</div>
      </section>

      <section id="numbers" className="public-numbers"><div className="public-container"><div className="numbers-intro"><span>HAAT بالأرقام</span><h2>أثرٌ يكبر كل يوم</h2><p>ننمو بفضل ثقة زبائننا، شركائنا، وكل فرد في فريقنا.</p></div><div className="numbers-grid"><div><Users size={24} /><strong>+500</strong><span>فرد في الفريق</span></div><div><Globe2 size={24} /><strong>+20</strong><span>منطقة نخدمها</span></div><div><Newspaper size={24} /><strong>24/7</strong><span>دعم متواصل</span></div><div><ShieldCheck size={24} /><strong>98%</strong><span>رضا عن الخدمة</span></div></div></div></section>

      <section id="about" className="public-cta public-container"><div><span>لأعضاء فريق HAAT</span><h2>كل أدواتك ومعلوماتك في مكان واحد</h2><p>ادخل إلى منصة الموظفين لمتابعة الإعلانات، الأداء، الجدول، والملف الشخصي.</p></div><Link href="/login">الدخول إلى المنصة <ArrowLeft size={18} /></Link></section>

      <footer className="public-footer"><div className="public-container"><img src="/haat-logo.png" alt="HAAT" width="90" height="45" /><p>© 2026 HAAT. معًا، نقرّب كل شيء.</p><Link href="/login">دخول الموظفين</Link></div></footer>
    </main>
  );
}
