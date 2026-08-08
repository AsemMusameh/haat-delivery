"use client";
import { useMemo, useState } from "react";
import { Check, KeyRound, Search, ShieldCheck, X } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { useEmployees } from "@/lib/hooks";
const roleLabels: Record<string, string> = {
  employee: "موظف",
  supervisor: "مشرف",
  manager: "مدير",
  admin: "مسؤول نظام",
};
const permissions = [
  {
    key: "view",
    label: "عرض المحتوى",
    roles: ["employee", "supervisor", "manager", "admin"],
  },
  {
    key: "post",
    label: "نشر في المجتمع",
    roles: ["employee", "supervisor", "manager", "admin"],
  },
  {
    key: "requests",
    label: "إدارة الطلبات",
    roles: ["supervisor", "manager", "admin"],
  },
  { key: "employees", label: "إدارة الموظفين", roles: ["manager", "admin"] },
  {
    key: "content",
    label: "تعديل الأرقام والمحتوى",
    roles: ["manager", "admin"],
  },
  { key: "settings", label: "إعدادات النظام", roles: ["admin"] },
];
export default function Permissions() {
  const employees = useEmployees();
  const [query, setQuery] = useState("");
  const visible = useMemo(
    () =>
      employees.filter((e) =>
        `${e.full_name} ${e.email} ${e.employee_id}`.includes(query),
      ),
    [employees, query],
  );
  return (
    <AppShell admin title="الحسابات والصلاحيات">
      <div className="mx-auto max-w-7xl">
        <section className="card p-5">
          <div className="flex items-center gap-3">
            <i className="grid size-11 place-items-center rounded-2xl bg-[var(--primary-soft)] text-[var(--primary)]">
              <ShieldCheck />
            </i>
            <div>
              <h2 className="font-black">مصفوفة صلاحيات الأدوار</h2>
              <p className="mt-1 text-[10px] text-[var(--muted)]">
                الصلاحيات مرتبطة بالدور؛ تعديل دور الموظف يتم من صفحة إدارة
                الموظفين.
              </p>
            </div>
          </div>
          <div className="mt-5 overflow-x-auto">
            <table className="table min-w-[720px]">
              <thead>
                <tr>
                  <th>الصلاحية</th>
                  {Object.values(roleLabels).map((r) => (
                    <th key={r} className="text-center">
                      {r}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {permissions.map((permission) => (
                  <tr key={permission.key}>
                    <td>
                      <b>{permission.label}</b>
                    </td>
                    {Object.keys(roleLabels).map((role) => (
                      <td key={role} className="text-center">
                        {permission.roles.includes(role) ? (
                          <Check
                            className="mx-auto text-emerald-600"
                            size={18}
                          />
                        ) : (
                          <X className="mx-auto text-slate-300" size={18} />
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        <section className="card mt-5 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-black">صلاحيات كل شخص</h2>
              <p className="mt-1 text-[10px] text-[var(--muted)]">
                عرض مباشر لما يستطيع كل حساب الوصول إليه.
              </p>
            </div>
            <label className="relative w-full sm:w-80">
              <Search
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)]"
                size={16}
              />
              <input
                className="input pr-10"
                placeholder="ابحث عن موظف..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </label>
          </div>
          <div className="mt-4 space-y-3">
            {visible.map((e) => (
              <article
                key={e.id}
                className="rounded-2xl border border-[var(--line)] bg-[var(--surface-2)] p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="grid size-10 place-items-center rounded-full bg-[var(--primary-soft)] font-black text-[var(--primary)]">
                      {e.full_name[0]}
                    </span>
                    <div>
                      <b className="block text-xs">{e.full_name}</b>
                      <span className="text-[9px] text-[var(--muted)]">
                        #{e.employee_id} • {e.email}
                      </span>
                    </div>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-[9px] font-black text-[var(--primary)] dark:bg-[var(--surface)]">
                    {roleLabels[e.role]}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {permissions
                    .filter((p) => p.roles.includes(e.role))
                    .map((p) => (
                      <span
                        key={p.key}
                        className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[8px] font-bold text-[var(--muted)] dark:bg-[var(--surface)]"
                      >
                        <KeyRound size={11} />
                        {p.label}
                      </span>
                    ))}
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
