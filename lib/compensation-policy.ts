export type CompensationCategory = "delay" | "quality" | "missing" | "damaged";
export type TriState = "yes" | "no" | "na";
export type ProfileCondition = "na" | "refund_ratio";
export type CustomerRequirement = "nothing" | "photo" | "return_order";
export type CompensationCode =
  | "zero" | "df" | "df150" | "df200"
  | "order30" | "order40" | "order50" | "order80" | "order100"
  | "fixed40" | "fixed50" | "fixed70" | "fixed80" | "fixed100"
  | "remake" | "remake_df" | "remake_df150" | "remake_40" | "remake_80"
  | "item" | "item_df" | "item_50" | "total_df" | "total_50";

export const couponPolicy = {
  minimum: 10,
  maximum: 300,
  profileOrderThreshold: 5,
} as const;

export interface CompensationSituation {
  id: string;
  category: CompensationCategory;
  ar: string;
  en: string;
  descriptionAr: string;
  descriptionEn: string;
  usesDelay: boolean;
}

export interface CompensationRule {
  id: string;
  situation: string;
  delay_min: number | null;
  delay_max: number | null;
  delivery_available: TriState;
  remake_accepted: TriState;
  profile_condition: ProfileCondition;
  compensation_min: CompensationCode;
  compensation_max: CompensationCode;
  required_from_customer: CustomerRequirement;
  notes: string;
  is_active: boolean;
  sort_order: number;
}

export const compensationSituations: CompensationSituation[] = [
  { id:"late_order", category:"delay", ar:"طلب متأخر", en:"Late order", descriptionAr:"الطلب وصل متأخرًا مع بقاء جودة الأصناف مقبولة.", descriptionEn:"The order arrived late while item quality remained acceptable.", usesDelay:true },
  { id:"cancel_due_delay", category:"delay", ar:"إلغاء بسبب التأخير", en:"Cancellation due to delay", descriptionAr:"العميل يطلب إلغاء الطلب بسبب مدة التأخير.", descriptionEn:"The customer requests cancellation because of the delay.", usesDelay:true },
  { id:"cold_no_delay", category:"quality", ar:"طلب بارد دون تأخير", en:"Cold order without delay", descriptionAr:"الطلب بارد بسبب الشريك دون وجود تأخير بالتوصيل.", descriptionEn:"The order is cold due to the partner, without delivery delay.", usesDelay:false },
  { id:"cold_with_delay", category:"quality", ar:"طلب بارد مع تأخير", en:"Cold order with delay", descriptionAr:"الطلب وصل باردًا مع تسجيل تأخير بالتوصيل.", descriptionEn:"The order arrived cold with a recorded delay.", usesDelay:true },
  { id:"missing_main", category:"missing", ar:"نقص وجبة رئيسية", en:"Missing main meal", descriptionAr:"وجبة رئيسية كاملة غير موجودة في الطلب.", descriptionEn:"A complete main meal is missing from the order.", usesDelay:false },
  { id:"missing_side", category:"missing", ar:"نقص صنف جانبي", en:"Missing side item", descriptionAr:"صنف جانبي أو إضافة مدفوعة غير موجودة.", descriptionEn:"A side item or paid add-on is missing.", usesDelay:false },
  { id:"damaged_main", category:"damaged", ar:"وجبة رئيسية متضررة", en:"Damaged main meal", descriptionAr:"الوجبة الرئيسية انسكبت أو وصلت بحالة غير صالحة.", descriptionEn:"The main meal spilled or arrived unusable.", usesDelay:false },
  { id:"damaged_side", category:"damaged", ar:"صنف جانبي متضرر", en:"Damaged side item", descriptionAr:"صنف جانبي وصل منسكبًا أو متضررًا.", descriptionEn:"A side item arrived spilled or damaged.", usesDelay:false },
  { id:"mix_up", category:"damaged", ar:"تبديل كامل بالطلب", en:"Order mix-up", descriptionAr:"العميل استلم طلب عميل آخر أو طلبًا مختلفًا بالكامل.", descriptionEn:"The customer received someone else's or a fully different order.", usesDelay:false },
  { id:"wrong_main", category:"damaged", ar:"وجبة رئيسية خاطئة", en:"Wrong main meal", descriptionAr:"تم إرسال وجبة رئيسية مختلفة عن المطلوبة.", descriptionEn:"A different main meal was sent.", usesDelay:false },
  { id:"wrong_side", category:"damaged", ar:"صنف جانبي خاطئ", en:"Wrong side item", descriptionAr:"تم إرسال صنف جانبي مختلف عن المطلوب.", descriptionEn:"A different side item was sent.", usesDelay:false },
];

const rule = (
  id: string, situation: string, delay_min: number | null, delay_max: number | null,
  delivery_available: TriState, remake_accepted: TriState,
  compensation_min: CompensationCode, compensation_max: CompensationCode,
  profile_condition: ProfileCondition = "na", required_from_customer: CustomerRequirement = "nothing",
  notes = "", sort_order = 0,
): CompensationRule => ({ id, situation, delay_min, delay_max, delivery_available, remake_accepted, profile_condition, compensation_min, compensation_max, required_from_customer, notes, is_active:true, sort_order });

