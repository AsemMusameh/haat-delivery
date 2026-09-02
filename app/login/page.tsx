"use client";

import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  CheckCircle2,
  Eye,
  EyeOff,
  Globe2,
  KeyRound,
  LoaderCircle,
  LockKeyhole,
  Mail,
  MailCheck,
  MapPin,
  ShieldCheck,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useLocale } from "@/components/locale-provider";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

const DEFAULT_PASSWORD = "123456789";
const DEFAULT_EMAIL = "asem.msameh@team.haat.delivery";
const DOMAIN_FALLBACK = "team.haat.delivery";

type BusyAction = "password" | "google" | "magic" | "recovery" | null;

export default function Login() {
  const { locale, setLocale } = useLocale();
  const isArabic = locale === "ar";
  const router = useRouter();
  const [email, setEmail] = useState(DEFAULT_EMAIL);
  const [password, setPassword] = useState(DEFAULT_PASSWORD);
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [busy, setBusy] = useState<BusyAction>(null);
  const [recoveryOpen, setRecoveryOpen] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState(DEFAULT_EMAIL);
  const [recoverySent, setRecoverySent] = useState(false);

  const copy = isArabic
    ? {
        eyebrow: "بوابة موظفي HAAT الآمنة",
        welcome: "أهلاً بعودتك",
        title: "سجّل دخولك إلى مساحة العمل",
        subtitle: "اختر الطريقة المناسبة لك، واستكمل يومك من مكان واحد.",
        email: "الرقم الوظيفي أو البريد الرسمي",
        emailPlaceholder: "مثال: 1024 أو name@haat.delivery",
        password: "كلمة المرور",
        passwordPlaceholder: "أدخل كلمة المرور",
        remember: "تذكرني على هذا الجهاز",
        forgot: "نسيت كلمة المرور؟",
        submit: "دخول آمن",
        loading: "جارٍ التحقق...",
        show: "إظهار كلمة المرور",
        hide: "إخفاء كلمة المرور",
        demoTitle: "تجربة سريعة",
        demoText: "اختر نوع الحساب للدخول مباشرة إلى النسخة التجريبية.",
        manager: "حساب المدير",
        employee: "حساب الموظف",
        or: "أو تابع بإحدى الطرق الآمنة",
        office: "مكتب طولكرم",
        rights: "جميع الحقوق محفوظة",
        google: "المتابعة باستخدام Google",
        emailLink: "إرسال رابط دخول إلى البريد",
        emailSent: "تم إرسال رابط دخول آمن إلى بريدك",
        secure: "اتصال مشفّر",
        companyOnly: "للموظفين المعتمدين فقط",
        allMethods: "كلمة المرور · Google · رابط البريد",
        recoveryTitle: "استعادة كلمة المرور",
        recoveryText: "سنرسل إلى بريدك الرسمي رابطًا آمنًا لاختيار كلمة مرور جديدة.",
        recoveryButton: "إرسال رابط الاستعادة",
        recoveryDone: "تم إرسال الرابط",
        recoveryDoneText: "تحقق من صندوق الوارد والرسائل غير المرغوب فيها، ثم افتح رابط الاستعادة.",
        close: "إغلاق",
        anotherEmail: "استخدام بريد آخر",
        live: "متصل وآمن",
        demoMode: "وضع العرض التجريبي",
      }
    : {
        eyebrow: "Secure HAAT employee portal",
        welcome: "Welcome back",
        title: "Sign in to your workspace",
        subtitle: "Choose your preferred method and continue your day from one place.",
        email: "Employee ID or company email",
        emailPlaceholder: "Example: 1024 or name@haat.delivery",
        password: "Password",
        passwordPlaceholder: "Enter your password",
        remember: "Remember me on this device",
        forgot: "Forgot password?",
        submit: "Secure sign in",
        loading: "Verifying...",
        show: "Show password",
        hide: "Hide password",
        demoTitle: "Quick demo",
        demoText: "Choose an account type to enter the demo instantly.",
        manager: "Manager account",
        employee: "Employee account",
        or: "or continue securely with",
        office: "Tulkarm Office",
        rights: "All rights reserved",
        google: "Continue with Google",
        emailLink: "Email me a secure sign-in link",
        emailSent: "A secure sign-in link was sent to your email",
        secure: "Encrypted connection",
        companyOnly: "Approved employees only",
        allMethods: "Password · Google · Email link",
        recoveryTitle: "Reset your password",
        recoveryText: "We will send a secure link to your company email to choose a new password.",
        recoveryButton: "Send recovery link",
        recoveryDone: "Recovery link sent",
        recoveryDoneText: "Check your inbox and spam folder, then open the recovery link.",
        close: "Close",
        anotherEmail: "Use another email",
        live: "Connected and secure",
        demoMode: "Demo mode",
      };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const saved = window.localStorage.getItem("haat-remembered-email");
      const shouldRemember = window.localStorage.getItem("haat-remember-me") !== "false";
      setRemember(shouldRemember);
      if (saved && shouldRemember) {
        setEmail(saved);
        setRecoveryEmail(saved);
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const error = new URLSearchParams(window.location.search).get("error");
    if (!error) return;
    const messages: Record<string, string> = {
      domain: isArabic ? "هذا البريد غير تابع لنطاق الشركة المسموح" : "This email is not in an approved company domain",
      oauth: isArabic ? "تعذر إكمال تسجيل الدخول. حاول مرة أخرى" : "Sign-in could not be completed. Please try again",
      session: isArabic ? "انتهت جلسة الدخول. حاول مرة أخرى" : "Your sign-in session expired. Please try again",
    };
    toast.error(messages[error] ?? messages.oauth);
    window.history.replaceState({}, "", "/login");
  }, [isArabic]);

  const isAllowedEmail = (value: string) => {
    if (!value.includes("@")) return true;
    const domain = value.split("@")[1]?.toLowerCase();
    const allowed = (process.env.NEXT_PUBLIC_ALLOWED_EMAIL_DOMAINS ?? DOMAIN_FALLBACK)
      .split(",")
      .map((item) => item.trim().toLowerCase())
      .filter(Boolean);
    return allowed.includes(domain);
  };

  const rememberEmail = (value: string) => {
    window.localStorage.setItem("haat-remember-me", String(remember));
    if (remember && value.includes("@")) window.localStorage.setItem("haat-remembered-email", value);
    else window.localStorage.removeItem("haat-remembered-email");
  };

  const enterDemo = async (role: "manager" | "employee") => {
    const demoEmail = role === "manager" ? DEFAULT_EMAIL : "employee@team.haat.delivery";
    setEmail(demoEmail);
    setPassword(DEFAULT_PASSWORD);
    setBusy("password");
    await new Promise((resolve) => setTimeout(resolve, 520));
    rememberEmail(demoEmail);
    toast.success(isArabic ? `تم الدخول باستخدام ${role === "manager" ? "حساب المدير" : "حساب الموظف"}` : `Signed in with the ${role} demo account`);
    router.push(role === "manager" ? "/admin" : "/dashboard");
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const login = email.trim().toLowerCase();
    setBusy("password");
    try {
      if (!isAllowedEmail(login)) {
        throw new Error(isArabic ? "يسمح بالدخول باستخدام بريد الشركة الرسمي فقط" : "Use your official company email to sign in");
      }

      if (!isSupabaseConfigured) {
        await new Promise((resolve) => setTimeout(resolve, 650));
        rememberEmail(login);
        toast.success(isArabic ? "تم تسجيل الدخول بنجاح" : "Signed in successfully");
        router.push(login === DEFAULT_EMAIL ? "/admin" : "/dashboard");
        return;
      }

      const supabase = createClient()!;
      let loginEmail = login;
      if (!login.includes("@")) {
        const { data, error } = await supabase.rpc("resolve_login_email", { p_employee_id: login });
        if (error || !data) throw new Error(isArabic ? "الرقم الوظيفي غير صحيح" : "Invalid employee ID");
        loginEmail = data;
      }
      const { error } = await supabase.auth.signInWithPassword({ email: loginEmail, password });
      if (error) throw error;
      rememberEmail(loginEmail);
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : isArabic ? "تعذر تسجيل الدخول" : "Unable to sign in");
    } finally {
      setBusy(null);
    }
  };

  const googleSignIn = async () => {
    setBusy("google");
    try {
      if (!isSupabaseConfigured) {
        await new Promise((resolve) => setTimeout(resolve, 650));
        toast.success(isArabic ? "تم تسجيل دخول Google في الوضع التجريبي" : "Google demo sign-in completed");
        router.push("/dashboard");
        return;
      }
      const { error } = await createClient()!.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/auth/callback?next=/dashboard` },
      });
      if (error) throw error;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : isArabic ? "تعذر فتح Google" : "Unable to open Google sign-in");
      setBusy(null);
    }
  };

  const emailLink = async () => {
    const login = email.trim().toLowerCase();
    if (!login.includes("@")) return toast.error(isArabic ? "أدخل البريد الإلكتروني الرسمي أولاً" : "Enter your company email first");
    if (!isAllowedEmail(login)) return toast.error(isArabic ? "استخدم بريد الشركة الرسمي" : "Use your official company email");
    setBusy("magic");
    try {
      if (!isSupabaseConfigured) {
        await new Promise((resolve) => setTimeout(resolve, 650));
        toast.success(isArabic ? "تم التحقق والدخول في الوضع التجريبي" : "Email-link demo verification completed");
        router.push("/dashboard");
        return;
      }
      const { error } = await createClient()!.auth.signInWithOtp({
        email: login,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
          shouldCreateUser: false,
        },
      });
      if (error) throw error;
      toast.success(copy.emailSent);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : isArabic ? "تعذر إرسال الرابط" : "Unable to send the link");
    } finally {
      setBusy(null);
    }
  };

  const sendRecovery = async (event: React.FormEvent) => {
    event.preventDefault();
    const login = recoveryEmail.trim().toLowerCase();
    if (!login.includes("@")) return toast.error(isArabic ? "أدخل البريد الإلكتروني الرسمي" : "Enter your company email");
    if (!isAllowedEmail(login)) return toast.error(isArabic ? "استخدم بريد الشركة الرسمي" : "Use your official company email");
    setBusy("recovery");
    try {
      if (!isSupabaseConfigured) {
        await new Promise((resolve) => setTimeout(resolve, 650));
      } else {
        const { error } = await createClient()!.auth.resetPasswordForEmail(login, {
          redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
        });
        if (error) throw error;
      }
      setRecoverySent(true);
      toast.success(copy.recoveryDone);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : isArabic ? "تعذر إرسال الرابط" : "Unable to send recovery link");
    } finally {
      setBusy(null);
    }
  };

  const DirectionArrow = isArabic ? ArrowLeft : ArrowRight;

  return (
    <main className="login-page auth-premium" dir="ltr">
      <section className="login-visual" aria-label="مكتب طولكرم بإدارة عبد الله السيد">
        <img src="/tulkarm-office-4k.jpg" alt="مكتب طولكرم" />
        <div className="auth-image-overlay" />
        <div className="auth-image-badge" dir="rtl">
          <span><MapPin size={16} /> مكتب طولكرم</span>
          <strong>كل أدوات فريقك في مكان واحد</strong>
          <small>تواصل · أداء · إعلانات · تطبيقات</small>
        </div>
      </section>

      <section className="login-panel" dir={isArabic ? "rtl" : "ltr"}>
        <div className="auth-topbar">
          <span className="auth-live"><i /> {isSupabaseConfigured ? copy.live : copy.demoMode}</span>
          <button
            data-no-auto-translate
            type="button"
            onClick={() => setLocale(isArabic ? "en" : "ar")}
            className="login-language"
            aria-label={isArabic ? "Switch to English" : "التبديل إلى العربية"}
          >
            <Globe2 size={16} />
            {isArabic ? "English" : "العربية"}
          </button>
        </div>

        <div className="login-card">
          <header className="auth-heading">
            <div className="login-logo-wrap"><img src="/haat-logo.png" alt="HAAT" /></div>
            <span className="auth-eyebrow"><ShieldCheck size={15} /> {copy.eyebrow}</span>
            <p className="login-kicker">{copy.welcome}</p>
            <h1>{copy.title}</h1>
            <p className="login-subtitle">{copy.subtitle}</p>
          </header>

          {!isSupabaseConfigured && (
            <section className="auth-demo-box">
              <div className="auth-demo-copy"><Sparkles size={18} /><span><strong>{copy.demoTitle}</strong><small>{copy.demoText}</small></span></div>
              <div className="auth-demo-actions">
                <button type="button" disabled={busy !== null} onClick={() => enterDemo("manager")}><BriefcaseBusiness size={16} />{copy.manager}</button>
                <button type="button" disabled={busy !== null} onClick={() => enterDemo("employee")}><UserRound size={16} />{copy.employee}</button>
              </div>
            </section>
          )}

          <form className="login-form" onSubmit={submit}>
            <label>
              <span>{copy.email}</span>
              <div className="login-input-wrap">
                <Mail size={19} />
                <input value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="username" placeholder={copy.emailPlaceholder} />
                {email && isAllowedEmail(email) && <BadgeCheck className="auth-valid" size={18} />}
              </div>
            </label>

            <label>
              <span>{copy.password}</span>
              <div className="login-input-wrap">
                <LockKeyhole size={19} />
                <input type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} required autoComplete="current-password" placeholder={copy.passwordPlaceholder} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="login-eye" aria-label={showPassword ? copy.hide : copy.show}>
                  {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>
            </label>

            <div className="login-options">
              <label className="login-remember">
                <input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} />
                <span>{copy.remember}</span>
              </label>
              <button type="button" onClick={() => { setRecoveryEmail(email.includes("@") ? email : ""); setRecoverySent(false); setRecoveryOpen(true); }}>{copy.forgot}</button>
            </div>

            <button className="login-submit" disabled={busy !== null}>
              {busy === "password" ? <LoaderCircle className="auth-spin" size={19} /> : <KeyRound size={18} />}
              <span>{busy === "password" ? copy.loading : copy.submit}</span>
              {busy !== "password" && <DirectionArrow size={18} />}
            </button>
          </form>

          <div className="login-divider"><span>{copy.or}</span></div>
          <div className="login-socials">
            <button type="button" disabled={busy !== null} onClick={googleSignIn} className="login-provider auth-google">
              {busy === "google" ? <LoaderCircle className="auth-spin" size={19} /> : <b>G</b>}<span>{copy.google}</span><DirectionArrow size={17} />
            </button>
            <button type="button" disabled={busy !== null} onClick={emailLink} className="login-provider">
              {busy === "magic" ? <LoaderCircle className="auth-spin" size={19} /> : <MailCheck size={19} />}<span>{copy.emailLink}</span><DirectionArrow size={17} />
            </button>
          </div>

          <div className="auth-trust-row">
            <span><ShieldCheck size={15} />{copy.secure}</span>
            <span><CheckCircle2 size={15} />{copy.companyOnly}</span>
            <small>{copy.allMethods}</small>
          </div>
          <div className="login-office"><MapPin size={17} />{copy.office}</div>
        </div>

        <footer>© 2026 HAAT Delivery · {copy.rights}</footer>
      </section>

      {recoveryOpen && (
        <div className="auth-modal-backdrop" dir={isArabic ? "rtl" : "ltr"} role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setRecoveryOpen(false)}>
          <section className="auth-modal" role="dialog" aria-modal="true" aria-labelledby="recovery-title">
            <button className="auth-modal-close" type="button" onClick={() => setRecoveryOpen(false)} aria-label={copy.close}><X size={20} /></button>
            {recoverySent ? (
              <div className="auth-recovery-success">
                <i><MailCheck size={30} /></i>
                <h2 id="recovery-title">{copy.recoveryDone}</h2>
                <p>{copy.recoveryDoneText}</p>
                <strong dir="ltr">{recoveryEmail}</strong>
                <button type="button" className="login-submit" onClick={() => setRecoveryOpen(false)}>{copy.close}</button>
                <button type="button" className="auth-text-button" onClick={() => setRecoverySent(false)}>{copy.anotherEmail}</button>
              </div>
            ) : (
              <form onSubmit={sendRecovery}>
                <i className="auth-modal-icon"><KeyRound size={25} /></i>
                <h2 id="recovery-title">{copy.recoveryTitle}</h2>
                <p>{copy.recoveryText}</p>
                <label>
                  <span>{copy.email}</span>
                  <div className="login-input-wrap"><Mail size={19} /><input autoFocus value={recoveryEmail} onChange={(event) => setRecoveryEmail(event.target.value)} placeholder={copy.emailPlaceholder} /></div>
                </label>
                <button className="login-submit" disabled={busy === "recovery"}>{busy === "recovery" ? <LoaderCircle className="auth-spin" size={19} /> : <MailCheck size={19} />}{busy === "recovery" ? copy.loading : copy.recoveryButton}</button>
              </form>
            )}
          </section>
        </div>
      )}
    </main>
  );
}
