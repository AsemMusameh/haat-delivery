import { NextRequest, NextResponse } from "next/server";

type NominatimResult = { lat?: string; lon?: string; display_name?: string };

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim().slice(0, 180) || "";
  if (query.length < 2) return NextResponse.json({ error: "اكتب اسم منطقة أو عنوانًا واضحًا" }, { status: 422 });

  const endpoint = new URL("https://nominatim.openstreetmap.org/search");
  endpoint.searchParams.set("q", `${query}, Tulkarm`);
  endpoint.searchParams.set("format", "jsonv2");
  endpoint.searchParams.set("limit", "1");
  endpoint.searchParams.set("accept-language", "ar,en");
  endpoint.searchParams.set("countrycodes", "ps,il");
  endpoint.searchParams.set("viewbox", "35.00,32.35,35.18,32.21");

  try {
    const result = await fetch(endpoint, {
      headers: {
        "User-Agent": "HAAT-Tulkarm-Employee-Hub/1.0 (https://haat-employee-hub-asem.asemmusameh265.chatgpt.site)",
        Referer: "https://haat-employee-hub-asem.asemmusameh265.chatgpt.site/",
      },
      next: { revalidate: 86_400 },
    });
    if (!result.ok) throw new Error("GEOCODER_UNAVAILABLE");
    const matches = await result.json() as NominatimResult[];
    const first = matches[0];
    const lat = Number(first?.lat);
    const lng = Number(first?.lon);
    if (!first || !Number.isFinite(lat) || !Number.isFinite(lng)) {
      return NextResponse.json({ error: "لم نعثر على هذا الموقع. جرّب كتابة اسم البلدة أو عنوان أوضح." }, { status: 404 });
    }
    return NextResponse.json(
      { lat, lng, displayName: first.display_name || query },
      { headers: { "Cache-Control": "public, max-age=86400" } },
    );
  } catch {
    return NextResponse.json({ error: "تعذر تحديد الموقع الآن، جرّب اختيار منطقة من القائمة." }, { status: 503 });
  }
}
