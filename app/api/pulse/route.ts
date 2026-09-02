import { NextRequest, NextResponse } from "next/server";
import { getPulse, pulseSummary, savePulse } from "@/lib/operations-store";
import { getPortalActor, isManager } from "@/lib/portal-actor";

const today = () => new Date().toISOString().slice(0,10);
export async function GET(request: NextRequest) {
  try {
    const actor=await getPortalActor(),date=request.nextUrl.searchParams.get("date")||today();
    if(request.nextUrl.searchParams.get("summary")==="1"){
      if(!isManager(actor))return NextResponse.json({error:"FORBIDDEN"},{status:403});
      return NextResponse.json({date,summary:await pulseSummary(date)});
    }
    const entry=await getPulse(actor.id,date); return NextResponse.json({date,mood:entry?.mood||null});
  } catch(error){return NextResponse.json({error:error instanceof Error?error.message:"UNKNOWN_ERROR"},{status:400})}
}
export async function POST(request:NextRequest){try{const actor=await getPortalActor();const body=await request.json() as {mood?:number;date?:string};if(!body.mood||body.mood<1||body.mood>5)return NextResponse.json({error:"INVALID_MOOD"},{status:422});await savePulse(actor.id,body.date||today(),body.mood);return NextResponse.json({ok:true});}catch(error){return NextResponse.json({error:error instanceof Error?error.message:"UNKNOWN_ERROR"},{status:400})}}
