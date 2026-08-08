import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { adminClient } from "@/lib/supabase/server";

export type PortalActor = {
  id: string;
  employeeId: string;
  fullName: string;
  department: string;
  role: "employee" | "supervisor" | "manager" | "admin";
};

export async function getPortalActor(): Promise<PortalActor> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return { id: "demo-u1", employeeId: "1001", fullName: "محمد أحمد", department: "تشات الزبائن", role: "manager" };
  }
  const jar = await cookies();
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: { getAll: () => jar.getAll(), setAll: () => {} },
  });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("UNAUTHORIZED");
  const admin = adminClient();
  const { data } = await admin.from("profiles").select("employee_id,full_name,role,is_active,department:departments(name)").eq("id", user.id).single();
  if (!data?.is_active) throw new Error("FORBIDDEN");
  const department = Array.isArray(data.department) ? data.department[0]?.name : (data.department as { name?: string } | null)?.name;
  return {
    id: user.id,
    employeeId: data.employee_id || "—",
    fullName: data.full_name || user.email || "HAAT",
    department: department || "HAAT",
    role: data.role,
  };
}

export function isManager(actor: PortalActor) {
  return ["supervisor", "manager", "admin"].includes(actor.role);
}
