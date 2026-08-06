"use client";

import { ArrowLeft, ArrowRight, Eye, EyeOff, Globe2, LockKeyhole, Mail, MailCheck, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useLocale } from "@/components/locale-provider";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export default function Login() {
  const { locale, setLocale } = useLocale();
  const isArabic = locale === "ar";
  const [email, setEmail] = useState("manager@company.test");
  const [password, setPassword] = useState("Demo1234!");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const copy = isArabic
    ? {
        welcome: "مرحباً بعودتك",
        title: "تسجيل الدخول",
        subtitle: "أدخل بيانات حسابك للوصول إلى النظام.",
        email: "الرقم الوظيفي أو البريد الإلكتروني",
        password: "كلمة المرور",
        remember: "تذكرني",
        forgot: "نسيت كلمة المرور؟",
        submit: "تسجيل الدخول",
        loading: "جارٍ تسجيل الدخول...",
        show: "إظهار كلمة المرور",
        hide: "إخفاء كلمة المرور",
        demo: "وضع العرض التجريبي مفعّل",
        employee: "جرّب حساب موظف",
        or: "أو",
        office: "مكتب طولكرم",
        rights: "جميع الحقوق محفوظة",
        google: "الدخول باستخدام Google",
        emailLink: "إرسال رابط دخول وتحقق إلى البريد",
        emailSent: "تم إرسال رابط الدخول والتحقق إلى بريدك",
      }
    : {
        welcome: "Welcome back",
        title: "Sign in",
        subtitle: "Enter your account details to access the system.",
        email: "Employee ID or company email",
        password: "Password",
        remember: "Remember me",
        forgot: "Forgot password?",
        submit: "Sign in",
        loading: "Signing in...",
        show: "Show password",
        hide: "Hide password",
        demo: "Demo mode is active",
        employee: "Try an employee account",
        or: "or",
        office: "Tulkarm Office",
        rights: "All rights reserved",
        google: "Continue with Google",
        emailLink: "Email me a secure sign-in link",
        emailSent: "A secure sign-in link was sent to your email",
      };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      if (email.includes("@")) {
        const allowed = (process.env.NEXT_PUBLIC_ALLOWED_EMAIL_DOMAINS ?? "company.test,company.com")
          .split(",")
          .map((domain) => domain.trim());
        if (!allowed.includes(email.split("@")[1]?.toLowerCase())) {
          throw new Error(isArabic ? "يسمح بالدخول باستخدام بريد الشركة الرسمي فقط" : "Use your official company email to sign in");
        }
      }

      if (!isSupabaseConfigured) {
        await new Promise((resolve) => setTimeout(resolve, 600));
        toast.success(isArabic ? "تم تسجيل الدخول إلى الوضع التجريبي" : "Signed in to demo mode");
        router.push(email.includes("manager") ? "/admin" : "/dashboard");
        return;
      }

      const supabase = createClient()!;
      let loginEmail = email;
      if (!email.includes("@")) {
        const { data, error } = await supabase.rpc("resolve_login_email", { p_employee_id: email });
        if (error || !data) throw new Error(isArabic ? "الرقم الوظيفي غير صحيح" : "Invalid employee ID");
        loginEmail = data;
      }
      const { error } = await supabase.auth.signInWithPassword({ email: loginEmail, password });
      if (error) throw error;
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : isArabic ? "تعذر تسجيل الدخول" : "Unable to sign in");
    } finally {
      setLoading(false);
    }
  };

  const forgot = async () => {
    if (!email.includes("@")) return toast.error(isArabic ? "أدخل البريد الإلكتروني أولاً" : "Enter your email first");
    if (!isSupabaseConfigured) return toast.info(isArabic ? "في النسخة المتصلة، ستصلك رسالة استعادة كلمة المرور" : "A password reset email will be sent in the connected version");
    const { error } = await createClient()!.auth.resetPasswordForEmail(email, { redirectTo: `${location.origin}/profile` });
    error
      ? toast.error(error.message)
      : toast.success(isArabic ? "تم إرسال رابط الاستعادة" : "Reset link sent");
  };

  const googleSignIn=async()=>{
    if(!isSupabaseConfigured)return toast.info(isArabic?"فعّل إعدادات Supabase وGoogle لتسجيل الدخول الحقيقي":"Connect Supabase and enable Google to use live sign-in");
    const{error}=await createClient()!.auth.signInWithOAuth({provider:"google",options:{redirectTo:`${location.origin}/dashboard`}});
    if(error)toast.error(error.message);
  };

  const emailLink=async()=>{
    if(!email.includes("@"))return toast.error(isArabic?"أدخل البريد الإلكتروني أولاً":"Enter your email first");
    if(!isSupabaseConfigured)return toast.info(isArabic?"تعمل رسالة التحقق بعد ربط خدمة البريد":"Email verification works after connecting the email service");
    const{error}=await createClient()!.auth.signInWithOtp({email,options:{emailRedirectTo:`${location.origin}/dashboard`}});
    error?toast.error(error.message):toast.success(copy.emailSent);
  };

  const DirectionArrow = isArabic ? ArrowLeft : ArrowRight;

  return (
    <main className="login-page" dir="ltr">
      <section className="login-visual" aria-label="مكتب طولكرم بإدارة عبد الله السيد">
        <img src="/tulkarm-office-4k.jpg" alt="مكتب طولكرم" />
      </section>

      <section className="login-panel" dir={isArabic ? "rtl" : "ltr"}>
        <button
          data-no-auto-translate
          type="button"
          onClick={() => setLocale(isArabic ? "en" : "ar")}
          className="login-language"
          aria-label={isArabic ? "Switch to English" : "التبديل إلى العربية"}
        >
          <Globe2 size={17} />
          {isArabic ? "English" : "العربية"}
        </button>

        <div className="login-card">
          <div className="login-logo-wrap">
            <img src="/haat-logo.png" alt="HAAT" />
          </div>
          <p className="login-kicker">{copy.welcome}</p>
          <h1>{copy.title}</h1>
          <p className="login-subtitle">{copy.subtitle}</p>

          {!isSupabaseConfigured && (
            <div className="login-demo">
              <span>{copy.demo}</span>
              <button
                type="button"
                onClick={() => {
                  setEmail("employee@company.test");
                  setPassword("Demo1234!");
                }}
              >
                {copy.employee}
              </button>
            </div>
          )}

          <form className="login-form" onSubmit={submit}>
            <label>
              <span>{copy.email}</span>
              <div className="login-input-wrap">
                <Mail size={19} />
                <input
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  autoComplete="username"
                  inputMode="email"
                />
              </div>
            </label>

            <label>
              <span>{copy.password}</span>
              <div className="login-input-wrap">
                <LockKeyhole size={19} />
                <input
                  type={show ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="login-eye"
                  aria-label={show ? copy.hide : copy.show}
                >
                  {show ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>
            </label>

            <div className="login-options">
              <label className="login-remember">
                <input type="checkbox" defaultChecked />
                <span>{copy.remember}</span>
              </label>
              <button type="button" onClick={forgot}>{copy.forgot}</button>
            </div>

            <button className="login-submit" disabled={loading}>
              <span>{loading ? copy.loading : copy.submit}</span>
              {!loading && <DirectionArrow size={19} />}
            </button>
          </form>

          <div className="login-divider"><span>{copy.or}</span></div>
          <div className="login-socials">
            <button type="button" onClick={googleSignIn} className="login-provider"><b>G</b>{copy.google}</button>
            <button type="button" onClick={emailLink} className="login-provider"><MailCheck size={19}/>{copy.emailLink}</button>
          </div>
          <div className="login-office"><MapPin size={19} />{copy.office}</div>
        </div>

        <footer>© 2026 HAAT Delivery · {copy.rights}</footer>
      </section>
    </main>
  );
}
