"use client";
import {
  FileSpreadsheet,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
  UserCog,
  UserRoundX,
  X,
} from "lucide-react";
import { AppShell, SearchBox } from "@/components/app-shell";
import { useDepartments, useEmployees } from "@/lib/hooks";
import { departments as demoDepartments } from "@/lib/demo-data";
import { formatDate } from "@/lib/utils";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import type { Department, Profile } from "@/lib/types";
export default function Employees() {
  const employees = useEmployees();
  const departments = useDepartments();
  const [q, setQ] = useState("");
  const [dep, setDep] = useState("all");
  const [role, setRole] = useState("all");
  const [dialog, setDialog] = useState<string | null>(null);
  const items = useMemo(
    () =>
      employees.filter(
        (e) =>
          (e.full_name + e.employee_id).includes(q) &&
          (dep === "all" || e.department_id === dep) &&
          (role === "all" || e.role === role),
      ),
    [q, dep, role, employees],
  );
  const importFile = async (file?: File) => {
    if (!file) return;
    const upload = async () => {
      const body = new FormData();
      body.append("file", file);
      const response = await fetch("/api/employees/import", { method: "POST", body });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "تعذر الاستيراد");
      return `تم إنشاء ${result.created} حساب، وتعذر ${result.failed}`;
    };
    toast.promise(upload(), {
      loading: "جارٍ قراءة واستيراد الملف...",
      success: (message) => message,
      error: (error) => error.message,
    });
  };
  const selectedEmployee = employees.find((e) => e.id === dialog?.split(":")[1]);
  return (
    <AppShell
      admin
      title="إدارة الموظفين"
      action={
        <button
          onClick={() => setDialog("add")}
          className="btn btn-primary hidden sm:flex"
        >
          <Plus size={17} />
          إضافة موظف
        </button>
      }
    >
      <div className="mb-5 grid gap-3 lg:grid-cols-[1fr_200px_180px_auto]">
        <SearchBox
          value={q}
          onChange={setQ}
          placeholder="الاسم أو الرقم الوظيفي..."
        />
        <select
          className="input"
          value={dep}
          onChange={(e) => setDep(e.target.value)}
        >
          <option value="all">جميع الأقسام</option>
          {departments.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
        <select
          className="input"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="all">جميع الأدوار</option>
          <option value="employee">موظف</option>
          <option value="supervisor">مشرف قسم</option>
          <option value="manager">مدير</option>
          <option value="admin">مسؤول نظام</option>
        </select>
        <label className="btn btn-secondary cursor-pointer">
          <FileSpreadsheet size={17} />
          استيراد وإنشاء حسابات
          <input
            type="file"
            className="hidden"
            accept=".csv,.xlsx,.xls"
            onChange={(e) => importFile(e.target.files?.[0])}
          />
        </label>
      </div>
      <div className="card overflow-hidden">
        <div className="border-b border-emerald-200 bg-emerald-50 px-5 py-3 text-[10px] leading-5 text-emerald-800">
          ملف Excel ينشئ حساب دخول لكل موظف باستخدام البريد وكلمة المرور الموجودة في الملف، ثم يضيف ملفه الوظيفي وصلاحياته حسب الدور.
        </div>
        <div className="flex items-center justify-between border-b border-[var(--line)] p-5">
          <h2 className="font-black">
            الموظفون{" "}
            <span className="text-sm text-[var(--muted)]">
              ({items.length})
            </span>
          </h2>
          <span className="text-xs text-[var(--muted)]">142 نشط · 8 معطّل</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-right text-xs">
            <thead className="bg-[var(--surface-2)] text-[var(--muted)]">
              <tr>
                <th className="p-4">الموظف</th>
                <th className="p-4">الرقم</th>
                <th className="p-4">القسم</th>
                <th className="p-4">الدور</th>
                <th className="p-4">الحالة</th>
                <th className="p-4">آخر دخول</th>
                <th className="p-4">غير مقروء</th>
                <th className="p-4">إجراء</th>
              </tr>
            </thead>
            <tbody>
              {items.map((e) => (
                <tr
                  key={e.id}
                  className="border-t border-[var(--line)] hover:bg-[var(--surface-2)]"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <span className="grid size-9 place-items-center rounded-full bg-[var(--primary-soft)] font-bold text-[var(--primary)]">
                        {e.full_name[0]}
                      </span>
                      <div>
                        <b className="block">{e.full_name}</b>
                        <span className="text-[10px] text-[var(--muted)]">
                          {e.email}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">{e.employee_id}</td>
                  <td className="p-4">{e.department?.name}</td>
                  <td className="p-4">
                    {
                      {
                        employee: "موظف",
                        supervisor: "مشرف",
                        manager: "مدير",
                        admin: "مسؤول نظام",
                      }[e.role]
                    }
                  </td>
                  <td className="p-4">
                    <span
                      className={`rounded-full px-2 py-1 text-[10px] font-bold ${e.is_active ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}
                    >
                      {e.is_active ? "نشط" : "معطّل"}
                    </span>
                  </td>
                  <td className="p-4 text-[var(--muted)]">
                    {formatDate(e.last_sign_in_at)}
                  </td>
                  <td className="p-4">
                    <span
                      className={
                        e.unread_count
                          ? "font-bold text-red-600"
                          : "text-[var(--muted)]"
                      }
                    >
                      {e.unread_count}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-1">
                      <button
                        onClick={() => setDialog(`edit:${e.id}`)}
                        className="grid size-8 place-items-center rounded-lg hover:bg-[var(--line)]"
                        title="تعديل"
                      >
                        <UserCog size={16} />
                      </button>
                      <button
                        onClick={() => setDialog(`disable:${e.id}`)}
                        className="grid size-8 place-items-center rounded-lg hover:bg-[var(--line)]"
                        title="تعطيل"
                      >
                        <UserRoundX size={16} />
                      </button>
                      <button
                        onClick={() => setDialog(`delete:${e.id}`)}
                        className="grid size-8 place-items-center rounded-lg text-red-500 hover:bg-red-50"
                        title="حذف"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {dialog && <Dialog spec={dialog} employee={selectedEmployee} departments={departments} close={() => setDialog(null)} />}
    </AppShell>
  );
}
function Dialog({ spec, employee, departments, close }: { spec: string; employee?: Profile; departments: Department[]; close: () => void }) {
  const type = spec.split(":")[0];
  const destructive = type === "delete" || type === "disable";
  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());
    let response: Response;
    if (type === "add") response = await fetch("/api/employees", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) });
    else if (type === "delete") response = await fetch(`/api/employees?id=${employee?.id}`, { method: "DELETE" });
    else response = await fetch("/api/employees", { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ id: employee?.id, ...(type === "disable" ? { is_active: false } : payload) }) });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "تعذر تنفيذ الإجراء");
  };
  return (
    <div
      className="fixed inset-0 z-[60] grid place-items-center bg-black/45 p-4"
      onClick={close}
    >
      <form
        className="card w-full max-w-md p-6"
        onClick={(e) => e.stopPropagation()}
        onSubmit={(e) => toast.promise(submit(e).then(close), { loading: "جارٍ الحفظ...", success: "تم تنفيذ الإجراء بنجاح", error: (error) => error.message })}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-black">
            {type === "add"
              ? "إضافة موظف"
              : type === "edit"
                ? "تعديل بيانات الموظف"
                : type === "delete"
                  ? "حذف الموظف"
                  : "تعطيل الحساب"}
          </h2>
          <button onClick={close}>
            <X />
          </button>
        </div>
        {destructive ? (
          <p className="text-sm leading-7 text-[var(--muted)]">
            هل أنت متأكد؟ سيؤثر هذا الإجراء على قدرة الموظف على تسجيل الدخول.
            يمكنك مراجعة سجل العمليات لاحقًا.
          </p>
        ) : (
          <div className="grid gap-4">
            <input name="full_name" className="input" placeholder="الاسم الكامل" defaultValue={employee?.full_name} required />
            <input name="employee_id" className="input" placeholder="الرقم الوظيفي" defaultValue={employee?.employee_id} required />
            <input
              className="input"
              type="email"
              placeholder="البريد الإلكتروني"
              name="email"
              defaultValue={employee?.email}
              required
            />
            {type === "add" && <input name="password" className="input" type="password" placeholder="كلمة مرور مؤقتة (اختياري)" />}
            <div className="grid grid-cols-2 gap-3">
              <label className="text-[11px] font-bold text-[var(--muted)]">تاريخ الميلاد<input name="birth_date" className="input mt-1.5" type="date" defaultValue={employee?.birth_date || ""} /></label>
              <label className="text-[11px] font-bold text-[var(--muted)]">تاريخ الانضمام<input name="hire_date" className="input mt-1.5" type="date" defaultValue={employee?.hire_date || ""} /></label>
            </div>
            <select name="department_id" className="input" defaultValue={employee?.department_id || ""} required>
              <option value="">اختر القسم</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
            <select name="role" className="input" defaultValue={employee?.role || "employee"}><option value="employee">موظف</option><option value="supervisor">مشرف قسم</option><option value="manager">مدير</option><option value="admin">مسؤول نظام</option></select>
          </div>
        )}
        <div className="mt-6 flex justify-end gap-2">
          <button className="btn btn-secondary" onClick={close}>
            إلغاء
          </button>
          <button
            type="submit"
            className={`btn ${destructive ? "btn-danger" : "btn-primary"}`}
          >
            {destructive ? "تأكيد الإجراء" : "حفظ الموظف"}
          </button>
        </div>
      </form>
    </div>
  );
}
