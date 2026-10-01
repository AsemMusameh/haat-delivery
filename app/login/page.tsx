"use client";

import { CheckCircle2, Eye, EyeOff, Globe2, KeyRound, LoaderCircle, LockKeyhole, Mail, MapPin, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useLocale } from "@/components/locale-provider";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { demoEmployees, managerEmails, rosterEmails } from "@/lib/demo-data";

const DEFAULT_PASSWORD = "123456789";
const DEFAULT_EMAIL = "mohammad.moayyad@haat.delivery";
const COMPANY_DOMAIN = "haat.delivery";

export default function Login() {
  const { locale, setLocale } = useLocale();
  const ar = locale === "ar";
  const router = useRouter();
  const [email, setEmail] = useState(DEFAULT_EMAIL);
  const [password, setPassword] = useState(DEFAULT_PASSWORD);
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [busy, setBusy] = useState<"password" | null>(null);

  const copy = ar ? {
    welcome: "أهلاً بعودتك", subtitle: "سجّل الدخول للوصول إلى مساحة عملك", email: "البريد الرسمي أو الرقم الوظيفي", password: "كلمة المرور", remember: "تذكرني", forgot: "نسيت كلمة المرور؟", submit: "تسجيل الدخول", loading: "جارٍ التحقق...",
  } : {
    welcome: "Welcome back", subtitle: "Sign in to access your workspace", email: "Email address or employee ID", password: "Password", remember: "Remember me", forgot: "Forgot password?", submit: "Sign in", loading: "Verifying...",
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const saved = window.localStorage.getItem("haat-remembered-email");
      const shouldRemember = window.localStorage.getItem("haat-remember-me") !== "false";
      setRemember(shouldRemember);
      if (saved && shouldRemember && saved.toLowerCase().endsWith(`@${COMPANY_DOMAIN}`)) {
        setEmail(saved);
      } else if (saved) {
        window.localStorage.removeItem("haat-remembered-email");
        setEmail(DEFAULT_EMAIL);
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const isAllowedEmail = (value: string) => {
    if (!value.includes("@")) return true;
    const domain = value.split("@")[1]?.toLowerCase();
    return domain === COMPANY_DOMAIN;
  };

  const rememberEmail = (value: string) => {
    window.localStorage.setItem("haat-remember-me", String(remember));
    if (remember && value.includes("@")) window.localStorage.setItem("haat-remembered-email", value);
    else window.localStorage.removeItem("haat-remembered-email");
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

  return <main className="hub-login" dir="ltr">
    <section className="hub-login-brand">
      <div className="hub-login-brand-copy">
        <h1>HAAT</h1>
        <p>One workspace for daily operations, employee services and company updates.</p>
        <div className="hub-login-office"><MapPin size={17} /><span><b>Tulkarm Office</b><small>Internal Operations Workspace</small></span></div>
      </div>
      <ul><li><CheckCircle2 size={16} /> Daily operations in one place</li><li><CheckCircle2 size={16} /> Secure employee access</li><li><CheckCircle2 size={16} /> Clear updates and requests</li></ul>
    </section>

    <section className="hub-login-main" dir={ar ? "rtl" : "ltr"}>
      <button type="button" className="hub-login-language" onClick={() => setLocale(ar ? "en" : "ar")}><Globe2 size={16} />{ar ? "English" : "العربية"}</button>
      <div className="hub-login-wrap">
        <header><span><ShieldCheck size={15} /> {ar ? "دخول الموظفين" : "Employee access"}</span><h2>{copy.welcome}</h2><p>{copy.subtitle}</p></header>
        <form className="hub-login-card" onSubmit={submit}>
          <label><b>{copy.email}</b><div><Mail size={18} /><input value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="username" placeholder="you@haat.delivery" /></div></label>
          <label><span><b>{copy.password}</b><button type="button" onClick={() => toast.info(ar ? "تواصل مع مدير الموقع لاستعادة كلمة المرور" : "Contact the site administrator to reset your password")}>{copy.forgot}</button></span><div><LockKeyhole size={18} /><input type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} required autoComplete="current-password" /><button type="button" className="hub-login-eye" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></label>
          <label className="hub-login-remember"><input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} />{copy.remember}</label>
          <button className="hub-login-submit" disabled={busy !== null}>{busy === "password" ? <LoaderCircle className="auth-spin" size={18} /> : <KeyRound size={18} />}{busy === "password" ? copy.loading : copy.submit}</button>
        </form>
        <footer><b>by: Asem Musameh</b><span>© 2026 HAAT Delivery · Tulkarm Office</span></footer>
      </div>
    </section>
  </main>;
}
