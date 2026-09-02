export type QaMetrics={customerExperience:number;investigation:number;resolution:number;communication:number;closing:number};
export type QaEvaluation={id:string;employeeName:string;department:string;date:string;evaluationId:string;channel:string;score:number;rating:string;evaluator:string;notes:string;metrics:QaMetrics;sourceFile:string};
const row=(evaluationId:string,interaction:string,score:number,rating:string,notes:string,metrics:QaMetrics):QaEvaluation=>({id:evaluationId,employeeName:"Asem",department:"Customer Chat",date:`${interaction.slice(0,4)}-${interaction.slice(4,6)}-${interaction.slice(6,8)}`,evaluationId,channel:"Call",score,rating,evaluator:"Osama Herzallah",notes,metrics,sourceFile:"HAAT - QA - Asem.xlsx"});
const perfect={customerExperience:100,investigation:100,resolution:100,communication:100,closing:100};
export const qaSampleEvaluations:QaEvaluation[]=[
 row("QA-2026-000601","20260823010106028894",100,"Excellent","",perfect),row("QA-2026-000602","202608222319140295",100,"Excellent","",perfect),
 row("QA-2026-000603","202608222254290296",95,"Excellent","يوجد صدى كثير؛ يلزم التأكد من السماعة ووضوح الصوت.",{...perfect,communication:67}),
 row("QA-2026-000604","202608221957090295",100,"Excellent","تمت مراجعة حالة سعر الصنف والتعويض.",perfect),
 row("QA-2026-000606","202608212133210295",82.5,"Needs Improvement","لا يوجد تعليق على الطلب ولم تُحوّل الحالة إلى Late Order، مع ضرورة فحص الخدمة الثانية.",{customerExperience:100,investigation:100,resolution:75,communication:67,closing:67}),
 row("QA-2026-000607","202608210225380293",100,"Excellent","",perfect),row("QA-2026-000608","202608222200500295",100,"Excellent","Order 21135056",perfect),row("QA-2026-000609","202608210216190301",100,"Excellent","",perfect),
 row("QA-2026-000610","202608162144020294",90,"Very Good","يجب تحويل ملاحظة الجبنة إلى قسم المنيو لتعديل الوصف.",{customerExperience:100,investigation:100,resolution:50,communication:100,closing:100}),
 row("QA-2026-000611","202608160101080304",100,"Excellent","",perfect),row("QA-2026-000612","202608212259050295",95,"Excellent","ضرورة سؤال الزبون إن كان يحتاج خدمة ثانية.",{...perfect,closing:67}),row("QA-2026-000613","202608212106180307",100,"Excellent","متابعة المرسل.",perfect),
 row("QA-2026-000614","202608181934160295",95,"Excellent","ضرورة فحص وجود خدمة أخرى قبل الإغلاق.",{...perfect,closing:67}),row("QA-2026-000615","202608181847060296",100,"Excellent","تأكيد رقم الطلب الموجود بالانتظار يحسن الدقة.",perfect),
 row("QA-2026-000616","202608162246490294",85,"Good","تجنب الرد ثم وضع الزبون على الانتظار، ومراجعة الخاتمة.",{customerExperience:100,investigation:100,resolution:100,communication:67,closing:33}),
 row("QA-2026-000617","202608122337470286",90,"Very Good","لا توجد تعليقات على الطلب؛ يجب الاهتمام بالتوثيق والإنهاء.",{customerExperience:100,investigation:100,resolution:50,communication:100,closing:67}),
];
export const qaMetricLabels:Record<keyof QaMetrics,string>={customerExperience:"Customer Experience · 20%",investigation:"Investigation · 20%",resolution:"Resolution · 35%",communication:"Communication · 15%",closing:"Closing · 10%"};