export const defaultCompensationRules: CompensationRule[] = [
  rule("late-1","late_order",1,10,"na","na","zero","zero","na","nothing","",10),
  rule("late-2","late_order",11,20,"na","na","df","df","na","nothing","",20),
  rule("late-3","late_order",21,30,"na","na","df150","df150","na","nothing","",30),
  rule("late-4","late_order",31,null,"na","na","df200","df200","na","nothing","",40),
  rule("cancel-1","cancel_due_delay",1,10,"na","na","zero","zero","na","nothing","",50),
  rule("cancel-2","cancel_due_delay",11,20,"na","na","df","df","na","nothing","",60),
  rule("cancel-3","cancel_due_delay",21,30,"na","na","fixed50","fixed50","na","nothing","",70),
  rule("cancel-4","cancel_due_delay",31,null,"na","na","fixed70","fixed100","na","nothing","",80),

  rule("cold-no-1","cold_no_delay",null,null,"yes","yes","remake","remake","refund_ratio","return_order","إعادة الطلب البارد للمندوب عند تنفيذ إعادة التحضير.",90),
  rule("cold-no-2","cold_no_delay",null,null,"yes","no","df","df","refund_ratio","nothing","",100),
  rule("cold-no-3","cold_no_delay",null,null,"no","na","order30","order40","refund_ratio","nothing","",110),
  rule("cold-1a","cold_with_delay",1,10,"yes","yes","remake","remake","na","return_order","",120),
  rule("cold-1b","cold_with_delay",1,10,"yes","no","df","df","refund_ratio","nothing","",130),
  rule("cold-1c","cold_with_delay",1,10,"no","na","order30","order40","refund_ratio","nothing","",140),
  rule("cold-2a","cold_with_delay",11,20,"yes","yes","remake","remake_df","na","nothing","",150),
  rule("cold-2b","cold_with_delay",11,20,"yes","no","order30","order40","na","nothing","",160),
  rule("cold-2c","cold_with_delay",11,20,"no","yes","order40","order50","na","nothing","",170),
  rule("cold-3a","cold_with_delay",21,30,"yes","yes","remake_df150","remake_df150","na","nothing","",180),
  rule("cold-3b","cold_with_delay",21,30,"yes","no","order40","order50","na","nothing","",190),
  rule("cold-3c","cold_with_delay",21,30,"no","yes","order80","order100","na","nothing","",200),
  rule("cold-4a","cold_with_delay",31,null,"yes","yes","remake_40","remake_80","na","nothing","",210),
  rule("cold-4b","cold_with_delay",31,null,"yes","no","order100","order100","na","nothing","",220),
  rule("cold-4c","cold_with_delay",31,null,"no","yes","order100","order100","na","nothing","",230),

  rule("missing-main-1","missing_main",null,null,"yes","yes","remake","remake_df","refund_ratio","nothing","",240),
  rule("missing-main-2","missing_main",null,null,"yes","no","item_df","item_df","refund_ratio","nothing","",250),
  rule("missing-main-3","missing_main",null,null,"no","na","item_50","item_50","refund_ratio","nothing","",260),
  rule("missing-side-1","missing_side",null,null,"yes","yes","remake","remake","refund_ratio","nothing","",270),
  rule("missing-side-2","missing_side",null,null,"yes","no","item","item","refund_ratio","nothing","",280),
  rule("missing-side-3","missing_side",null,null,"no","na","item_df","item_df","refund_ratio","nothing","",290),

  rule("damaged-main-1","damaged_main",null,null,"yes","yes","remake","remake_df","na","photo","",300),
  rule("damaged-main-2","damaged_main",null,null,"yes","no","item_df","item_df","na","photo","",310),
  rule("damaged-main-3","damaged_main",null,null,"no","yes","item_50","item_50","na","photo","",320),
  rule("damaged-side-1","damaged_side",null,null,"yes","yes","remake","remake","na","photo","",330),
  rule("damaged-side-2","damaged_side",null,null,"yes","no","item","item","na","photo","",340),
  rule("damaged-side-3","damaged_side",null,null,"no","yes","item_df","item_df","na","photo","",350),
  rule("mix-1","mix_up",null,null,"yes","yes","remake_df","remake_df","na","photo","",360),
  rule("mix-2","mix_up",null,null,"yes","no","total_df","total_df","na","photo","",370),
  rule("mix-3","mix_up",null,null,"no","yes","total_50","total_50","na","photo","",380),
  rule("wrong-main-1","wrong_main",null,null,"yes","yes","remake_df","remake_df","na","photo","",390),
  rule("wrong-main-2","wrong_main",null,null,"yes","no","item","item","na","photo","",400),
  rule("wrong-main-3","wrong_main",null,null,"no","yes","item_df","item_df","na","photo","",410),
  rule("wrong-side-1","wrong_side",null,null,"yes","yes","remake","remake","na","photo","يلزم إرفاق صورة. راجع ملف العميل إذا كان لديه 5 طلبات أو أكثر.",420),
  rule("wrong-side-2","wrong_side",null,null,"yes","no","item","item","na","photo","يلزم إرفاق صورة. قيمة القسيمة بين 10 و300 شيكل.",430),
  rule("wrong-side-3","wrong_side",null,null,"no","yes","item","item","na","photo","يلزم إرفاق صورة. قيمة القسيمة بين 10 و300 شيكل.",440),
];

