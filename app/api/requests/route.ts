import { NextRequest, NextResponse } from "next/server";
import { createRequest, listRequests, updateRequest, type RequestStatus } from "@/lib/operations-store";
import { getPortalActor, isManager } from "@/lib/portal-actor";

const fail = (error: unknown) => NextResponse.json({ error: error instanceof Error ? error.message : "UNKNOWN_ERROR" }, { status: error instanceof Error && error.message === "UNAUTHORIZED" ? 401 : 400 });

export async function GET(request: NextRequest) {
  try {
    const actor = await getPortalActor();
    const all = request.nextUrl.searchParams.get("all") === "1";
    if (all && !isManager(actor)) return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
    return NextResponse.json({ requests: await listRequests(all ? undefined : actor.id) });
  } catch (error) { return fail(error); }
}

export async function POST(request: NextRequest) {
  try {
    const actor = await getPortalActor();
    const body = await request.json() as { type?:string;title?:string;details?:string;fromDate?:string;toDate?:string;priority?:string };
    if (!body.type || !body.title?.trim() || !body.details?.trim()) return NextResponse.json({ error: "MISSING_FIELDS" }, { status: 422 });
    const item = await createRequest({ userKey:actor.id,employeeName:actor.fullName,employeeId:actor.employeeId,department:actor.department,type:body.type,title:body.title.trim(),details:body.details.trim(),fromDate:body.fromDate||null,toDate:body.toDate||null,priority:body.priority||"normal" });
    return NextResponse.json({ request: item }, { status: 201 });
  } catch (error) { return fail(error); }
}

export async function PATCH(request: NextRequest) {
  try {
    const actor = await getPortalActor();
    if (!isManager(actor)) return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
    const body = await request.json() as { id?:string;status?:RequestStatus;managerNote?:string };
    const valid = ["pending","in_review","approved","rejected","completed"];
    if (!body.id || !body.status || !valid.includes(body.status)) return NextResponse.json({ error: "INVALID_REQUEST" }, { status: 422 });
    await updateRequest(body.id,body.status,body.managerNote);
    return NextResponse.json({ ok:true });
  } catch (error) { return fail(error); }
}
