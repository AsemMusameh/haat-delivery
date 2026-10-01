"use client";

import {
  Check, CircleDollarSign, Copy, Pencil, Plus, Search, ShieldCheck, SlidersHorizontal, Trash2, X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import {
  compensationLabel, compensationOptions, compensationSituations, defaultCompensationRules, delayLabel,
  requirementLabel, situationById, triStateLabel, type CompensationRule,
} from "@/lib/compensation-policy";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export default function AdminCompensationsPage() {
  const [rules,setRules]=useState(defaultCompensationRules);
  const [query,setQuery]=useState("");
  const [situation,setSituation]=useState("all");
  const [editing,setEditing]=useState<CompensationRule|null|"new">(null);

  useEffect(()=>{if(!isSupabaseConfigured)return;createClient()!.from("compensation_rules").select("*").order("sort_order").then(({data})=>{if(data?.length)setRules(data as CompensationRule[])})},[]);

  const filtered=useMemo(()=>rules.filter(rule=>{
    const item=situationById(rule.situation);const text=`${item?.ar} ${item?.en} ${rule.notes}`.toLowerCase();
    return(situation==="all"||rule.situation===situation)&&text.includes(query.toLowerCase());
  }).sort((a,b)=>a.sort_order-b.sort_order),[rules,query,situation]);

  const save=async(rule:CompensationRule)=>{
    if(isSupabaseConfigured){const{error}=await createClient()!.from("compensation_rules").upsert(rule);if(error)throw error}
    setRules(current=>current.some(item=>item.id===rule.id)?current.map(item=>item.id===rule.id?rule:item):[...current,rule]);setEditing(null);
  };
  const remove=async(rule:CompensationRule)=>{
    if(!window.confirm(`حذف قاعدة «${situationById(rule.situation)?.ar}»؟ لن تظهر للموظفين بعد الحذف.`))return;
    if(isSupabaseConfigured){const{error}=await createClient()!.from("compensation_rules").delete().eq("id",rule.id);if(error)throw error}
    setRules(current=>current.filter(item=>item.id!==rule.id));toast.success("تم حذف القاعدة");
  };
  const toggle=async(rule:CompensationRule)=>{const next={...rule,is_active:!rule.is_active};await save(next);toast.success(next.is_active?"تم تفعيل القاعدة":"تم إيقاف القاعدة")};
  const duplicate=(rule:CompensationRule)=>setEditing({...rule,id:`rule-${Date.now()}`,sort_order:Math.max(...rules.map(item=>item.sort_order),0)+10,notes:rule.notes?`${rule.notes} (نسخة)`:"نسخة جديدة"});

  return <AppShell admin title="إدارة التعويضات" action={<button className="btn btn-primary hidden sm:flex" onClick={()=>setEditing("new")}><Plus size={17}/>قاعدة جديدة</button>}>
    <section className="admin-comp-head">
      <div><span><ShieldCheck size={15}/>سياسة HAAT · النسخة 1.0</span><h2>محرّر سياسة التعويضات</h2><p>أضف الحالات وحدود التأخير وقيمة التعويض والمتطلبات، وستظهر التغييرات مباشرة للموظفين.</p></div>
      <i><SlidersHorizontal size={32}/></i>
    </section>
    <div className="grid gap-3 sm:grid-cols-3 my-5">
      <Metric label="إجمالي القواعد" value={rules.length} tone="red"/><Metric label="القواعد الفعالة" value={rules.filter(item=>item.is_active).length} tone="green"/><Metric label="الحالات المغطاة" value={new Set(rules.map(item=>item.situation)).size} tone="gold"/>
    </div>

    <section className="card overflow-hidden">
      <div className="admin-comp-toolbar"><div><h3>قواعد السياسة</h3><p>رتّب كل سيناريو على حدة لتظهر التوصية الصحيحة في الحاسبة.</p></div><div><label><Search size={16}/><input value={query} onChange={event=>setQuery(event.target.value)} placeholder="بحث..."/></label><select className="input" value={situation} onChange={event=>setSituation(event.target.value)}><option value="all">جميع الحالات</option>{compensationSituations.map(item=><option key={item.id} value={item.id}>{item.ar}</option>)}</select><button className="btn btn-primary sm:hidden" onClick={()=>setEditing("new")}><Plus size={16}/></button></div></div>
      <div className="overflow-x-auto"><table className="admin-comp-table"><thead><tr><th>#</th><th>الحالة</th><th>التأخير</th><th>التوصيل</th><th>إعادة التحضير</th><th>التعويض</th><th>المطلوب</th><th>الحالة</th><th>إجراء</th></tr></thead><tbody>{filtered.map((rule,index)=>{const item=situationById(rule.situation);return <tr key={rule.id} className={!rule.is_active?"inactive":""}><td>{index+1}</td><td><b>{item?.ar}</b><small>{item?.descriptionAr}</small></td><td>{delayLabel(rule,true)}</td><td><span className={`tri ${rule.delivery_available}`}>{triStateLabel(rule.delivery_available,true)}</span></td><td><span className={`tri ${rule.remake_accepted}`}>{triStateLabel(rule.remake_accepted,true)}</span></td><td><b className="comp-value">{compensationLabel(rule.compensation_min,true)}</b>{rule.compensation_min!==rule.compensation_max&&<small>إلى {compensationLabel(rule.compensation_max,true)}</small>}</td><td><span className={`requirement ${rule.required_from_customer}`}>{requirementLabel(rule.required_from_customer,true)}</span></td><td><button onClick={()=>toast.promise(toggle(rule),{loading:"جارٍ التحديث...",success:"تم تحديث الحالة",error:(error)=>error.message})} className={`policy-toggle ${rule.is_active?"on":""}`}><i/><span>{rule.is_active?"فعال":"متوقف"}</span></button></td><td><div className="admin-row-actions"><button title="تعديل" onClick={()=>setEditing(rule)}><Pencil size={15}/></button><button title="نسخ" onClick={()=>duplicate(rule)}><Copy size={15}/></button><button title="حذف" className="danger" onClick={()=>remove(rule)}><Trash2 size={15}/></button></div></td></tr>})}</tbody></table></div>
      {!filtered.length&&<div className="p-10 text-center text-sm text-[var(--muted)]">لا توجد قواعد مطابقة.</div>}
    </section>
    {editing&&<RuleDialog rule={editing==="new"?undefined:editing} nextOrder={Math.max(...rules.map(item=>item.sort_order),0)+10} close={()=>setEditing(null)} save={rule=>toast.promise(save(rule),{loading:"جارٍ حفظ القاعدة...",success:"تم حفظ قاعدة التعويض",error:(error)=>error.message})}/>} 
  </AppShell>;
}

function Metric({label,value,tone}:{label:string;value:number;tone:"red"|"green"|"gold"}){return <article className={`admin-comp-metric ${tone}`}><i><CircleDollarSign size={20}/></i><div><strong>{value}</strong><span>{label}</span></div></article>}

function RuleDialog({rule,nextOrder,close,save}:{rule?:CompensationRule;nextOrder:number;close:()=>void;save:(value:CompensationRule)=>void}){
  const submit=(event:React.FormEvent<HTMLFormElement>)=>{event.preventDefault();const data=new FormData(event.currentTarget);const value=(key:string)=>String(data.get(key)||"");save({
    id:rule?.id||`rule-${Date.now()}`,situation:value("situation"),delay_min:value("delay_min")===""?null:Number(value("delay_min")),delay_max:value("delay_max")===""?null:Number(value("delay_max")),delivery_available:value("delivery_available") as CompensationRule["delivery_available"],remake_accepted:value("remake_accepted") as CompensationRule["remake_accepted"],profile_condition:value("profile_condition") as CompensationRule["profile_condition"],compensation_min:value("compensation_min") as CompensationRule["compensation_min"],compensation_max:value("compensation_max") as CompensationRule["compensation_max"],required_from_customer:value("required_from_customer") as CompensationRule["required_from_customer"],notes:value("notes"),is_active:data.get("is_active")==="on",sort_order:Number(value("sort_order"))||nextOrder,
  })};
  return <div className="admin-rule-backdrop" onMouseDown={event=>event.target===event.currentTarget&&close()}><form className="admin-rule-dialog" onSubmit={submit}><header><div><span><CircleDollarSign size={16}/>{rule?"تعديل قاعدة":"قاعدة تعويض جديدة"}</span><h2>{rule?"تحديث تفاصيل القرار":"أضف سيناريو جديدًا للسياسة"}</h2></div><button type="button" onClick={close}><X size={20}/></button></header><div className="admin-rule-body">
    <label className="wide"><span>نوع الحالة</span><select name="situation" className="input" defaultValue={rule?.situation||"late_order"}>{compensationSituations.map(item=><option key={item.id} value={item.id}>{item.ar}</option>)}</select></label>
    <label><span>التأخير من (دقيقة)</span><input name="delay_min" className="input" type="number" min="0" defaultValue={rule?.delay_min??""} placeholder="لا ينطبق"/></label><label><span>التأخير إلى (دقيقة)</span><input name="delay_max" className="input" type="number" min="0" defaultValue={rule?.delay_max??""} placeholder="مفتوح"/></label>
    <label><span>هل التوصيل متاح؟</span><select name="delivery_available" className="input" defaultValue={rule?.delivery_available||"na"}><option value="yes">نعم</option><option value="no">لا</option><option value="na">غير مطلوب</option></select></label><label><span>هل قبل الزبون الإعادة؟</span><select name="remake_accepted" className="input" defaultValue={rule?.remake_accepted||"na"}><option value="yes">نعم</option><option value="no">لا</option><option value="na">غير مطلوب</option></select></label>
    <label><span>الحد الأدنى للتعويض</span><select name="compensation_min" className="input" defaultValue={rule?.compensation_min||"zero"}>{compensationOptions.map(code=><option key={code} value={code}>{compensationLabel(code,true)}</option>)}</select></label><label><span>الحد الأعلى للتعويض</span><select name="compensation_max" className="input" defaultValue={rule?.compensation_max||"zero"}>{compensationOptions.map(code=><option key={code} value={code}>{compensationLabel(code,true)}</option>)}</select></label>
    <label><span>شرط ملف الزبون</span><select name="profile_condition" className="input" defaultValue={rule?.profile_condition||"na"}><option value="na">لا يوجد شرط</option><option value="refund_ratio">التحقق من نسبة التعويضات</option></select></label><label><span>المطلوب من الزبون</span><select name="required_from_customer" className="input" defaultValue={rule?.required_from_customer||"nothing"}><option value="nothing">لا شيء</option><option value="photo">صورة واضحة</option><option value="return_order">إعادة الطلب للمندوب</option></select></label>
    <label className="wide"><span>ملاحظات داخلية</span><textarea name="notes" className="input min-h-20 resize-none" defaultValue={rule?.notes}/></label><label><span>ترتيب القاعدة</span><input name="sort_order" className="input" type="number" defaultValue={rule?.sort_order||nextOrder}/></label><label className="rule-active"><input type="checkbox" name="is_active" defaultChecked={rule?.is_active??true}/><span><Check size={15}/>القاعدة فعالة وتظهر للموظفين</span></label>
  </div><footer><button type="button" className="btn btn-secondary" onClick={close}>إلغاء</button><button className="btn btn-primary"><Check size={17}/>حفظ القاعدة</button></footer></form></div>;
}
