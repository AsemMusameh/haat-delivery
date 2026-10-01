"use client";

import { AlertTriangle, ExternalLink, FileWarning, LoaderCircle, Send, UserRound } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import type { OrderComplaint } from "@/lib/complaint-store";
import { demoEmployees, departmentHeadEmails } from "@/lib/demo-data";

const headers = () => ({"Content-Type":"application/json",Authorization:`Bearer ${window.localStorage.getItem("haat-session-token") || ""}`});

export default function OrderComplaintsPage() {
  const [items,setItems] = useState<OrderComplaint[]>([]);
  const [saving,setSaving] = useState(false);
  const [form,setForm] = useState({orderNumber:"",employeeName:"",description:"",chatUrl:"",recipientId:""});
  const recipients = useMemo(() => demoEmployees.filter((employee) => employee.role === "supervisor" || ["manager","admin"].includes(employee.role) || employee.department_id === "quality-assurance"),[]);
  const load = () => fetch("/api/order-complaints",{headers:headers()}).then(async(response) => { const data = await response.json(); if (!response.ok) throw new Error(data.error); setItems(data.complaints || []); }).catch((error) => toast.error(error.message || "تعذر تحميل الشكاوى"));
  useEffect(() => { void load(); },[]);
  const submit = async () => {
    if (!form.orderNumber.trim() || !form.employeeName.trim() || !form.description.trim() || !form.recipientId) return toast.error("أكمل جميع الحقول المطلوبة");
    setSaving(true);
    try { const response = await fetch("/api/order-complaints",{method:"POST",headers:headers(),body:JSON.stringify(form)}); const data = await response.json(); if (!response.ok) throw new Error(data.error); setItems((current) => [data.complaint,...current]); setForm({orderNumber:"",employeeName:"",description:"",chatUrl:"",recipientId:""}); toast.success("تم إرسال شكوى الطلبية للجهة المختارة"); }
    catch(error){ toast.error(error instanceof Error ? error.message : "تعذر إرسال الشكوى"); }
    finally { setSaving(false); }
  };
  return <AppShell title="شكوى طلبية"><div className="mx-auto max-w-6xl space-y-6">
    <section className="page-intro"><div className="page-intro-copy"><i><FileWarning size={25}/></i><div><span>متابعة الأخطاء التشغيلية</span><h2>شكوى طلبية</h2><p>في حال حدث خطأ ولم يُكمل الموظف التوجّه المطلوب، ارفع التفاصيل هنا للمتابعة.</p></div></div></section>
    <section className="card p-5 sm:p-6"><div className="mb-5 flex items-start gap-3 rounded-2xl bg-amber-50 p-4 text-xs leading-6 text-amber-900 dark:bg-amber-950/20 dark:text-amber-100"><AlertTriangle className="mt-0.5 shrink-0" size={18}/>اكتب رقم الطلبية واسم الموظف المقصود، وأضف رابط محادثة التشات إن وُجد، ثم اختر مسؤول الشفت أو الجودة أو المدير.</div><div className="grid gap-4 md:grid-cols-2"><label className="text-xs font-black">رقم الطلبية<input dir="ltr" className="input mt-2 text-left" value={form.orderNumber} onChange={(event)=>setForm({...form,orderNumber:event.target.value})} placeholder="Order ID"/></label><label className="text-xs font-black">اسم الموظف المقصود<input className="input mt-2" value={form.employeeName} onChange={(event)=>setForm({...form,employeeName:event.target.value})} placeholder="الاسم الكامل"/></label><label className="text-xs font-black md:col-span-2">وصف الخطأ<textarea className="input mt-2 min-h-36 leading-7" value={form.description} onChange={(event)=>setForm({...form,description:event.target.value})} placeholder="اشرح التوجّه المطلوب وما الذي لم يتم تنفيذه..."/></label><label className="text-xs font-black">رابط محادثة التشات<input dir="ltr" className="input mt-2 text-left" value={form.chatUrl} onChange={(event)=>setForm({...form,chatUrl:event.target.value})} placeholder="https://..."/></label><label className="text-xs font-black">إرسال إلى<select className="input mt-2" value={form.recipientId} onChange={(event)=>setForm({...form,recipientId:event.target.value})}><option value="">اختر الشخص المسؤول</option>{recipients.map((employee)=><option key={employee.id} value={employee.id}>{employee.full_name} — {employee.role === "supervisor" ? "مسؤول شفت" : employee.department_id === "quality-assurance" ? "الجودة" : departmentHeadEmails.has(employee.email.toLowerCase()) ? "مسؤول قسم" : "المدير"}</option>)}</select></label></div><button className="btn btn-primary mt-5" onClick={submit} disabled={saving}>{saving?<LoaderCircle className="animate-spin" size={17}/>:<Send size={17}/>}إرسال الشكوى</button></section>
    <section className="space-y-3"><h3 className="font-black">الشكاوى المرتبطة بحسابك</h3>{items.length ? items.map((item)=><article className="card p-5" key={item.id}><div className="flex flex-wrap items-start gap-3"><span className="rounded-full bg-[var(--primary-soft)] px-3 py-1 text-[10px] font-black text-[var(--primary)]">طلبية {item.orderNumber}</span><span className="badge">{item.status === "new" ? "جديدة" : "تمت المراجعة"}</span><span className="mr-auto text-[10px] text-[var(--muted)]">{new Date(item.createdAt).toLocaleString("ar-PS")}</span></div><h4 className="mt-4 font-black">الموظف: {item.employeeName}</h4><p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-[var(--muted)]">{item.description}</p><footer className="mt-4 flex flex-wrap items-center gap-3 border-t border-[var(--line)] pt-4 text-xs"><span className="flex items-center gap-1"><UserRound size={14}/>إلى {item.recipientName} — {item.recipientLabel}</span>{item.chatUrl&&<a href={item.chatUrl} target="_blank" rel="noreferrer" className="mr-auto flex items-center gap-1 font-black text-[var(--primary)]"><ExternalLink size={14}/>فتح محادثة التشات</a>}</footer></article>) : <div className="card p-8 text-center text-sm text-[var(--muted)]">لا توجد شكاوى مرتبطة بحسابك حتى الآن.</div>}</section>
  </div></AppShell>;
}
