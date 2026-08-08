"use client";
import { useEffect, useState } from "react";
import { Bike, FileUp, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import { AppShell } from "@/components/app-shell";
type Courier = {
  id: string;
  name: string;
  phone: string;
  area: string;
  shift: string;
  notes?: string;
  isActive: boolean;
};
const empty = {
  name: "",
  phone: "",
  area: "",
  shift: "",
  notes: "",
  isActive: true,
};
export default function AdminCouriers() {
  const [items, setItems] = useState<Courier[]>([]);
  const [form, setForm] = useState<Partial<Courier>>(empty);
  const [open, setOpen] = useState(false);
  const load = () =>
    fetch("/api/couriers?all=1")
      .then((r) => r.json())
      .then((d) => setItems(d.couriers || []));
  useEffect(() => {
    load();
  }, []);
  const save = async () => {
    const response = await fetch("/api/couriers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (response.ok) {
      toast.success("تم حفظ بيانات المرسل");
      setOpen(false);
      setForm(empty);
      load();
    } else toast.error("أدخل الاسم والرقم والمنطقة");
  };
  const remove = async (id: string) => {
    if (!confirm("حذف هذا الرقم من الدليل؟")) return;
    await fetch(`/api/couriers?id=${id}`, { method: "DELETE" });
    load();
  };
  const importFile = async (file?: File) => {
    if (!file) return;
    const workbook = XLSX.read(await file.arrayBuffer());
    const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(
      workbook.Sheets[workbook.SheetNames[0]],
    );
    let done = 0;
    for (const row of rows) {
      const body = {
        name: String(row.name || row["الاسم"] || ""),
        phone: String(row.phone || row["الهاتف"] || row["الرقم"] || ""),
        area: String(row.area || row["المنطقة"] || ""),
        shift: String(row.shift || row["الوردية"] || "غير محدد"),
        notes: String(row.notes || row["ملاحظات"] || ""),
      };
      if (!body.name || !body.phone || !body.area) continue;
      const response = await fetch("/api/couriers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (response.ok) done++;
    }
    toast.success(`تم استيراد ${done} رقم`);
    load();
  };
  return (
    <AppShell
      admin
      title="إدارة دليل المرسلين"
      action={
        <button
          className="btn btn-primary"
          onClick={() => {
            setForm(empty);
            setOpen(true);
          }}
        >
          <Plus size={16} />
          إضافة مرسل
        </button>
      }
    >
      <div className="mx-auto max-w-7xl">
        <section className="card p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="font-black">أرقام المرسلين</h2>
              <p className="mt-1 text-[10px] text-[var(--muted)]">
                أضف الأرقام يدوياً أو استورد Excel بأعمدة: الاسم، الهاتف،
                المنطقة، الوردية.
              </p>
            </div>
            <label className="btn btn-secondary cursor-pointer">
              <FileUp size={16} />
              استيراد Excel
              <input
                hidden
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={(e) => importFile(e.target.files?.[0])}
              />
            </label>
          </div>
          <div className="mt-5 overflow-x-auto">
            <table className="table min-w-[760px]">
              <thead>
                <tr>
                  <th>المرسل</th>
                  <th>الهاتف</th>
                  <th>المنطقة</th>
                  <th>الوردية</th>
                  <th>الحالة</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <b>{item.name}</b>
                    </td>
                    <td dir="ltr">{item.phone}</td>
                    <td>{item.area}</td>
                    <td>{item.shift}</td>
                    <td>{item.isActive ? "نشط" : "موقوف"}</td>
                    <td>
                      <div className="flex gap-2">
                        <button
                          className="toolbar-btn"
                          onClick={() => {
                            setForm(item);
                            setOpen(true);
                          }}
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          className="toolbar-btn text-rose-600"
                          onClick={() => remove(item.id)}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!items.length && (
              <div className="grid min-h-48 place-items-center text-center text-xs text-[var(--muted)]">
                <div>
                  <Bike className="mx-auto mb-2" />
                  ابدأ بإضافة أول رقم أو استيراد ملف Excel
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
      {open && (
        <div
          className="fixed inset-0 z-[80] grid place-items-center bg-black/45 p-4"
          onMouseDown={() => setOpen(false)}
        >
          <div
            className="card w-full max-w-lg p-6"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-black">
              {form.id ? "تعديل بيانات المرسل" : "إضافة مرسل"}
            </h3>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="text-[10px] font-bold">
                الاسم
                <input
                  className="input mt-1.5"
                  value={form.name || ""}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </label>
              <label className="text-[10px] font-bold">
                رقم الهاتف
                <input
                  dir="ltr"
                  className="input mt-1.5"
                  value={form.phone || ""}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </label>
              <label className="text-[10px] font-bold">
                المنطقة
                <input
                  className="input mt-1.5"
                  value={form.area || ""}
                  onChange={(e) => setForm({ ...form, area: e.target.value })}
                />
              </label>
              <label className="text-[10px] font-bold">
                الوردية
                <input
                  className="input mt-1.5"
                  value={form.shift || ""}
                  onChange={(e) => setForm({ ...form, shift: e.target.value })}
                />
              </label>
            </div>
            <label className="mt-4 block text-[10px] font-bold">
              ملاحظات
              <input
                className="input mt-1.5"
                value={form.notes || ""}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
            </label>
            <label className="mt-4 flex items-center gap-2 text-xs font-bold">
              <input
                type="checkbox"
                checked={form.isActive !== false}
                onChange={(e) =>
                  setForm({ ...form, isActive: e.target.checked })
                }
              />
              ظاهر في دليل الموظفين
            </label>
            <div className="mt-6 flex justify-end gap-2">
              <button
                className="btn btn-secondary"
                onClick={() => setOpen(false)}
              >
                إلغاء
              </button>
              <button className="btn btn-primary" onClick={save}>
                حفظ
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
