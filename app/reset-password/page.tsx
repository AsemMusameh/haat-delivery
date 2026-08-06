"use client";

import { ArrowLeft, ArrowRight, CheckCircle2, Eye, EyeOff, KeyRound, LoaderCircle, LockKeyhole, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useLocale } from "@/components/locale-provider";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const { locale } = useLocale();
  const ar = locale === "ar";
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const Arrow = ar ? ArrowLeft : ArrowRight;

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (password.length < 8) return toast.error(ar ? "كلمة المرور يجب أن تتكون من 8 أحرف على الأقل" : "Password must be at least 8 characters");
    if (password !== confirm) return toast.error(ar ? "كلمتا المرور غير متطابقتين" : "Passwords do not match");
    setBusy(true);
    try {
      if (isSupabaseConfigured) {
        const { error } = await createClient()!.auth.updateUser({ password });
        if (error) throw error;
      } else {
        await new Promise((resolve) => setTimeout(resolve, 650));
      }
      setDone(true);
      toast.success(ar ? "تم تحديث كلمة المرور" : "Password updated");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : ar ? "تعذر تحديث كلمة المرور" : "Unable to update password");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="reset-page" dir={ar ? "rtl" : "ltr"}>
      <section className="reset-card">
        <img src="/haat-logo.png" alt="HAAT" />
        {done ? (
          <div className="reset-success">
            <i><CheckCircle2 size={32} /></i>
            <h1>{ar ? "كلمة المرور جاهزة" : "Your password is ready"}</h1>
            <p>{ar ? "تم حفظ كلمة المرور الجديدة. يمكنك الآن الدخول إلى حسابك بأمان." : "Your new password has been saved. You can now sign in securely."}</p>
            <button className="login-submit" onClick={() => router.push("/login")}><span>{ar ? "العودة لتسجيل الدخول" : "Back to sign in"}</span><Arrow size={18} /></button>
          </div>
        ) : (
          <>
            <span className="auth-eyebrow"><ShieldCheck size={15} />{ar ? "خطوة آمنة" : "Secure step"}</span>
            <h1>{ar ? "اختر كلمة مرور جديدة" : "Choose a new password"}</h1>
            <p>{ar ? "استخدم 8 أحرف على الأقل، ويفضل دمج الأحرف والأرقام والرموز." : "Use at least 8 characters, preferably with letters, numbers and symbols."}</p>
            <form onSubmit={submit} className="login-form">
              <label><span>{ar ? "كلمة المرور الجديدة" : "New password"}</span><div className="login-input-wrap"><LockKeyhole size={19} /><input type={show ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" required /><button type="button" className="login-eye" onClick={() => setShow(!show)}>{show ? <EyeOff size={19} /> : <Eye size={19} />}</button></div></label>
              <label><span>{ar ? "تأكيد كلمة المرور" : "Confirm password"}</span><div className="login-input-wrap"><KeyRound size={19} /><input type={show ? "text" : "password"} value={confirm} onChange={(event) => setConfirm(event.target.value)} autoComplete="new-password" required /></div></label>
              <button className="login-submit" disabled={busy}>{busy ? <LoaderCircle className="auth-spin" size={19} /> : <KeyRound size={18} />}<span>{busy ? (ar ? "جارٍ الحفظ..." : "Saving...") : (ar ? "حفظ كلمة المرور" : "Save password")}</span></button>
            </form>
            <Link href="/login" className="reset-back">{ar ? "العودة لتسجيل الدخول" : "Back to sign in"}</Link>
          </>
        )}
      </section>
    </main>
  );
}
