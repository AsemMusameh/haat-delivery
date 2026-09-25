import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
export async function proxy(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const supabaseAuthEnabled =
    process.env.HAAT_AUTH_MODE === "supabase" &&
    Boolean(supabaseUrl) &&
    Boolean(supabaseAnonKey);
  if (!supabaseAuthEnabled || !supabaseUrl || !supabaseAnonKey) return NextResponse.next();
  let response = NextResponse.next({ request });
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, { cookies: { getAll:()=>request.cookies.getAll(), setAll(cookies){cookies.forEach(({name,value})=>request.cookies.set(name,value));response=NextResponse.next({request});cookies.forEach(({name,value,options})=>response.cookies.set(name,value,options));} } });
  const { data: { user } } = await supabase.auth.getUser();
  const isLogin=request.nextUrl.pathname==="/login";
  if (!user && !isLogin) return NextResponse.redirect(new URL("/login",request.url));
  if (user && isLogin) return NextResponse.redirect(new URL("/dashboard",request.url));
  return response;
}
export const config={matcher:["/((?!_next/static|_next/image|icons|manifest.webmanifest|sw.js|offline|favicon.ico|api/push).*)"]};
