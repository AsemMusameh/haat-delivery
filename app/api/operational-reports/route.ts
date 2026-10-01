import { NextRequest, NextResponse } from "next/server";
import { sessionUser } from "@/lib/account-store";
import { demoEmployees } from "@/lib/demo-data";
import { createDailyReport, createMonthlyReport, deleteReport, listDailyReports, listMonthlyReports, reportOwner } from "@/lib/report-store";
import type { ReportCategory } from "@/lib/report-store";

const bearer = (request: NextRequest) => request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") || null;
const response = (data: unknown, status = 200) => NextResponse.json(data, { status, headers: { "Cache-Control": "no-store" } });

async function actor(request: NextRequest) {
  const userId = await sessionUser(bearer(request));
  const profile = demoEmployees.find((employee) => employee.id === userId);
  if (!profile) throw new Error("UNAUTHORIZED");
  return profile;
}

const clean = (value: unknown, max: number) => String(value || "").trim().slice(0, max);
const fail = (error: unknown) => {
  const message = error instanceof Error ? error.message : "UNKNOWN_ERROR";
  if (message === "UNAUTHORIZED") return response({ error: "انتهت الجلسة، سجّل الدخول من جديد" }, 401);
  if (message === "FORBIDDEN") return response({ error: "ليست لديك صلاحية تنفيذ هذه العملية" }, 403);
  return response({ error: "تعذر حفظ التقرير حالياً" }, 500);
};

export async function GET(request: NextRequest) {
  try {
    await actor(request);
    const type = request.nextUrl.searchParams.get("type");
    if (type === "daily") return response({ reports: await listDailyReports() });
    if (type === "monthly") return response({ reports: await listMonthlyReports() });
    return response({ error: "نوع التقرير غير صالح" }, 422);
  } catch (error) { return fail(error); }
}

export async function POST(request: NextRequest) {
  try {
    const profile = await actor(request);
    const body = await request.json() as Record<string, unknown>;
    const type = clean(body.type, 10);
    if (type === "daily") {
      if (profile.role !== "supervisor") throw new Error("FORBIDDEN");
      const reportDate = clean(body.reportDate, 10);
      const reportType = clean(body.reportType, 20) as ReportCategory;
      const shift = clean(body.shift, 30);
      const title = clean(body.title, 120);
      const summary = clean(body.summary, 4000);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(reportDate) || !["voice","connecteam","chat"].includes(reportType) || !shift || !title || !summary) return response({ error: "أكمل الحقول المطلوبة" }, 422);
      const report = await createDailyReport({
        authorId: profile.id, authorName: profile.full_name, department: profile.department?.name || "HAAT",
        reportDate, reportType, shift, title, summary, achievements: clean(body.achievements, 2500),
        challenges: clean(body.challenges, 2500), notes: clean(body.notes, 2500),
      });
      return response({ report }, 201);
    }
    if (type === "monthly") {
      if (!['manager', 'admin'].includes(profile.role)) throw new Error("FORBIDDEN");
      const reportMonth = clean(body.reportMonth, 7);
      const title = clean(body.title, 120);
      const imageData = clean(body.imageData, 1_500_000);
      const imageName = clean(body.imageName, 160);
      if (!/^\d{4}-\d{2}$/.test(reportMonth) || !title || !/^data:image\/(?:png|jpeg|webp);base64,/.test(imageData)) return response({ error: "أكمل الشهر والعنوان والصورة" }, 422);
      if (imageData.length > 1_450_000) return response({ error: "الصورة كبيرة جداً، اختر صورة أصغر" }, 413);
      const report = await createMonthlyReport({
        authorId: profile.id, authorName: profile.full_name, reportMonth, title,
        note: clean(body.note, 2500), imageData, imageName: imageName || "monthly-report.webp",
      });
      return response({ report }, 201);
    }
    return response({ error: "نوع التقرير غير صالح" }, 422);
  } catch (error) { return fail(error); }
}

export async function DELETE(request: NextRequest) {
  try {
    const profile = await actor(request);
    const type = request.nextUrl.searchParams.get("type") as "daily" | "monthly" | null;
    const id = request.nextUrl.searchParams.get("id");
    if ((type !== "daily" && type !== "monthly") || !id) return response({ error: "بيانات غير مكتملة" }, 422);
    const owner = await reportOwner(type, id);
    if (!owner || (owner.authorId !== profile.id && !['manager', 'admin'].includes(profile.role))) throw new Error("FORBIDDEN");
    await deleteReport(type, id);
    return response({ ok: true });
  } catch (error) { return fail(error); }
}
