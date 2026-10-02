"use client";

import { AlignCenter, AlignLeft, AlignRight, CalendarClock, Eye, FileUp, Image as ImageIcon, Paperclip, Pin, Send, Type, Users, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { departments } from "@/lib/demo-data";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export default function NewAnnouncement() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [textColor, setTextColor] = useState("#261b1e");
  const [textAlign, setTextAlign] = useState<"right" | "center" | "left">("right");
  const [fontSize, setFontSize] = useState(16);
  const [priority, setPriority] = useState("normal");
  const [targets, setTargets] = useState<string[]>(departments.map((department) => department.id));
  const [files, setFiles] = useState<File[]>([]);
  const [pinned, setPinned] = useState(false);
  const [ack, setAck] = useState(true);
  const [scheduled, setScheduled] = useState("");
  const [preview, setPreview] = useState(false);
  const [publishing, setPublishing] = useState(false);

  const submit = async (status: "draft" | "published" | "scheduled") => {
    if (!title.trim() || !body.trim()) return toast.error("أدخل عنوان التعميم ونصه");
    setPublishing(true);
    try {
      if (isSupabaseConfigured) {
        const client = createClient()!;
        const { data: { user } } = await client.auth.getUser();
        if (!user) throw new Error("يجب تسجيل الدخول");
        const { data: announcement, error } = await client.from("announcements").insert({
          title, body, priority, status: scheduled ? "scheduled" : status, author_id: user.id,
          is_pinned: pinned, requires_acknowledgement: ack, scheduled_at: scheduled || null,
          published_at: status === "published" && !scheduled ? new Date().toISOString() : null,
        }).select("id").single();
        if (error) throw error;
        const { error: targetError } = await client.from("announcement_targets").insert(targets.map((department_id) => ({ announcement_id: announcement.id, target_type: "department", department_id })));
        if (targetError) throw targetError;
        for (const file of files) {
          const path = `${announcement.id}/${crypto.randomUUID()}-${file.name}`;
          const { error: uploadError } = await client.storage.from("announcement-attachments").upload(path, file);
          if (uploadError) throw uploadError;
          await client.from("attachments").insert({ announcement_id: announcement.id, file_name: file.name, storage_path: path, file_type: file.type, file_size: file.size });
        }
        if (status === "published" && !scheduled) await fetch("/api/push/send", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ announcementId: announcement.id }) });
      } else await new Promise((resolve) => setTimeout(resolve, 300));
      toast.success(status === "draft" ? "تم حفظ المسودة" : scheduled ? "تمت جدولة التعميم" : "تم نشر التعميم وإرسال الإشعارات");
      setTitle(""); setBody(""); setFiles([]);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "تعذر حفظ التعميم");
    } finally {
      setPublishing(false);
    }
  };

  const allSelected = targets.length === departments.length;

  return <AppShell admin title="إنشاء تعميم جديد" action={<button onClick={() => setPreview(true)} className="btn btn-secondary hidden sm:flex"><Eye size={17}/>معاينة</button>}>
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
      <section className="space-y-5">
        <div className="card p-5 sm:p-7"><h2 className="mb-5 font-black">محتوى التعميم</h2>
          <label className="block text-xs font-bold">العنوان<input className="input mt-2" placeholder="عنوان واضح ومختصر" value={title} onChange={(event) => setTitle(event.target.value)} maxLength={140}/><span className="mt-1 block text-left text-[10px] text-[var(--muted)]">{title.length}/140</span></label>
          <label className="mt-4 block text-xs font-bold">نص التعميم
            <div className="mt-2 flex flex-wrap items-center gap-2 rounded-t-xl border border-b-0 border-[var(--line)] bg-[var(--surface-2)] p-3"><span className="px-1 text-[10px] text-[var(--muted)]">تنسيق النص</span>{["#261b1e", "#b40d31", "#1459a6", "#07865e"].map((color) => <button type="button" key={color} onClick={() => setTextColor(color)} className={`size-7 rounded-full border-2 ${textColor === color ? "border-[var(--foreground)]" : "border-white"}`} style={{ backgroundColor: color }} aria-label="لون النص"/>)}<button type="button" className="toolbar-btn" onClick={() => setTextAlign("right")}><AlignRight size={15}/></button><button type="button" className="toolbar-btn" onClick={() => setTextAlign("center")}><AlignCenter size={15}/></button><button type="button" className="toolbar-btn" onClick={() => setTextAlign("left")}><AlignLeft size={15}/></button><button type="button" className="toolbar-btn" onClick={() => setFontSize((value) => value >= 24 ? 14 : value + 2)}><Type size={15}/><span className="text-[9px]">{fontSize}</span></button></div>
            <textarea className="input min-h-[540px] resize-y rounded-t-none p-5 leading-8" style={{ color: textColor, textAlign, fontSize }} placeholder="اكتب محتوى التعميم والتعليمات المطلوبة..." value={body} onChange={(event) => setBody(event.target.value)}/>
          </label>
        </div>
        <div className="card p-5 sm:p-6"><h2 className="mb-4 flex items-center gap-2 font-black"><Paperclip size={18}/>المرفقات</h2><label className="grid cursor-pointer place-items-center rounded-2xl border-2 border-dashed border-[var(--line)] p-7 text-center hover:border-[var(--primary)]"><FileUp className="mb-2 text-[var(--primary)]"/><b className="text-sm">اسحب الملفات أو اضغط للاختيار</b><span className="mt-1 text-[11px] text-[var(--muted)]">PDF، Word، Excel، صور — حتى 10MB</span><input type="file" multiple className="hidden" accept="image/*,.pdf,.doc,.docx,.xls,.xlsx" onChange={(event) => setFiles(Array.from(event.target.files || []))}/></label>{files.map((file, index) => <div key={`${file.name}-${index}`} className="mt-3 flex items-center gap-3 rounded-xl bg-[var(--surface-2)] p-3"><ImageIcon size={18}/><span className="flex-1 truncate text-xs font-bold">{file.name}</span><button onClick={() => setFiles(files.filter((_, itemIndex) => itemIndex !== index))}><X size={16}/></button></div>)}</div>
      </section>
      <aside className="space-y-5">
        <div className="card p-5"><h2 className="mb-4 flex items-center gap-2 font-black"><Users size={18}/>المستلمون</h2><label className={`mb-3 flex items-center gap-2 rounded-xl border p-3 text-xs font-bold transition ${allSelected ? "border-[var(--primary)] bg-[var(--primary-soft)] text-[var(--primary)]" : "border-[var(--line)]"}`}><input type="checkbox" checked={allSelected} onChange={(event) => setTargets(event.target.checked ? departments.map((department) => department.id) : [])}/>جميع الأقسام</label><div className="max-h-[420px] space-y-2 overflow-y-auto">{departments.map((department) => { const selected = targets.includes(department.id); return <label key={department.id} className={`flex cursor-pointer items-center gap-2 rounded-xl border p-3 text-xs transition ${selected ? "border-[var(--primary)] bg-[var(--primary-soft)] font-bold text-[var(--primary)]" : "border-transparent hover:bg-[var(--surface-2)]"}`}><input type="checkbox" checked={selected} onChange={(event) => setTargets(event.target.checked ? [...targets, department.id] : targets.filter((id) => id !== department.id))}/>{department.name}</label>; })}</div></div>
        <div className="card p-5"><h2 className="mb-4 font-black">خيارات النشر</h2><label className="text-xs font-bold">درجة الأهمية<select className="input mt-2" value={priority} onChange={(event) => setPriority(event.target.value)}><option value="normal">عادي</option><option value="important">مهم</option><option value="urgent">عاجل</option></select></label><label className="mt-4 flex items-center gap-2 text-xs font-bold"><input type="checkbox" checked={pinned} onChange={(event) => setPinned(event.target.checked)}/><Pin size={15}/>تثبيت أعلى الصفحة</label><label className="mt-3 flex items-center gap-2 text-xs font-bold"><input type="checkbox" checked={ack} onChange={(event) => setAck(event.target.checked)}/>طلب تأكيد القراءة</label><label className="mt-4 block text-xs font-bold"><span className="flex items-center gap-2"><CalendarClock size={15}/>جدولة اختيارية</span><input className="input mt-2" type="datetime-local" value={scheduled} onChange={(event) => setScheduled(event.target.value)}/></label></div>
        <div className="grid gap-2"><button className="btn btn-primary" disabled={publishing} onClick={() => submit(scheduled ? "scheduled" : "published")}><Send size={17}/>{publishing ? "جارٍ الحفظ..." : scheduled ? "جدولة التعميم" : "نشر وإرسال إشعار"}</button><button className="btn btn-secondary" onClick={() => submit("draft")}>حفظ كمسودة</button></div>
      </aside>
    </div>
    {preview && <div className="fixed inset-0 z-[60] grid place-items-center bg-black/45 p-4" onClick={() => setPreview(false)}><div className="card max-h-[88vh] w-full max-w-4xl overflow-auto p-8" onClick={(event) => event.stopPropagation()}><div className="mb-5 flex justify-between"><h2 className="font-black">معاينة التعميم</h2><button onClick={() => setPreview(false)}><X/></button></div><span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-orange-700">{priority}</span><h3 className="mt-4 text-2xl font-black">{title || "عنوان التعميم"}</h3><p className="mt-5 whitespace-pre-wrap leading-8" style={{ color: textColor, textAlign, fontSize }}>{body || "سيظهر نص التعميم هنا..."}</p></div></div>}
  </AppShell>;
}
