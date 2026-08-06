"use client";

import {
  Calculator, Camera, CheckCircle2, CircleDollarSign, ClipboardCopy, Info, PackageCheck,
  Search, ShieldCheck, Snowflake, TimerReset, Truck, WalletCards,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { useLocale } from "@/components/locale-provider";
import {
  compensationAmount, compensationLabel, compensationSituations, defaultCompensationRules,
  delayLabel, findCompensationRule, requirementLabel, situationById, triStateLabel,
  type CompensationCategory, type CompensationRule, type TriState,
} from "@/lib/compensation-policy";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

const categoryIcons = { delay:TimerReset, quality:Snowflake, missing:PackageCheck, damaged:Camera };

export default function CompensationsPage() {
  const { locale } = useLocale();
  const ar = locale === "ar";
  const [rules, setRules] = useState(defaultCompensationRules);
  const [situation, setSituation] = useState("cold_with_delay");
  const [delay, setDelay] = useState(18);
  const [delivery, setDelivery] = useState<TriState>("yes");
  const [remake, setRemake] = useState<TriState>("no");
  const [orderTotal, setOrderTotal] = useState(100);
  const [deliveryFee, setDeliveryFee] = useState(15);
  const [itemValue, setItemValue] = useState(40);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"all" | CompensationCategory>("all");

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    createClient()!.from("compensation_rules").select("*").eq("is_active",true).order("sort_order").then(({ data }) => {
      if (data?.length) setRules(data as CompensationRule[]);
    });
  }, []);

  const selectedSituation = situationById(situation)!;
  const matched = useMemo(() => findCompensationRule(rules, situation, delay, delivery, remake), [rules, situation, delay, delivery, remake]);
  const minAmount = matched ? compensationAmount(matched.compensation_min, orderTotal, deliveryFee, itemValue) : null;
  const maxAmount = matched ? compensationAmount(matched.compensation_max, orderTotal, deliveryFee, itemValue) : null;

  const filteredSituations = compensationSituations.filter((item) => {
    const matchesCategory = category === "all" || item.category === category;
    const text = `${item.ar} ${item.en} ${item.descriptionAr} ${item.descriptionEn}`.toLowerCase();
    return matchesCategory && text.includes(query.trim().toLowerCase());
  });

  const chooseSituation = (id: string) => {
    const next = situationById(id)!;
    setSituation(id);
    if (["late_order","cancel_due_delay"].includes(id)) {
      setDelivery("na");
      setRemake("na");
    } else {
      setDelivery("yes");
      setRemake("yes");
    }
    if (!next.usesDelay) setDelay(0);
  };

  const resultText = matched
    ? `${selectedSituation.ar}: ${compensationLabel(matched.compensation_min,true)}${matched.compensation_min === matched.compensation_max ? "" : ` – ${compensationLabel(matched.compensation_max,true)}`}. المطلوب: ${requirementLabel(matched.required_from_customer,true)}.`
    : "";

  const copyResult = async () => {
    if (!resultText) return;
    await navigator.clipboard.writeText(resultText);
    toast.success(ar ? "تم نسخ توصية التعويض" : "Compensation recommendation copied");
  };

  const range = () => {
    if (!matched) return ar ? "أكمل تفاصيل الحالة" : "Complete the case details";
    if (minAmount != null && maxAmount != null) {
      if (minAmount === maxAmount) return `${Math.round(minAmount * 100) / 100} ${ar ? "شيكل" : "NIS"}`;
      return `${Math.round(minAmount * 100) / 100} – ${Math.round(maxAmount * 100) / 100} ${ar ? "شيكل" : "NIS"}`;
    }
    const min = compensationLabel(matched.compensation_min, ar);
    const max = compensationLabel(matched.compensation_max, ar);
    return matched.compensation_min === matched.compensation_max ? min : `${min} – ${max}`;
  };

  return <AppShell title={ar ? "التعويضات" : "Compensations"}>
    <section className="comp-hero">
      <div className="comp-hero-copy">
        <span><ShieldCheck size={16}/>{ar ? "سياسة HAAT المعتمدة" : "Approved HAAT policy"}</span>
        <h2>{ar ? "قرار تعويض واضح، سريع وعادل" : "A clear, fast and fair compensation decision"}</h2>
        <p>{ar ? "اختر تفاصيل الحالة لتحصل على نطاق التعويض والمتطلبات الصحيحة دون الرجوع إلى جداول معقدة." : "Select the case details to get the correct compensation range and requirements without complex tables."}</p>
        <div><b>{rules.filter(item=>item.is_active).length}</b><small>{ar ? "قاعدة تعويض" : "policy rules"}</small><b>11</b><small>{ar ? "حالة مغطاة" : "covered cases"}</small><b>1.0</b><small>{ar ? "نسخة السياسة" : "policy version"}</small></div>
      </div>
      <i><CircleDollarSign size={54}/><span>HAAT</span></i>
    </section>

    <div className="mt-6 grid items-start gap-6 xl:grid-cols-[390px_minmax(0,1fr)]">
      <aside className="comp-calculator card overflow-hidden xl:sticky xl:top-[104px]">
        <header><i><Calculator size={21}/></i><div><h3>{ar ? "حاسبة التعويض" : "Compensation calculator"}</h3><p>{ar ? "النتيجة تتحدث تلقائيًا" : "The result updates automatically"}</p></div></header>
        <div className="comp-form">
          <label><span>{ar ? "نوع الحالة" : "Situation"}</span><select className="input" value={situation} onChange={event=>chooseSituation(event.target.value)}>{compensationSituations.map(item=><option key={item.id} value={item.id}>{ar?item.ar:item.en}</option>)}</select></label>
          {selectedSituation.usesDelay && <label><span>{ar ? "مدة التأخير بالدقائق" : "Delay in minutes"}</span><div className="comp-number"><TimerReset size={17}/><input type="number" min="0" value={delay} onChange={event=>setDelay(Number(event.target.value))}/><em>{ar?"دقيقة":"min"}</em></div></label>}
          {!['late_order','cancel_due_delay'].includes(situation) && <div className="grid grid-cols-2 gap-3">
            <label><span>{ar ? "التوصيل متاح؟" : "Delivery available?"}</span><select className="input" value={delivery} onChange={event=>setDelivery(event.target.value as TriState)}><option value="yes">{ar?"نعم":"Yes"}</option><option value="no">{ar?"لا":"No"}</option><option value="na">{ar?"غير مطلوب":"N/A"}</option></select></label>
            <label><span>{ar ? "قبل إعادة التحضير؟" : "Accepted remake?"}</span><select className="input" value={remake} onChange={event=>setRemake(event.target.value as TriState)}><option value="yes">{ar?"نعم":"Yes"}</option><option value="no">{ar?"لا":"No"}</option><option value="na">{ar?"غير مطلوب":"N/A"}</option></select></label>
          </div>}
          <div className="grid grid-cols-3 gap-2">
            <label><span>{ar ? "قيمة الطلب" : "Order"}</span><input className="input" type="number" min="0" value={orderTotal} onChange={event=>setOrderTotal(Number(event.target.value))}/></label>
            <label><span>{ar ? "التوصيل" : "Delivery"}</span><input className="input" type="number" min="0" value={deliveryFee} onChange={event=>setDeliveryFee(Number(event.target.value))}/></label>
            <label><span>{ar ? "الصنف" : "Item"}</span><input className="input" type="number" min="0" value={itemValue} onChange={event=>setItemValue(Number(event.target.value))}/></label>
          </div>
        </div>

        <section className={`comp-result ${matched ? "matched" : ""}`}>
          <div className="comp-result-head"><span><WalletCards size={17}/>{ar ? "التعويض المقترح" : "Recommended compensation"}</span>{matched&&<CheckCircle2 size={20}/>}</div>
          <strong>{range()}</strong>
          {matched && <>
            <div className="comp-result-grid"><span><small>{ar?"من":"MIN"}</small><b>{compensationLabel(matched.compensation_min,ar)}</b></span><span><small>{ar?"إلى":"MAX"}</small><b>{compensationLabel(matched.compensation_max,ar)}</b></span></div>
            <p className={matched.required_from_customer==="nothing"?"ok":"required"}>{matched.required_from_customer==="photo"?<Camera size={16}/>:matched.required_from_customer==="return_order"?<Truck size={16}/>:<CheckCircle2 size={16}/>}<span><small>{ar?"المطلوب من العميل":"Required from customer"}</small><b>{requirementLabel(matched.required_from_customer,ar)}</b></span></p>
            {matched.profile_condition==="refund_ratio"&&<div className="comp-profile-note"><Info size={15}/>{ar?"تحقق من نسبة التعويضات السابقة في ملف العميل قبل الاعتماد.":"Check the customer's previous refund ratio before approval."}</div>}
            <button type="button" onClick={copyResult}><ClipboardCopy size={15}/>{ar?"نسخ التوصية":"Copy recommendation"}</button>
          </>}
        </section>
      </aside>

      <section className="min-w-0">
        <div className="comp-policy-toolbar card">
          <div><h3>{ar ? "دليل سياسة التعويضات" : "Compensation policy guide"}</h3><p>{ar ? "جميع الحالات والشروط بنسخة سهلة القراءة" : "All situations and conditions in an easy-to-read format"}</p></div>
          <label><Search size={17}/><input value={query} onChange={event=>setQuery(event.target.value)} placeholder={ar?"ابحث عن حالة...":"Search situations..."}/></label>
        </div>
        <div className="comp-tabs">
          {(["all","delay","quality","missing","damaged"] as const).map(value=><button key={value} className={category===value?"active":""} onClick={()=>setCategory(value)}>{value==="all"?(ar?"الكل":"All"):value==="delay"?(ar?"التأخير":"Delay"):value==="quality"?(ar?"الجودة والحرارة":"Quality"):value==="missing"?(ar?"النواقص":"Missing"):(ar?"التلف والأخطاء":"Damage")}</button>)}
        </div>
        <div className="space-y-4">
          {filteredSituations.map((item,index)=>{
            const Icon=categoryIcons[item.category];const items=rules.filter(rule=>rule.situation===item.id&&rule.is_active).sort((a,b)=>a.sort_order-b.sort_order);
            return <details className="comp-policy-group card" key={item.id} open={item.id===situation||index===0}>
              <summary onClick={()=>chooseSituation(item.id)}><i><Icon size={19}/></i><div><strong>{ar?item.ar:item.en}</strong><p>{ar?item.descriptionAr:item.descriptionEn}</p></div><span>{items.length} {ar?"قواعد":"rules"}</span></summary>
              <div className="comp-policy-table-wrap"><table className="comp-policy-table"><thead><tr><th>{ar?"التأخير":"Delay"}</th><th>{ar?"التوصيل متاح":"Delivery"}</th><th>{ar?"قبل الإعادة":"Remake"}</th><th>{ar?"الحد الأدنى":"Minimum"}</th><th>{ar?"الحد الأعلى":"Maximum"}</th><th>{ar?"المطلوب من العميل":"Customer requirement"}</th></tr></thead><tbody>{items.map(rule=><tr key={rule.id}><td>{delayLabel(rule,ar)}</td><td><span className={`tri ${rule.delivery_available}`}>{triStateLabel(rule.delivery_available,ar)}</span></td><td><span className={`tri ${rule.remake_accepted}`}>{triStateLabel(rule.remake_accepted,ar)}</span></td><td><b>{compensationLabel(rule.compensation_min,ar)}</b></td><td><b>{compensationLabel(rule.compensation_max,ar)}</b></td><td><span className={`requirement ${rule.required_from_customer}`}>{requirementLabel(rule.required_from_customer,ar)}</span></td></tr>)}</tbody></table></div>
            </details>})}
          {!filteredSituations.length&&<div className="card p-10 text-center text-sm text-[var(--muted)]">{ar?"لا توجد نتائج مطابقة.":"No matching situations."}</div>}
        </div>
        <div className="comp-disclaimer"><ShieldCheck size={19}/><p><b>{ar?"ملاحظة اعتماد":"Approval note"}</b><span>{ar?"التوصية مبنية على السياسة الحالية. راجع ملف العميل والاستثناءات وسجل التعويضات قبل التأكيد النهائي.":"The recommendation follows the current policy. Review the customer profile, exceptions and refund history before final approval."}</span></p></div>
      </section>
    </div>
  </AppShell>;
}
