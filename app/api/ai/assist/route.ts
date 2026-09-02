import { NextResponse } from "next/server";
import { defaultKnowledge, resolveCase } from "@/lib/knowledge";
import { listKnowledge } from "@/lib/knowledge-store";
export async function POST(request:Request){const body=await request.json() as{case?:string};if(!body.case?.trim())return NextResponse.json({error:"أدخل تفاصيل الحالة"},{status:422});let articles=defaultKnowledge;try{articles=await listKnowledge()}catch{}return NextResponse.json({result:resolveCase(body.case.trim(),articles)})}
