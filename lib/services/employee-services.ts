import { mockPerformance, mockReviews, mockSchedule, PerformanceMetric, EmployeeReview, ScheduleEntry } from "@/lib/employee-data";

type ApiEnvelope<T>={data?:unknown;items?:unknown;result?:unknown;updatedAt?:string};
async function fetchWithRetry(url:string,token?:string,retries=2){let error:unknown;for(let i=0;i<=retries;i++){try{const r=await fetch(url,{headers:token?{Authorization:`Bearer ${token}`}:{},next:{revalidate:300}});if(!r.ok)throw new Error(`API ${r.status}`);return await r.json()}catch(e){error=e}}throw error}
function arrayFrom<T>(payload:ApiEnvelope<T>):T[]{const value=payload.data??payload.items??payload.result;return Array.isArray(value)?value as T[]:[]}
export const scheduleAdapter=(payload:ApiEnvelope<ScheduleEntry>)=>arrayFrom<ScheduleEntry>(payload);
export const performanceAdapter=(payload:ApiEnvelope<PerformanceMetric>)=>arrayFrom<PerformanceMetric>(payload);
export const reviewsAdapter=(payload:ApiEnvelope<EmployeeReview>)=>arrayFrom<EmployeeReview>(payload);
export async function getSchedule(){const url=process.env.NEXT_PUBLIC_EMPLOYEE_SCHEDULE_API_URL;return url?scheduleAdapter(await fetchWithRetry(url)):mockSchedule}
export async function getPerformance(){const url=process.env.NEXT_PUBLIC_EMPLOYEE_PERFORMANCE_API_URL;return url?performanceAdapter(await fetchWithRetry(url)):mockPerformance}
export async function getReviews(){const url=process.env.NEXT_PUBLIC_EMPLOYEE_REVIEWS_API_URL;return url?reviewsAdapter(await fetchWithRetry(url)):mockReviews}

