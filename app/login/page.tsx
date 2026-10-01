"use client";

import { BriefcaseBusiness, CheckCircle2, Eye, EyeOff, Globe2, KeyRound, LoaderCircle, LockKeyhole, Mail, MapPin, ShieldCheck, UserRound, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useLocale } from "@/components/locale-provider";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { demoEmployees, managerEmails, rosterEmails } from "@/lib/demo-data";

const DEFAULT_PASSWORD = "123456789";
const DEFAULT_EMAIL = "mohammad.moayyad@haat.delivery";
const DOMAIN_FALLBACK = "haat.delivery";

export default function Login() {
  const { locale, setLocale } = useLocale();
  const ar = locale === "ar";
  const router = useRouter();
  const [email, setEmail] = useState(DEFAULT_EMAIL);
  const [password, setPassword] = useState(DEFAULT_PASSWORD);
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [busy, setBusy] = useState<"password" | "recovery" | null>(null);
  const [recoveryOpen, setRecoveryOpen] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState(DEFAULT_EMAIL);
  const [recoverySent, setRecoverySent] = useState(false);

  const copy = ar ? {
    welcome: "أهلاً بعودتك", subtitle: "سجّل الدخول للوصول إلى مساحة عملك", email: "البريد الرسمي أو الرقم الوظيفي", password: "كلمة المرور", remember: "تذكرني", forgot: "نسيت كلمة المرور؟", submit: "تسجيل الدخول", loading: "جارٍ التحقق...", demo: "دخول سريع للنسخة التجريبية", manager: "حساب المدير", employee: "حساب الموظف", recovery: "استعادة كلمة المرور", recoveryText: "أدخل بريدك الرسمي وسنرسل لك رابط الاستعادة.", send: "إرسال الرابط", sent: "تم إرسال رابط الاستعادة", close: "إغلاق",
  } : {
    welcome: "Welcome back", subtitle: "Sign in to access your workspace", email: "Email address or employee ID", password: "Password", remember: "Remember me", forgot: "Forgot password?", submit: "Sign in", loading: "Verifying...", demo: "Quick demo access", manager: "Manager account", employee: "Employee account", recovery: "Reset password", recoveryText: "Enter your company email and we will send a recovery link.", send: "Send recovery link", sent: "Recovery link sent", close: "Close",
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const saved = window.localStorage.getItem("haat-remembered-email");
      const shouldRemember = window.localStorage.getItem("haat-remember-me") !== "false";
      setRemember(shouldRemember);
      if (saved && shouldRemember) { setEmail(saved); setRecoveryEmail(saved); }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const isAllowedEmail = (value: string) => {
    if (!value.includes("@")) return true;
    const domain = value.split("@")[1]?.toLowerCase();
    return (process.env.NEXT_PUBLIC_ALLOWED_EMAIL_DOMAINS ?? DOMAIN_FALLBACK).split(",").map((item) => item.trim().toLowerCase()).filter(Boolean).includes(domain);
  };

  const rememberEmail = (value: string) => {
    window.localStorage.setItem("haat-remember-me", String(remember));
    if (remember && value.includes("@")) window.localStorage.setItem("haat-remembered-email", value);
    else window.localStorage.removeItem("haat-remembered-email");
  };

  const enterDemo = async (role: "manager" | "employee") => {
    const demoEmail = role === "manager" ? DEFAULT_EMAIL : "tala.barham@haat.delivery";
    setEmail(demoEmail); setPassword(DEFAULT_PASSWORD); setBusy("password");
    await new Promise((resolve) => setTimeout(resolve, 350));
    rememberEmail(demoEmail);
    const account = demoEmployees.find((employee) => employee.email === demoEmail);
    window.localStorage.setItem("haat-current-user", account?.id ?? "");
    window.location.assign(role === "manager" ? "/admin" : "/dashboard");
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const login = email.trim().toLowerCase();
    setBusy("password");
    try {
      if (!isAllowedEmail(login)) throw new Error(ar ? "استخدم بريد الشركة الرسمي" : "Use your official company email");
      if (!isSupabaseConfigured) {
        if (!rosterEmails.has(login)) throw new Error(ar ? "هذا البريد غير موجود في قائمة الموظفين" : "This email is not in the employee roster");
        if (password !== DEFAULT_PASSWORD) throw new Error(ar ? "كلمة المرور غير صحيحة" : "Incorrect password");
        const account = demoEmployees.find((employee) => employee.email.toLowerCase() === login);
        window.localStorage.setItem("haat-current-user", account?.id ?? "");
        await new Promise((resolve) => setTimeout(resolve, 350)); rememberEmail(login);
        window.location.assign(managerEmails.has(login) ? "/admin" : "/dashboard"); return;
      }
      const supabase = createClient()!;
      let loginEmail = login;
      if (!login.includes("@")) {
        const { data, error } = await supabase.rpc("resolve_login_email", { p_employee_id: login });
        if (error || !data) throw new Error(ar ? "الرقم الوظيفي غير صحيح" : "Invalid employee ID");
        loginEmail = data;
      }
      const { error } = await supabase.auth.signInWithPassword({ email: loginEmail, password });
      if (error) throw error;
      rememberEmail(loginEmail); router.push("/dashboard"); router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : ar ? "تعذر تسجيل الدخول" : "Unable to sign in"); setBusy(null);
    }
  };

  const sendRecovery = async (event: React.FormEvent) => {
    event.preventDefault();
    const login = recoveryEmail.trim().toLowerCase();
    if (!login.includes("@") || !isAllowedEmail(login)) return toast.error(ar ? "أدخل البريد الرسمي" : "Enter your company email");
    setBusy("recovery");
    try {
      if (isSupabaseConfigured) {
        const { error } = await createClient()!.auth.resetPasswordForEmail(login, { redirectTo: `${window.location.origin}/auth/callback?next=/reset-password` });
        if (error) throw error;
      } else await new Promise((resolve) => setTimeout(resolve, 350));
      setRecoverySent(true); toast.success(copy.sent);
    } catch (error) { toast.error(error instanceof Error ? error.message : ar ? "تعذر إرسال الرابط" : "Unable to send recovery link"); }
    finally { setBusy(null); }
  };

  return <main className="hub-login" dir="ltr">
    <section className="hub-login-brand">
      <div className="hub-login-brand-top"><img src="/haat-logo.png" alt="HAAT" /><span>EMPLOYEE HUB</span></div>
      <div className="hub-login-brand-copy">
        <h1>HAAT<br /><em>Employee Hub</em></h1>
        <p>One workspace for daily operations, employee services and company updates.</p>
        <div className="hub-login-office"><MapPin size={17} /><span><b>Tulkarm Office</b><small>Internal Operations Workspace</small></span></div>
      </div>
      <ul><li><CheckCircle2 size={16} /> Daily operations in one place</li><li><CheckCircle2 size={16} /> Secure employee access</li><li><CheckCircle2 size={16} /> Clear updates and requests</li></ul>
    </section>

    <section className="hub-login-main" dir={ar ? "rtl" : "ltr"}>
      <button type="button" className="hub-login-language" onClick={() => setLocale(ar ? "en" : "ar")}><Globe2 size={16} />{ar ? "English" : "العربية"}</button>
      <div className="hub-login-wrap">
        <header><span><ShieldCheck size={15} /> {isSupabaseConfigured ? (ar ? "دخول آمن" : "Secure access") : (ar ? "وضع تجريبي" : "Demo mode")}</span><h2>{copy.welcome}</h2><p>{copy.subtitle}</p></header>
        <form className="hub-login-card" onSubmit={submit}>
          <label><b>{copy.email}</b><div><Mail size={18} /><input value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="username" placeholder="you@haat.delivery" /></div></label>
          <label><span><b>{copy.password}</b><button type="button" onClick={() => { setRecoveryEmail(email.includes("@") ? email : ""); setRecoverySent(false); setRecoveryOpen(true); }}>{copy.forgot}</button></span><div><LockKeyhole size={18} /><input type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} required autoComplete="current-password" /><button type="button" className="hub-login-eye" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></label>
          <label className="hub-login-remember"><input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} />{copy.remember}</label>
          <button className="hub-login-submit" disabled={busy !== null}>{busy === "password" ? <LoaderCircle className="auth-spin" size={18} /> : <KeyRound size={18} />}{busy === "password" ? copy.loading : copy.submit}</button>
          {!isSupabaseConfigured && <div className="hub-login-demo"><span>{copy.demo}</span><div><button type="button" onClick={() => enterDemo("manager")} disabled={busy !== null}><BriefcaseBusiness size={15} />{copy.manager}</button><button type="button" onClick={() => enterDemo("employee")} disabled={busy !== null}><UserRound size={15} />{copy.employee}</button></div></div>}
        </form>
        <footer>© 2026 HAAT Delivery · Tulkarm Office</footer>
      </div>
    </section>

    {recoveryOpen && <div className="auth-modal-backdrop" dir={ar ? "rtl" : "ltr"} onMouseDown={(event) => event.target === event.currentTarget && setRecoveryOpen(false)}><section className="auth-modal" role="dialog" aria-modal="true"><button className="auth-modal-close" type="button" onClick={() => setRecoveryOpen(false)} aria-label={copy.close}><X size={20} /></button>{recoverySent ? <div className="auth-recovery-success"><i><Mail size={28} /></i><h2>{copy.sent}</h2><p>{recoveryEmail}</p><button className="login-submit" type="button" onClick={() => setRecoveryOpen(false)}>{copy.close}</button></div> : <form onSubmit={sendRecovery}><i className="auth-modal-icon"><KeyRound size={25} /></i><h2>{copy.recovery}</h2><p>{copy.recoveryText}</p><label><span>{copy.email}</span><div className="login-input-wrap"><Mail size={18} /><input autoFocus value={recoveryEmail} onChange={(event) => setRecoveryEmail(event.target.value)} /></div></label><button className="login-submit" disabled={busy === "recovery"}>{busy === "recovery" ? <LoaderCircle className="auth-spin" size={18} /> : <Mail size={18} />}{busy === "recovery" ? copy.loading : copy.send}</button></form>}</section></div>}
  </main>;
}
