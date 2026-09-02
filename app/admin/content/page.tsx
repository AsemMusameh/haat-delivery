"use client";

import { AppWindow, Check, Eye, EyeOff, Link2, MessageSquareText, Pencil, Plus, Save, Search, Trash2, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { defaultReplies, defaultTools, replyCategories, type ReplyContentType, type ReplyDepartment, type ReplyTemplate, type ToolColor, type ToolIcon, type WorkTool } from "@/lib/content-defaults";

type Tab = "replies" | "tools";
type Editor = { kind: "tool"; item: WorkTool } | { kind: "reply"; item: ReplyTemplate };

const iconOptions: { value: ToolIcon; label: string }[] = [
  { value: "dashboard", label: "داشبورد" }, { value: "store", label: "مطعم / متجر" },
  { value: "coupon", label: "كوبون" }, { value: "sheet", label: "شيت" },
  { value: "form", label: "نموذج" }, { value: "warning", label: "شكوى" },
  { value: "device", label: "جهاز" }, { value: "link", label: "رابط" },
];
const colorOptions: { value: ToolColor; label: string }[] = [
  { value: "rose", label: "أحمر HAAT" }, { value: "orange", label: "برتقالي" },
  { value: "pink", label: "زهري" }, { value: "green", label: "أخضر" },
  { value: "blue", label: "أزرق" }, { value: "purple", label: "بنفسجي" },
  { value: "slate", label: "رمادي داكن" },
];
const departmentOptions: { value: ReplyDepartment; label: string }[] = [
  { value: "chat", label: "تشات الزبائن" },
  { value: "voice", label: "فويس الزبائن" },
  { value: "both", label: "القسمان معًا" },
];
const departmentNames: Record<ReplyDepartment, string> = { chat: "تشات الزبائن", voice: "فويس الزبائن", both: "القسمان" };
const contentTypeOptions: { value: ReplyContentType; label: string }[] = [
  { value: "macro", label: "ماكرو قابل للنسخ" },
  { value: "guide", label: "قسم إرشادي" },
];

export default function AdminContentPage() {
  const [tab, setTab] = useState<Tab>("replies");
  const [tools, setTools] = useState<WorkTool[]>(defaultTools);
  const [replies, setReplies] = useState<ReplyTemplate[]>(defaultReplies);
  const [editor, setEditor] = useState<Editor>();
  const [query, setQuery] = useState("");
  const [saving, setSaving] = useState(false);
  const [connected, setConnected] = useState(true);

  useEffect(()=>{
    fetch("/api/content?admin=1",{cache:"no-store"}).then(async(response)=>{
      const data=await response.json();
      if(!response.ok)throw new Error(data.error);
      setTools(data.tools?.length?data.tools:defaultTools);setReplies(data.replies?.length?data.replies:defaultReplies);
    }).catch(()=>setConnected(false));
  },[]);

  const filteredTools=useMemo(()=>{const value=query.toLowerCase().trim();return value?tools.filter(item=>`${item.titleAr} ${item.titleEn} ${item.url}`.toLowerCase().includes(value)):tools},[tools,query]);
  const filteredReplies=useMemo(()=>{const value=query.toLowerCase().trim();return value?replies.filter(item=>`${item.title} ${item.bodyAr} ${item.bodyHe} ${item.bodyEn}`.toLowerCase().includes(value)):replies},[replies,query]);

  const newTool=():WorkTool=>({id:crypto.randomUUID(),titleAr:"",titleEn:"",descriptionAr:"",descriptionEn:"",url:"https://",icon:"link",color:"rose",sortOrder:(tools.length+1)*10,isActive:true});
  const newReply=():ReplyTemplate=>({id:crypto.randomUUID(),department:"chat",contentType:"macro",category:"guide-basics",title:"",bodyAr:"",bodyHe:"",bodyEn:"",sortOrder:(replies.length+1)*10,isActive:true});
  const updateEditor=(values:Record<string,unknown>)=>setEditor(current=>current?({...current,item:{...current.item,...values}} as Editor):current);

  const save=async(target:Editor)=>{
    if(target.kind==="tool"&&(!target.item.titleAr.trim()||!target.item.url.trim()))return toast.error("اسم الرابط والرابط نفسه مطلوبان");
    if(target.kind==="reply"&&(!target.item.title.trim()||!target.item.bodyAr.trim()))return toast.error("عنوان الرد والنص العربي مطلوبان");
    setSaving(true);
    try{
      const response=await fetch("/api/content",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(target)});
      const data=await response.json();if(!response.ok)throw new Error(data.error);
      if(target.kind==="tool")setTools(items=>[...items.filter(item=>item.id!==target.item.id),target.item].sort((a,b)=>a.sortOrder-b.sortOrder));
      else setReplies(items=>[...items.filter(item=>item.id!==target.item.id),target.item].sort((a,b)=>a.sortOrder-b.sortOrder));
      setEditor(undefined);setConnected(true);toast.success("تم حفظ التغييرات وظهورها للموظفين");
    }catch(error){toast.error(error instanceof Error?error.message:"تعذر الحفظ");}finally{setSaving(false)}
  };

  const remove=async(kind:"tool"|"reply",id:string)=>{
    if(!window.confirm("هل تريد حذف هذا العنصر نهائيًا؟"))return;
    try{const response=await fetch(`/api/content?kind=${kind}&id=${encodeURIComponent(id)}`,{method:"DELETE"});const data=await response.json();if(!response.ok)throw new Error(data.error);if(kind==="tool")setTools(items=>items.filter(item=>item.id!==id));else setReplies(items=>items.filter(item=>item.id!==id));toast.success("تم الحذف")}catch(error){toast.error(error instanceof Error?error.message:"تعذر الحذف")}
  };

  const toggle=async(kind:"tool"|"reply",item:WorkTool|ReplyTemplate)=>{
    const target={kind,item:{...item,isActive:!item.isActive}} as Editor;
    await save(target);
  };

  return <AppShell admin title="إدارة الإضافات" action={<button className="btn btn-primary hidden sm:flex" onClick={()=>setEditor(tab==="tools"?{kind:"tool",item:newTool()}:{kind:"reply",item:newReply()})}><Plus size={17}/>إضافة جديدة</button>}>
    <div className="mx-auto max-w-7xl">
      <section className="mb-6 grid gap-4 sm:grid-cols-3"><article className="card p-5"><span className="text-xs font-bold text-[var(--muted)]">الردود الجاهزة</span><strong className="mt-2 block text-3xl font-black">{replies.length}</strong><span className="mt-2 block text-[10px] text-emerald-600">{replies.filter(item=>item.isActive).length} ظاهرة للموظفين</span></article><article className="card p-5"><span className="text-xs font-bold text-[var(--muted)]">الروابط والأدوات</span><strong className="mt-2 block text-3xl font-black">{tools.length}</strong><span className="mt-2 block text-[10px] text-emerald-600">{tools.filter(item=>item.isActive).length} روابط مفعّلة</span></article><article className="card p-5"><span className="text-xs font-bold text-[var(--muted)]">حالة الحفظ</span><strong className={`mt-2 flex items-center gap-2 text-lg font-black ${connected?"text-emerald-600":"text-amber-600"}`}>{connected?<Check size={20}/>:<EyeOff size={20}/>} {connected?"متصل ومحفوظ":"اعرض النسخة الافتراضية"}</strong><span className="mt-2 block text-[10px] text-[var(--muted)]">كل تعديل يظهر لجميع الموظفين</span></article></section>
      <section className="card overflow-hidden"><header className="flex flex-col gap-4 border-b border-[var(--line)] p-4 lg:flex-row lg:items-center lg:justify-between"><div className="inline-flex w-fit rounded-2xl bg-[var(--surface-2)] p-1"><button onClick={()=>setTab("replies")} className={tab==="replies"?"flex items-center gap-2 rounded-xl bg-[var(--primary)] px-4 py-2.5 text-xs font-black text-white":"flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-black text-[var(--muted)]"}><MessageSquareText size={16}/>الردود الجاهزة</button><button onClick={()=>setTab("tools")} className={tab==="tools"?"flex items-center gap-2 rounded-xl bg-[var(--primary)] px-4 py-2.5 text-xs font-black text-white":"flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-black text-[var(--muted)]"}><AppWindow size={16}/>الروابط والأدوات</button></div><div className="flex gap-2"><label className="relative min-w-0 flex-1 lg:w-80"><Search className="absolute start-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" size={16}/><input className="input h-10 ps-9 text-xs" value={query} onChange={event=>setQuery(event.target.value)} placeholder="ابحث داخل الإضافات..."/></label><button className="btn btn-primary !px-3 !py-2 sm:hidden" onClick={()=>setEditor(tab==="tools"?{kind:"tool",item:newTool()}:{kind:"reply",item:newReply()})}><Plus size={17}/></button></div></header>
        {tab==="replies"?<div className="divide-y divide-[var(--line)]">{filteredReplies.map(item=>{const category=replyCategories.find(entry=>entry.id===item.category);return <div key={item.id} className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center"><span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-rose-50 text-lg dark:bg-rose-950/30">{category?.emoji??"💬"}</span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><b className="text-sm">{item.title}</b><span className="rounded-full bg-[var(--primary-soft)] px-2 py-1 text-[9px] font-black text-[var(--primary)]">{departmentNames[item.department ?? "chat"]}</span><span className={item.contentType==="guide"?"rounded-full bg-sky-50 px-2 py-1 text-[9px] font-black text-sky-700":"rounded-full bg-emerald-50 px-2 py-1 text-[9px] font-black text-emerald-700"}>{item.contentType==="guide"?"قسم إرشادي":"ماكرو"}</span><span className="rounded-full bg-[var(--surface-2)] px-2 py-1 text-[9px] font-bold text-[var(--muted)]">{category?.ar}</span>{!item.isActive&&<span className="rounded-full bg-amber-50 px-2 py-1 text-[9px] font-bold text-amber-700">مخفي</span>}</div><p className="mt-1 truncate text-xs text-[var(--muted)]">{item.bodyAr}</p></div><div className="flex items-center gap-1"><button className="toolbar-btn" onClick={()=>toggle("reply",item)} title={item.isActive?"إخفاء":"إظهار"}>{item.isActive?<Eye size={16}/>:<EyeOff size={16}/>}</button><button className="toolbar-btn" onClick={()=>setEditor({kind:"reply",item})} title="تعديل"><Pencil size={16}/></button><button className="toolbar-btn text-red-600" onClick={()=>remove("reply",item.id)} title="حذف"><Trash2 size={16}/></button></div></div>})}</div>:<div className="divide-y divide-[var(--line)]">{filteredTools.map(item=><div key={item.id} className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center"><span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[var(--primary-soft)] text-[var(--primary)]"><Link2 size={19}/></span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><b className="text-sm">{item.titleAr}</b><span className="text-[10px] text-[var(--muted)]">{item.titleEn}</span>{!item.isActive&&<span className="rounded-full bg-amber-50 px-2 py-1 text-[9px] font-bold text-amber-700">مخفي</span>}</div><p dir="ltr" className="mt-1 truncate text-left text-[10px] text-[var(--muted)]">{item.url}</p></div><div className="flex items-center gap-1"><button className="toolbar-btn" onClick={()=>toggle("tool",item)} title={item.isActive?"إخفاء":"إظهار"}>{item.isActive?<Eye size={16}/>:<EyeOff size={16}/>}</button><button className="toolbar-btn" onClick={()=>setEditor({kind:"tool",item})} title="تعديل"><Pencil size={16}/></button><button className="toolbar-btn text-red-600" onClick={()=>remove("tool",item.id)} title="حذف"><Trash2 size={16}/></button></div></div>)}</div>}
      </section>
    </div>

    {editor&&<div className="fixed inset-0 z-[100] grid place-items-center bg-slate-950/55 p-3 backdrop-blur-sm"><div className="max-h-[94vh] w-full max-w-3xl overflow-y-auto rounded-[26px] bg-[var(--surface)] shadow-2xl"><header className="sticky top-0 z-10 flex items-center justify-between border-b border-[var(--line)] bg-[var(--surface)] p-5"><div><h2 className="text-lg font-black">{editor.kind==="tool"?"تعديل الرابط أو الأداة":"تعديل الرد الجاهز"}</h2><p className="mt-1 text-[10px] text-[var(--muted)]">يمكنك تعديل جميع التفاصيل ثم الضغط على حفظ</p></div><button className="toolbar-btn" onClick={()=>setEditor(undefined)} aria-label="إغلاق"><X size={18}/></button></header><div className="space-y-4 p-5">
      {editor.kind==="tool"?<><div className="grid gap-4 sm:grid-cols-2"><Field label="الاسم بالعربية"><input className="input" value={editor.item.titleAr} onChange={event=>updateEditor({titleAr:event.target.value})}/></Field><Field label="الاسم بالإنجليزية"><input className="input" dir="ltr" value={editor.item.titleEn} onChange={event=>updateEditor({titleEn:event.target.value})}/></Field></div><Field label="الرابط"><input className="input" dir="ltr" value={editor.item.url} onChange={event=>updateEditor({url:event.target.value})}/></Field><div className="grid gap-4 sm:grid-cols-2"><Field label="الوصف بالعربية"><textarea className="input min-h-24" value={editor.item.descriptionAr} onChange={event=>updateEditor({descriptionAr:event.target.value})}/></Field><Field label="الوصف بالإنجليزية"><textarea className="input min-h-24" dir="ltr" value={editor.item.descriptionEn} onChange={event=>updateEditor({descriptionEn:event.target.value})}/></Field></div><div className="grid gap-4 sm:grid-cols-3"><Field label="الأيقونة"><select className="input" value={editor.item.icon} onChange={event=>updateEditor({icon:event.target.value})}>{iconOptions.map(option=><option key={option.value} value={option.value}>{option.label}</option>)}</select></Field><Field label="اللون"><select className="input" value={editor.item.color} onChange={event=>updateEditor({color:event.target.value})}>{colorOptions.map(option=><option key={option.value} value={option.value}>{option.label}</option>)}</select></Field><Field label="الترتيب"><input className="input" type="number" value={editor.item.sortOrder} onChange={event=>updateEditor({sortOrder:Number(event.target.value)})}/></Field></div></>:<><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><Field label="عنوان العنصر"><input className="input" value={editor.item.title} onChange={event=>updateEditor({title:event.target.value})}/></Field><Field label="نوع المحتوى"><select className="input" value={editor.item.contentType ?? "macro"} onChange={event=>updateEditor({contentType:event.target.value})}>{contentTypeOptions.map(option=><option key={option.value} value={option.value}>{option.label}</option>)}</select></Field><Field label="قسم الموظفين"><select className="input" value={editor.item.department ?? "chat"} onChange={event=>updateEditor({department:event.target.value})}>{departmentOptions.map(option=><option key={option.value} value={option.value}>{option.label}</option>)}</select></Field><Field label="نوع الحالة"><select className="input" value={editor.item.category} onChange={event=>updateEditor({category:event.target.value})}>{replyCategories.map(category=><option key={category.id} value={category.id}>{category.emoji} {category.ar}</option>)}</select></Field></div><Field label="النص بالعربية"><textarea className="input min-h-32 leading-7" value={editor.item.bodyAr} onChange={event=>updateEditor({bodyAr:event.target.value})}/></Field><Field label="النص بالعبرية"><textarea className="input min-h-32 leading-7" dir="rtl" value={editor.item.bodyHe} onChange={event=>updateEditor({bodyHe:event.target.value})}/></Field><Field label="النص بالإنجليزية"><textarea className="input min-h-32 leading-7" dir="ltr" value={editor.item.bodyEn} onChange={event=>updateEditor({bodyEn:event.target.value})}/></Field><Field label="الترتيب"><input className="input w-40" type="number" value={editor.item.sortOrder} onChange={event=>updateEditor({sortOrder:Number(event.target.value)})}/></Field></>}
      <label className="flex items-center gap-3 rounded-2xl border border-[var(--line)] bg-[var(--surface-2)] p-4"><input type="checkbox" checked={editor.item.isActive} onChange={event=>updateEditor({isActive:event.target.checked})} className="size-4 accent-[var(--primary)]"/><span><b className="block text-xs">إظهار للموظفين</b><small className="mt-1 block text-[10px] text-[var(--muted)]">عند إلغاء التفعيل يبقى العنصر محفوظًا لكنه لا يظهر للموظف</small></span></label>
    </div><footer className="sticky bottom-0 flex justify-end gap-2 border-t border-[var(--line)] bg-[var(--surface)] p-5"><button className="btn btn-secondary" onClick={()=>setEditor(undefined)}>إلغاء</button><button className="btn btn-primary min-w-32" disabled={saving} onClick={()=>save(editor)}><Save size={17}/>{saving?"جاري الحفظ...":"حفظ التغييرات"}</button></footer></div></div>}
  </AppShell>;
}

function Field({label,children}:{label:string;children:React.ReactNode}){return <label className="block"><span className="mb-2 block text-xs font-black">{label}</span>{children}</label>}
