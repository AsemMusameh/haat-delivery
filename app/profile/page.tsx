"use client";

import { Building2, Camera, Mail, MapPin, Phone, Save, Settings, ShieldCheck, UserRoundCog } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { useProfile } from "@/lib/hooks";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

const roleNames = { employee: "موظف", supervisor: "مشرف", manager: "مدير", admin: "مسؤول نظام" } as const;

export default function Profile() {
  const profile = useProfile();
  const [avatar, setAvatar] = useState<string>();
  const [uploading, setUploading] = useState(false);
  const [phone, setPhone] = useState("");
  const [phoneBusy, setPhoneBusy] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!profile.avatar_url) return;
    if (profile.avatar_url.startsWith("http")) { setAvatar(profile.avatar_url); return; }
    if (isSupabaseConfigured) createClient()!.storage.from("avatars").createSignedUrl(profile.avatar_url, 3600).then(({ data }) => setAvatar(data?.signedUrl));
  }, [profile.avatar_url]);

  useEffect(() => {
    if (isSupabaseConfigured) { setPhone(profile.phone || ""); return; }
    const token = window.localStorage.getItem("haat-session-token");
    if (!token) return;
    fetch("/api/account-profile", { headers: { Authorization: `Bearer ${token}` } }).then((response) => response.json()).then((data) => setPhone(data.phone || "")).catch(() => {});
  }, [profile.id, profile.phone]);

  const uploadAvatar = async (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) return toast.error("اختر ملف صورة");
    if (file.size > 3_000_000) return toast.error("حجم الصورة يجب أن يكون أقل من 3MB");
    const preview = URL.createObjectURL(file);
    setAvatar(preview);
    if (!isSupabaseConfigured) return toast.success("تم تحديث معاينة الصورة على هذا الجهاز");
    setUploading(true);
    try {
      const client = createClient()!;
      const { data: { user } } = await client.auth.getUser();
      if (!user) throw new Error("سجّل الدخول أولاً");
      const extension = file.name.split(".").pop() || "jpg";
      const path = `${user.id}/avatar-${Date.now()}.${extension}`;
      const { error } = await client.storage.from("avatars").upload(path, file, { upsert: true, contentType: file.type });
      if (error) throw error;
      const { error: updateError } = await client.from("profiles").update({ avatar_url: path }).eq("id", user.id);
      if (updateError) throw updateError;
      const { data } = await client.storage.from("avatars").createSignedUrl(path, 3600);
      setAvatar(data?.signedUrl || preview);
      toast.success("تم حفظ الصورة الشخصية");
    } catch (error) { toast.error(error instanceof Error ? error.message : "تعذر رفع الصورة"); }
    finally { setUploading(false); }
  };

  const savePhone = async () => {
    setPhoneBusy(true);
    try {
      if (isSupabaseConfigured) {
        const { error } = await createClient()!.from("profiles").update({ phone: phone.trim() || null }).eq("id", profile.id);
        if (error) throw error;
      } else {
        const token = window.localStorage.getItem("haat-session-token");
        const response = await fetch("/api/account-profile", { method: "PATCH", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token || ""}` }, body: JSON.stringify({ phone }) });
        const result = await response.json() as { error?: string; phone?: string };
        if (!response.ok) throw new Error(result.error || "تعذر حفظ رقم الهاتف");
        setPhone(result.phone || "");
      }
      toast.success("تم حفظ رقم الهاتف");
    } catch (error) { toast.error(error instanceof Error ? error.message : "تعذر حفظ رقم الهاتف"); }
    finally { setPhoneBusy(false); }
  };

  const info = [
    { label: "الرقم الوظيفي", value: profile.employee_id, icon: UserRoundCog },
    { label: "البريد الرسمي", value: profile.email, icon: Mail },
    { label: "القسم", value: profile.department?.name || "—", icon: Building2 },
    { label: "الصلاحية", value: roleNames[profile.role], icon: ShieldCheck },
    { label: "الموقع", value: "Tulkarm Office", icon: MapPin },
  ];

  return <AppShell title="ملف الموظف">
    <section className="mb-6 overflow-hidden rounded-3xl bg-gradient-to-l from-[#ff6b82] to-[#ed294d] p-6 text-white shadow-xl shadow-rose-200/40 sm:p-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <div className="relative grid size-28 place-items-center overflow-visible rounded-full border-4 border-white/60 bg-white/20 text-3xl font-black">
          {avatar ? <img src={avatar} alt="الصورة الشخصية" className="size-full rounded-full object-cover" /> : profile.full_name[0]}
          <input ref={input} hidden type="file" accept="image/*" onChange={(event) => uploadAvatar(event.target.files?.[0])} />
          <button disabled={uploading} onClick={() => input.current?.click()} className="absolute bottom-0 left-0 grid size-9 place-items-center rounded-full bg-white text-[var(--primary)] shadow-lg" aria-label="تغيير الصورة الشخصية"><Camera size={17} /></button>
        </div>
        <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h2 className="text-2xl font-black">{profile.full_name}</h2><span className="badge border-white/40 bg-white/20 text-white">نشط</span></div><p className="mt-2 text-sm text-white/90">{profile.department?.name || "HAAT"}</p><p className="mt-2 text-xs text-white/75">اضغط على أيقونة الكاميرا لإضافة أو تغيير الصورة</p></div>
        <Link href="/settings" className="btn border border-white/35 bg-white/15 text-white hover:bg-white/25"><Settings size={17} />الإعدادات</Link>
      </div>
    </section>
    <article className="card p-5 sm:p-6">
      <div className="mb-5"><h3 className="font-black">بيانات الموظف</h3><p className="text-xs text-[var(--muted)]">المعلومات الأساسية للحساب، ويمكنك إضافة رقم هاتفك أو تعديله.</p></div>
      <div className="grid gap-3 sm:grid-cols-2">
        {info.map(({ label, value, icon: Icon }) => <div className="flex items-center gap-3 rounded-2xl border border-[var(--line)] p-4" key={label}><i className="row-icon !size-10"><Icon size={17} /></i><div className="min-w-0"><p className="text-[11px] text-[var(--muted)]">{label}</p><b className="block truncate text-sm">{value}</b></div></div>)}
        <div className="flex items-center gap-3 rounded-2xl border border-[var(--line)] p-4 sm:col-span-2"><i className="row-icon !size-10"><Phone size={17} /></i><label className="min-w-0 flex-1"><span className="text-[11px] text-[var(--muted)]">رقم الهاتف</span><input dir="ltr" className="mt-1 w-full bg-transparent text-left text-sm font-bold outline-none" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="أضف رقم الهاتف" /></label><button className="btn btn-primary !min-h-0 !px-3 !py-2 text-[10px]" disabled={phoneBusy} onClick={savePhone}><Save size={14} />{phoneBusy ? "جارٍ الحفظ" : "حفظ"}</button></div>
      </div>
    </article>
  </AppShell>;
}