export const compensationOptions: CompensationCode[] = ["zero","df","df150","df200","order30","order40","order50","order80","order100","fixed40","fixed50","fixed70","fixed80","fixed100","remake","remake_df","remake_df150","remake_40","remake_80","item","item_df","item_50","total_df","total_50"];

export function situationById(id: string) { return compensationSituations.find((item) => item.id === id); }

export function compensationLabel(code: CompensationCode, ar = true) {
  const labels: Record<CompensationCode, [string,string]> = {
    zero:["دون تعويض","No compensation"], df:["قيمة التوصيل","Delivery fee"], df150:["150% من قيمة التوصيل","150% of delivery fee"], df200:["200% من قيمة التوصيل","200% of delivery fee"],
    order30:["30% من قيمة الطلب","30% of order total"], order40:["40% من قيمة الطلب","40% of order total"], order50:["50% من قيمة الطلب","50% of order total"], order80:["80% من قيمة الطلب","80% of order total"], order100:["100% من قيمة الطلب","100% of order total"],
    fixed40:["40 شيكل","40 NIS"], fixed50:["50 شيكل","50 NIS"], fixed70:["70 شيكل","70 NIS"], fixed80:["80 شيكل","80 NIS"], fixed100:["100 شيكل","100 NIS"],
    remake:["إعادة التحضير/التوصيل","Remake/redeliver"], remake_df:["إعادة التحضير + قيمة التوصيل","Remake + delivery fee"], remake_df150:["إعادة التحضير + 150% من التوصيل","Remake + 150% delivery fee"], remake_40:["إعادة التحضير + 40 شيكل","Remake + 40 NIS"], remake_80:["إعادة التحضير + 80 شيكل","Remake + 80 NIS"],
    item:["قيمة الصنف المتأثر","Affected item value"], item_df:["قيمة الصنف + التوصيل","Item value + delivery fee"], item_50:["قيمة الصنف + 50 شيكل","Item value + 50 NIS"], total_df:["قيمة الطلب + التوصيل","Order total + delivery fee"], total_50:["قيمة الطلب + 50 شيكل","Order total + 50 NIS"],
  };
  return labels[code][ar ? 0 : 1];
}

export function requirementLabel(code: CustomerRequirement, ar = true) {
  return ({ nothing:["لا شيء","Nothing"], photo:["صورة واضحة من العميل","A clear customer photo"], return_order:["إعادة الطلب للمندوب","Return order to courier"] } as const)[code][ar ? 0 : 1];
}

export function triStateLabel(value: TriState, ar = true) {
  return ({ yes:["نعم","Yes"], no:["لا","No"], na:["غير مطلوب","N/A"] } as const)[value][ar ? 0 : 1];
}

export function delayLabel(rule: Pick<CompensationRule,"delay_min"|"delay_max">, ar = true) {
  if (rule.delay_min == null) return ar ? "لا ينطبق" : "N/A";
  if (rule.delay_max == null) return ar ? `${rule.delay_min}+ دقيقة` : `${rule.delay_min}+ min`;
  return ar ? `${rule.delay_min}–${rule.delay_max} دقيقة` : `${rule.delay_min}–${rule.delay_max} min`;
}

export function findCompensationRule(rules: CompensationRule[], situation: string, delay: number, delivery: TriState, remake: TriState) {
  return rules.filter((rule) => rule.is_active && rule.situation === situation).sort((a,b) => a.sort_order-b.sort_order).find((rule) => {
    const delayMatches = rule.delay_min == null || (delay >= rule.delay_min && (rule.delay_max == null || delay <= rule.delay_max));
    return delayMatches && rule.delivery_available === delivery && rule.remake_accepted === remake;
  });
}

export function compensationAmount(code: CompensationCode, orderTotal: number, deliveryFee: number, itemValue: number): number | null {
  const values: Partial<Record<CompensationCode,number>> = {
    zero:0, df:deliveryFee, df150:deliveryFee*1.5, df200:deliveryFee*2,
    order30:orderTotal*.3, order40:orderTotal*.4, order50:orderTotal*.5, order80:orderTotal*.8, order100:orderTotal,
    fixed40:40, fixed50:50, fixed70:70, fixed80:80, fixed100:100,
    item:itemValue, item_df:itemValue+deliveryFee, item_50:itemValue+50, total_df:orderTotal+deliveryFee, total_50:orderTotal+50,
  };
  const amount = values[code] ?? null;
  if (amount == null || amount === 0) return amount;
  return Math.min(couponPolicy.maximum, Math.max(couponPolicy.minimum, amount));
}
