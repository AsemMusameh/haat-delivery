import { clsx, type ClassValue } from "clsx";
export const cn = (...v: ClassValue[]) => clsx(v);
export const formatDate = (d?: string) => d ? new Intl.DateTimeFormat("ar-PS",{dateStyle:"medium",timeStyle:"short",timeZone:"Asia/Hebron"}).format(new Date(d)) : "—";
export const relativeTime = (d:string) => { const diff=Date.now()-new Date(d).getTime(); const m=Math.floor(diff/60000); if(m<60)return `منذ ${Math.max(1,m)} دقيقة`; const h=Math.floor(m/60); if(h<24)return `منذ ${h} ساعة`; return `منذ ${Math.floor(h/24)} يوم`; };
export const priorityLabel = {normal:"عادي",important:"مهم",urgent:"عاجل"} as const;
