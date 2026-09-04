import { createBrowserClient } from "@supabase/ssr";

type HaatRuntimeConfig = {
  supabaseUrl?: string;
  supabaseAnonKey?: string;
};

declare global {
  interface Window {
    __HAAT_RUNTIME_CONFIG__?: HaatRuntimeConfig;
  }
}

const env = (name: string) => process.env[name];
const runtimeConfig = typeof window === "undefined" ? undefined : window.__HAAT_RUNTIME_CONFIG__;
const supabaseUrl = runtimeConfig?.supabaseUrl || env("NEXT_PUBLIC_SUPABASE_URL");
const supabaseAnonKey = runtimeConfig?.supabaseAnonKey || env("NEXT_PUBLIC_SUPABASE_ANON_KEY");

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);
export function createClient() {
  if (!isSupabaseConfigured) return null;
  return createBrowserClient(supabaseUrl!, supabaseAnonKey!);
}
