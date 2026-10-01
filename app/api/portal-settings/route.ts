import { NextRequest, NextResponse } from "next/server";
import { listSettings, saveSettings } from "@/lib/operations-store";
import { getPortalActor, isManager } from "@/lib/portal-actor";
import { sessionUser } from "@/lib/account-store";
import { demoEmployees } from "@/lib/demo-data";
export async function GET(){try{return NextResponse.json({settings:await listSettings()});}catch(error){return NextResponse.json({error:error instanceof Error?error.message:"UNKNOWN_ERROR"},{status:400})}}
export async function PUT(request:NextRequest){try{if(process.env.NEXT_PUBLIC_SUPABASE_URL){const actor=await getPortalActor();if(!isManager(actor))return NextResponse.json({error:"FORBIDDEN"},{status:403})}else{const token=request.headers.get("authorization")?.replace(/^Bearer\s+/i,"");const userId=await sessionUser(token);const profile=demoEmployees.find(employee=>employee.id===userId);if(!profile||!["manager","admin"].includes(profile.role))return NextResponse.json({error:"FORBIDDEN"},{status:403})}const body=await request.json() as {settings?:{key:string;label:string;value:string;groupName:string}[]};if(!Array.isArray(body.settings))return NextResponse.json({error:"INVALID_SETTINGS"},{status:422});await saveSettings(body.settings);return NextResponse.json({ok:true});}catch(error){return NextResponse.json({error:error instanceof Error?error.message:"UNKNOWN_ERROR"},{status:400})}}
