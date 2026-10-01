import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

const COMPANY_DOMAIN = "haat.delivery";

function safeNext(value: string | null) {
  return value && value.startsWith("/") && !value.startsWith("//") ? value : "/dashboard";
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = safeNext(url.searchParams.get("next"));
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey || !code) {
    return NextResponse.redirect(new URL("/login?error=session", url.origin));
  }

  let response = NextResponse.redirect(new URL(next, url.origin));
  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (cookiesToSet) => {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.redirect(new URL(next, url.origin));
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) return NextResponse.redirect(new URL("/login?error=oauth", url.origin));

  const { data: { user } } = await supabase.auth.getUser();
  const domain = user?.email?.split("@")[1]?.toLowerCase();
  const allowedDomains = [COMPANY_DOMAIN];

  if (!domain || !allowedDomains.includes(domain)) {
    await supabase.auth.signOut();
    return NextResponse.redirect(new URL("/login?error=domain", url.origin));
  }

  return response;
}
