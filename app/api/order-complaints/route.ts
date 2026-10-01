import { NextRequest, NextResponse } from "next/server";
import { sessionUser } from "@/lib/account-store";
import { createComplaint, listComplaints } from "@/lib/complaint-store";
import { demoEmployees, departmentHeadEmails } from "@/lib/demo-data";

const bearer = (request: NextRequest) => request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") || null;
const clean = (value: unknown, max: number) => String(value || "").trim().slice(0,max);
const json = (data: unknown, status = 200) => NextResponse.json(data,{status,headers:{"Cache-Control":"no-store"}});

async function actor(request: NextRequest) {
  const userId = await sessionUser(bearer(request));
  const profile = demoEmployees.find((employee) => employee.id === userId);
  if (!profile) throw new Error("UNAUTHORIZED");
  return profile;
}

export async function GET(request: NextRequest) {
  try {
    const profile = await actor(request);
    const privileged = ["manager","admin"].includes(profile.role) || departmentHeadEmails.has(profile.email.toLowerCase());
    return json({ complaints: await listComplaints(profile.id,privileged) });
  } catch { return json({error:"انتهت الجلسة، سجّل الدخول من جديد"},401); }
}

export async function POST(request: NextRequest) {
  try {
    const profile = await actor(request);
    const body = await request.json() as Record<string,unknown>;
    const recipientId = clean(body.recipientId,80);
    const recipient = demoEmployees.find((employee) => employee.id === recipientId);
    const allowedRecipient = recipient && (recipient.role === "supervisor" || ["manager","admin"].includes(recipient.role) || recipient.department_id === "quality-assurance");
    const orderNumber = clean(body.orderNumber,80);
    const employeeName = clean(body.employeeName,160);
    const description = clean(body.description,5000);
    const chatUrl = clean(body.chatUrl,900);
    if (!allowedRecipient || !orderNumber || !employeeName || !description) return json({error:"أكمل رقم الطلبية والموظف والوصف والجهة المستلمة"},422);
    if (chatUrl && !/^https?:\/\//i.test(chatUrl)) return json({error:"رابط المحادثة غير صالح"},422);
    const recipientLabel = recipient!.role === "supervisor" ? "مسؤول شفت" : recipient!.department_id === "quality-assurance" ? "الجودة" : departmentHeadEmails.has(recipient!.email.toLowerCase()) ? "مسؤول قسم" : "المدير";
    const complaint = await createComplaint({
      reporterId:profile.id,reporterName:profile.full_name,orderNumber,employeeName,description,chatUrl,
      recipientId:recipient!.id,recipientName:recipient!.full_name,recipientLabel,
    });
    return json({complaint},201);
  } catch { return json({error:"تعذر إرسال الشكوى حاليًا"},500); }
}
