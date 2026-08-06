"use client";

import {
  Calculator, Camera, Check, CheckCircle2, CircleDollarSign, ClipboardCopy, Info,
  PackageCheck, RotateCcw, Search, ShieldCheck, Snowflake, TimerReset, Truck,
  WalletCards, X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { useLocale } from "@/components/locale-provider";
import {
  compensationAmount, compensationLabel, compensationSituations, couponPolicy, defaultCompensationRules,
  delayLabel, findCompensationRule, requirementLabel, situationById, triStateLabel,
  type CompensationCategory, type CompensationRule, type TriState,
} from "@/lib/compensation-policy";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

const categoryIcons = { delay:TimerReset, quality:Snowflake, missing:PackageCheck, damaged:Camera };
const categoryCopy = {
  delay:{ar:"تأخير أو إلغاء",en:"Delay or cancellation",hintAr:"الطلب تأخر أو العميل طلب إلغاءه",hintEn:"The order is late or was cancelled"},
  quality:{ar:"الطلب بارد",en:"Cold order",hintAr:"مشكلة حرارة مع أو بدون تأخير",hintEn:"Temperature issue with or without delay"},
  missing:{ar:"صنف ناقص",en:"Missing item",hintAr:"وجبة رئيسية أو صنف جانبي ناقص",hintEn:"A main meal or side item is missing"},
  damaged:{ar:"تالف أو خاطئ",en:"Damaged or wrong",hintAr:"تلف، انسكاب أو تبديل في الطلب",hintEn:"Damage, spill or order mix-up"},
};
const orderedStates:TriState[]=["yes","no","na"];

export default function CompensationsPage() {
  const { locale } = useLocale();
  const ar = locale === "ar";
  const [rules, setRules] = useState(defaultCompensationRules);
  const [issueCategory,setIssueCategory]=useState<CompensationCategory>("quality");
  const [situation, setSituation] = useState("cold_with_delay");
  const [delay, setDelay] = useState(11);
  const [delivery, setDelivery] = useState<TriState>("yes");
  const [remake, setRemake] = useState<TriState>("no");
  const [orderTotal, setOrderTotal] = useState(100);
  const [deliveryFee, setDeliveryFee] = useState(15);
  const [itemValue, setItemValue] = useState(40);
  const [query, setQuery] = useState("");
  const [policyCategory, setPolicyCategory] = useState<"all" | CompensationCategory>("all");

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    createClient()!.from("compensation_rules").select("*").eq("is_active",true).order("sort_order").then(({ data }) => {
      if (data?.length) setRules(data as CompensationRule[]);
    });
  }, []);

  const selectedSituation = situationById(situation)!;
  const situationRules=useMemo(()=>rules.filter(rule=>rule.situation===situation&&rule.is_active).sort((a,b)=>a.sort_order-b.sort_order),[rules,situation]);
  const delayRules=useMemo(()=>situationRules.filter(rule=>rule.delay_min==null||(delay>=rule.delay_min&&(rule.delay_max==null||delay<=rule.delay_max))),[situationRules,delay]);
  const deliveryOptions=useMemo(()=>orderedStates.filter(value=>delayRules.some(rule=>rule.delivery_available===value)),[delayRules]);
  const remakeOptions=useMemo(()=>orderedStates.filter(value=>delayRules.some(rule=>rule.delivery_available===delivery&&rule.remake_accepted===value)),[delayRules,delivery]);
  const delayOptions=useMemo(()=>{
    const seen=new Set<string>();return situationRules.filter(rule=>{const key=`${rule.delay_min}-${rule.delay_max}`;if(seen.has(key))return false;seen.add(key);return true});
  },[situationRules]);
  const matched = useMemo(() => findCompensationRule(rules, situation, delay, delivery, remake), [rules, situation, delay, delivery, remake]);
  const minAmount = matched ? compensationAmount(matched.compensation_min, orderTotal, deliveryFee, itemValue) : null;
  const maxAmount = matched ? compensationAmount(matched.compensation_max, orderTotal, deliveryFee, itemValue) : null;

  const resultCodes=matched?[matched.compensation_min,matched.compensation_max]:[];
  const needsOrder=resultCodes.some(code=>code.startsWith("order")||code.startsWith("total"));
  const needsDelivery=resultCodes.some(code=>code==="df"||code.startsWith("df")||code.includes("_df"));
  const needsItem=resultCodes.some(code=>code.startsWith("item"));

  const filteredSituations = compensationSituations.filter((item) => {
    const matchesCategory = policyCategory === "all" || item.category === policyCategory;
    const text = `${item.ar} ${item.en} ${item.descriptionAr} ${item.descriptionEn}`.toLowerCase();
    return matchesCategory && text.includes(query.trim().toLowerCase());
  });

  const candidatesFor=(id:string,nextDelay:number)=>rules.filter(rule=>rule.situation===id&&rule.is_active&&(rule.delay_min==null||(nextDelay>=rule.delay_min&&(rule.delay_max==null||nextDelay<=rule.delay_max))));
  const alignAnswers=(id:string,nextDelay:number,preferredDelivery:TriState=delivery,preferredRemake:TriState=remake)=>{
    const candidates=candidatesFor(id,nextDelay);
    const deliveries=orderedStates.filter(value=>candidates.some(rule=>rule.delivery_available===value));
    const nextDelivery=deliveries.includes(preferredDelivery)?preferredDelivery:(deliveries[0]||"na");
    const remakes=orderedStates.filter(value=>candidates.some(rule=>rule.delivery_available===nextDelivery&&rule.remake_accepted===value));
    const nextRemake=remakes.includes(preferredRemake)?preferredRemake:(remakes[0]||"na");
    setDelay(nextDelay);setDelivery(nextDelivery);setRemake(nextRemake);
  };
  const chooseCategory=(value:CompensationCategory)=>{
    setIssueCategory(value);const first=compensationSituations.find(item=>item.category===value)!;chooseSituation(first.id);
  };
  const chooseSituation = (id: string) => {
    const next = situationById(id)!;setSituation(id);setIssueCategory(next.category);
    const firstRule=rules.filter(rule=>rule.situation===id&&rule.is_active).sort((a,b)=>a.sort_order-b.sort_order)[0];
    alignAnswers(id,firstRule?.delay_min??0,firstRule?.delivery_available??"na",firstRule?.remake_accepted??"na");
  };
  const chooseDelay=(rule:CompensationRule)=>alignAnswers(situation,rule.delay_min??0);
  const chooseDelivery=(value:TriState)=>{
    const remakes=orderedStates.filter(option=>delayRules.some(rule=>rule.delivery_available===value&&rule.remake_accepted===option));
    setDelivery(value);setRemake(remakes.includes(remake)?remake:(remakes[0]||"na"));
  };

  const resultText = matched
    ? `${selectedSituation.ar}: ${compensationLabel(matched.compensation_min,true)}${matched.compensation_min === matched.compensation_max ? "" : ` – ${compensationLabel(matched.compensation_max,true)}`}. المطلوب: ${requirementLabel(matched.required_from_customer,true)}. القسيمة من ${couponPolicy.minimum} إلى ${couponPolicy.maximum} شيكل، ويُراجع ملف العميل عند وجود ${couponPolicy.profileOrderThreshold} طلبات أو أكثر.`
    : "";
  const copyResult = async () => {
    if (!resultText) return;
    await navigator.clipboard.writeText(resultText);
    toast.success(ar ? "تم نسخ توصية التعويض" : "Compensation recommendation copied");
  };
  const range = () => {
    if (!matched) return ar ? "اختر التفاصيل" : "Select the details";
    if (minAmount != null && maxAmount != null) {
      if (minAmount === maxAmount) return `${Math.round(minAmount * 100) / 100} ${ar ? "شيكل" : "NIS"}`;
      return `${Math.round(minAmount * 100) / 100} – ${Math.round(maxAmount * 100) / 100} ${ar ? "شيكل" : "NIS"}`;
    }
    const min = compensationLabel(matched.compensation_min, ar);const max = compensationLabel(matched.compensation_max, ar);
    return matched.compensation_min === matched.compensation_max ? min : `${min} – ${max}`;
  };
  const reset=()=>{setIssueCategory("quality");setSituation("cold_with_delay");alignAnswers("cold_with_delay",11,"yes","no");setOrderTotal(100);setDeliveryFee(15);setItemValue(40)};

  return <AppShell title={ar ? "التعويضات" : "Compensations"}>
    <section className="comp-hero">
      <div className="comp-hero-copy"><span><ShieldCheck size={16}/>{ar ? "سياسة HAAT المعتمدة" : "Approved HAAT policy"}</span><h2>{ar ? "قرار تعويض واضح، سريع وعادل" : "A clear, fast and fair compensation decision"}</h2><p>{ar ? "اختر تفاصيل الحالة لتحصل على نطاق التعويض والمتطلبات الصحيحة دون الرجوع إلى جداول معقدة." : "Select the case details to get the correct compensation range and requirements without complex tables."}</p><div><b>{rules.filter(item=>item.is_active).length}</b><small>{ar ? "قاعدة تعويض" : "policy rules"}</small><b>11</b><small>{ar ? "حالة مغطاة" : "covered cases"}</small><b>1.0</b><small>{ar ? "نسخة السياسة" : "policy version"}</small></div></div>
      <i><CircleDollarSign size={54}/><span>HAAT</span></i>
    </section>

    <section className="smart-calculator card">
      <header className="smart-calculator-head"><div><span><Calculator size={16}/>{ar?"مساعد القرار الذكي":"Smart decision assistant"}</span><h3>{ar?"أخبرنا ماذا حدث فقط":"Just tell us what happened"}</h3><p>{ar?"سنظهر لك الأسئلة التي تحتاجها هذه الحالة فقط.":"We only show questions relevant to this case."}</p></div><button type="button" onClick={reset}><RotateCcw size={15}/>{ar?"ابدأ من جديد":"Start over"}</button></header>
      <div className="smart-progress"><span className="done"><i>1</i>{ar?"المشكلة":"Issue"}</span><b/><span className="done"><i>2</i>{ar?"الحالة":"Case"}</span><b/><span className="done"><i>3</i>{ar?"النتيجة":"Result"}</span></div>
      <div className="smart-calculator-body">
        <div className="smart-questions">
          <section className="wizard-step"><header><i>1</i><div><strong>{ar?"شو المشكلة الرئيسية؟":"What is the main issue?"}</strong><span>{ar?"اختر أقرب وصف":"Choose the closest description"}</span></div></header><div className="issue-cards">{(Object.keys(categoryCopy) as CompensationCategory[]).map(value=>{const Icon=categoryIcons[value];const copy=categoryCopy[value];return <button key={value} type="button" className={issueCategory===value?"active":""} onClick={()=>chooseCategory(value)}><i><Icon size={20}/></i><span><b>{ar?copy.ar:copy.en}</b><small>{ar?copy.hintAr:copy.hintEn}</small></span>{issueCategory===value&&<CheckCircle2 size={17}/>}</button>})}</div></section>
          <section className="wizard-step"><header><i>2</i><div><strong>{ar?"حدد الحالة":"Choose the specific case"}</strong><span>{ar?"خيار واحد فقط":"One choice only"}</span></div></header><div className="situation-pills">{compensationSituations.filter(item=>item.category===issueCategory).map(item=><button type="button" key={item.id} className={situation===item.id?"active":""} onClick={()=>chooseSituation(item.id)}>{ar?item.ar:item.en}{situation===item.id&&<Check size={14}/>}</button>)}</div></section>
          <section className="wizard-step"><header><i>3</i><div><strong>{ar?"تفاصيل سريعة":"A few quick details"}</strong><span>{ar?"لن نسألك إلا ما يؤثر على القرار":"Only questions that affect the result"}</span></div></header><div className="quick-questions">
            {selectedSituation.usesDelay&&<div className="quick-question"><label>{ar?"كم مدة التأخير؟":"How long was the delay?"}</label><div className="delay-choices">{delayOptions.map(rule=><button type="button" key={`${rule.delay_min}-${rule.delay_max}`} className={delay>=Number(rule.delay_min)&&(rule.delay_max==null||delay<=rule.delay_max)?"active":""} onClick={()=>chooseDelay(rule)}>{delayLabel(rule,ar)}</button>)}</div></div>}
            {deliveryOptions.some(value=>value!=="na")&&<div className="quick-question"><label>{ar?"هل إعادة التوصيل متاحة؟":"Is redelivery available?"}</label><div className="yes-no-choices">{deliveryOptions.filter(value=>value!=="na").map(value=><button type="button" key={value} className={`${value} ${delivery===value?"active":""}`} onClick={()=>chooseDelivery(value)}>{value==="yes"?<Check size={17}/>:<X size={17}/>}<span>{triStateLabel(value,ar)}</span></button>)}</div></div>}
            {remakeOptions.some(value=>value!=="na")&&<div className="quick-question"><label>{ar?"هل وافق العميل على إعادة التحضير؟":"Did the customer accept a remake?"}</label><div className="yes-no-choices">{remakeOptions.filter(value=>value!=="na").map(value=><button type="button" key={value} className={`${value} ${remake===value?"active":""}`} onClick={()=>setRemake(value)}>{value==="yes"?<Check size={17}/>:<X size={17}/>}<span>{triStateLabel(value,ar)}</span></button>)}</div></div>}
            {(needsOrder||needsDelivery||needsItem)&&<div className="money-question"><div><WalletCards size={17}/><span><b>{ar?"أدخل القيمة ليظهر المبلغ الدقيق":"Enter values for an exact amount"}</b><small>{ar?"فقط الحقول المستخدمة في هذه الحالة":"Only fields used by this rule"}</small></span></div><div className="money-fields">{needsOrder&&<label><span>{ar?"قيمة الطلب":"Order total"}</span><div><input type="number" min="0" value={orderTotal} onChange={event=>setOrderTotal(Number(event.target.value))}/><em>{ar?"₪":"NIS"}</em></div></label>}{needsDelivery&&<label><span>{ar?"قيمة التوصيل":"Delivery fee"}</span><div><input type="number" min="0" value={deliveryFee} onChange={event=>setDeliveryFee(Number(event.target.value))}/><em>{ar?"₪":"NIS"}</em></div></label>}{needsItem&&<label><span>{ar?"قيمة الصنف":"Item value"}</span><div><input type="number" min="0" value={itemValue} onChange={event=>setItemValue(Number(event.target.value))}/><em>{ar?"₪":"NIS"}</em></div></label>}</div></div>}
          </div></section>
        </div>

        <aside className={`smart-result ${matched?"matched":""}`}>
          <div className="smart-result-badge"><CheckCircle2 size={18}/>{ar?"وجدنا القاعدة المناسبة":"Matching rule found"}</div>
          <div className="smart-result-icon"><CircleDollarSign size={31}/></div>
          <span>{ar?"التعويض المقترح":"Recommended compensation"}</span><strong>{range()}</strong>
          {matched&&<>
            <div className="smart-result-summary"><p><small>{ar?"الحالة":"Case"}</small><b>{ar?selectedSituation.ar:selectedSituation.en}</b></p>{selectedSituation.usesDelay&&<p><small>{ar?"التأخير":"Delay"}</small><b>{delayLabel(matched,ar)}</b></p>}</div>
            <div className="smart-range"><span><small>{ar?"من":"MIN"}</small><b>{compensationLabel(matched.compensation_min,ar)}</b></span><i/><span><small>{ar?"إلى":"MAX"}</small><b>{compensationLabel(matched.compensation_max,ar)}</b></span></div>
            <p className={`smart-requirement ${matched.required_from_customer}`}>{matched.required_from_customer==="photo"?<Camera size={18}/>:matched.required_from_customer==="return_order"?<Truck size={18}/>:<CheckCircle2 size={18}/>}<span><small>{ar?"المطلوب من العميل":"Required from customer"}</small><b>{requirementLabel(matched.required_from_customer,ar)}</b></span></p>
            {matched.profile_condition==="refund_ratio"&&<div className="smart-profile-note"><Info size={15}/>{ar?"تحقق من نسبة التعويضات السابقة في ملف العميل قبل الاعتماد.":"Check the customer's previous refund ratio before approval."}</div>}
            <div className="coupon-policy-card">
              <div><ShieldCheck size={16}/><b>{ar?"ضوابط القسيمة":"Coupon controls"}</b></div>
              <ul><li><strong>{couponPolicy.minimum} ₪</strong><span>{ar?"الحد الأدنى":"Minimum"}</span></li><li><strong>{couponPolicy.maximum} ₪</strong><span>{ar?"الحد الأعلى":"Maximum"}</span></li></ul>
              <p><Info size={14}/>{ar?`راجع ملف العميل إذا كان لديه ${couponPolicy.profileOrderThreshold} طلبات أو أكثر.`:`Review the customer profile when they have ${couponPolicy.profileOrderThreshold} orders or more.`}</p>
            </div>
            <button type="button" onClick={copyResult}><ClipboardCopy size={16}/>{ar?"نسخ التوصية":"Copy recommendation"}</button>
          </>}
        </aside>
      </div>
    </section>

    <section className="mt-7 min-w-0">
      <div className="comp-policy-toolbar card"><div><h3>{ar ? "دليل سياسة التعويضات" : "Compensation policy guide"}</h3><p>{ar ? "جميع الحالات والشروط بنسخة سهلة القراءة" : "All situations and conditions in an easy-to-read format"}</p></div><label><Search size={17}/><input value={query} onChange={event=>setQuery(event.target.value)} placeholder={ar?"ابحث عن حالة...":"Search situations..."}/></label></div>
      <div className="comp-tabs">{(["all","delay","quality","missing","damaged"] as const).map(value=><button key={value} className={policyCategory===value?"active":""} onClick={()=>setPolicyCategory(value)}>{value==="all"?(ar?"الكل":"All"):value==="delay"?(ar?"التأخير":"Delay"):value==="quality"?(ar?"الجودة والحرارة":"Quality"):value==="missing"?(ar?"النواقص":"Missing"):(ar?"التلف والأخطاء":"Damage")}</button>)}</div>
      <div className="space-y-4">{filteredSituations.map((item,index)=>{const Icon=categoryIcons[item.category];const items=rules.filter(rule=>rule.situation===item.id&&rule.is_active).sort((a,b)=>a.sort_order-b.sort_order);return <details className="comp-policy-group card" key={item.id} open={item.id===situation||index===0}><summary onClick={()=>chooseSituation(item.id)}><i><Icon size={19}/></i><div><strong>{ar?item.ar:item.en}</strong><p>{ar?item.descriptionAr:item.descriptionEn}</p></div><span>{items.length} {ar?"قواعد":"rules"}</span></summary><div className="comp-policy-table-wrap"><table className="comp-policy-table"><thead><tr><th>{ar?"التأخير":"Delay"}</th><th>{ar?"التوصيل متاح":"Delivery"}</th><th>{ar?"قبل الإعادة":"Remake"}</th><th>{ar?"الحد الأدنى":"Minimum"}</th><th>{ar?"الحد الأعلى":"Maximum"}</th><th>{ar?"المطلوب من العميل":"Customer requirement"}</th></tr></thead><tbody>{items.map(rule=><tr key={rule.id}><td>{delayLabel(rule,ar)}</td><td><span className={`tri ${rule.delivery_available}`}>{triStateLabel(rule.delivery_available,ar)}</span></td><td><span className={`tri ${rule.remake_accepted}`}>{triStateLabel(rule.remake_accepted,ar)}</span></td><td><b>{compensationLabel(rule.compensation_min,ar)}</b></td><td><b>{compensationLabel(rule.compensation_max,ar)}</b></td><td><span className={`requirement ${rule.required_from_customer}`}>{requirementLabel(rule.required_from_customer,ar)}</span></td></tr>)}</tbody></table></div></details>})}{!filteredSituations.length&&<div className="card p-10 text-center text-sm text-[var(--muted)]">{ar?"لا توجد نتائج مطابقة.":"No matching situations."}</div>}</div>
      <div className="comp-disclaimer"><ShieldCheck size={19}/><p><b>{ar?"ملاحظة اعتماد":"Approval note"}</b><span>{ar?"التوصية مبنية على السياسة الحالية. راجع ملف العميل والاستثناءات وسجل التعويضات قبل التأكيد النهائي.":"The recommendation follows the current policy. Review the customer profile, exceptions and refund history before final approval."}</span></p></div>
    </section>
  </AppShell>;
}
