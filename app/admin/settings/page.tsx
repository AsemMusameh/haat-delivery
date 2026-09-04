"use client";
import { useEffect, useMemo, useState } from "react";
import {
  Building2,
  History,
  Plus,
  Save,
  Settings2,
  ShieldCheck,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { departments } from "@/lib/demo-data";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
type Setting = {
  key: string;
  label: string;
  value: string;
  groupName: string;
  updatedAt?: string;
};
type Department = { id: string; name: string; color?: string; is_active?: boolean };
export default function Settings() {
  const [items, setItems] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(false);
  const [departmentItems, setDepartmentItems] = useState<Department[]>(departments);
  const [departmentDraft, setDepartmentDraft] = useState<Department | null>(null);
  const [departmentBusy, setDepartmentBusy] = useState(false);
  useEffect(() => {
    fetch("/api/portal-settings")
      .then((r) => r.json())
      .then((d) => setItems(d.settings || []));
    if (isSupabaseConfigured) {
      createClient()!.from("departments").select("id,name,color,is_active").order("name").then(({ data }) => {
        if (data) setDepartmentItems(data as Department[]);
      });
    }
  }, []);
  const groups = useMemo(
    () => Array.from(new Set(items.map((i) => i.groupName))),
    [items],
  );
  const save = async () => {
    setLoading(true);
    const response = await fetch("/api/portal-settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ settings: items }),
    });
    setLoading(false);
    if (response.ok) toast.success("تم حفظ تعديلات المنصة");
    else toast.error("تعذر حفظ الإعدادات");
  };
  const saveDepartment = async () => {
    if (!departmentDraft?.name.trim()) return toast.error("أدخل اسم القسم");
    setDepartmentBusy(true);
    try {
      if (isSupabaseConfigured) {
        const client = createClient()!;
        const payload = { name: departmentDraft.name.trim(), color: departmentDraft.color || "#d90a2d", is_active: departmentDraft.is_active ?? true };
        const request = departmentDraft.id.startsWith("new-")
          ? client.from("departments").insert(payload).select("id,name,color,is_active").single()
          : client.from("departments").update(payload).eq("id", departmentDraft.id).select("id,name,color,is_active").single();
        const { data, error } = await request;
        if (error) throw error;
        setDepartmentItems((current) => departmentDraft.id.startsWith("new-") ? [...current, data as Department] : current.map((item) => item.id === departmentDraft.id ? data as Department : item));
      } else {
        setDepartmentItems((current) => departmentDraft.id.startsWith("new-") ? [...current, { ...departmentDraft, id: crypto.randomUUID() }] : current.map((item) => item.id === departmentDraft.id ? departmentDraft : item));
      }
      setDepartmentDraft(null);
      toast.success("تم حفظ القسم");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "تعذر حفظ القسم");
    } finally { setDepartmentBusy(false); }
  };
  return (
    <AppShell
      admin
      title="إعدادات النظام"
      action={
        <button className="btn btn-primary" disabled={loading} onClick={save}>
          <Save size={16} />
          {loading ? "جاري الحفظ" : "حفظ التعديلات"}
        </button>
      }
    >
      <div className="mx-auto grid max-w-7xl gap-6 xl:grid-cols-[1.1fr_.9fr]">
        <section className="card p-5 sm:p-6">
          <div className="mb-5 flex items-center gap-3">
            <Settings2 className="text-[var(--primary)]" />
            <div>
              <h2 className="font-black">محتوى المنصة المباشر</h2>
              <p className="mt-1 text-[10px] text-[var(--muted)]">
                يمكن للمدير والمسؤول تعديل العناوين والأرقام والتنبيهات بدون
                تعديل الكود.
              </p>
            </div>
          </div>
          {groups.map((group) => (
            <div key={group} className="mt-5">
              <h3 className="border-b border-[var(--line)] pb-2 text-[10px] font-black text-[var(--primary)]">
                {group}
              </h3>
              <div className="mt-3 space-y-3">
                {items.map((item, index) =>
                  item.groupName === group ? (
                    <label
                      key={item.key}
                      className="block text-[10px] font-bold"
                    >
                      {item.label}
                      <input
                        className="input mt-1.5"
                        value={item.value}
                        onChange={(e) =>
                          setItems(
                            items.map((x, i) =>
                              i === index ? { ...x, value: e.target.value } : x,
                            ),
                          )
                        }
                      />
                      <span className="mt-1 block font-normal text-[8px] text-[var(--muted)]">
                        {item.key}
                      </span>
                    </label>
                  ) : null,
                )}
              </div>
            </div>
          ))}
        </section>
        <aside className="space-y-6">
          <section className="card p-5 sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="flex items-center gap-2 font-black">
                <Building2 size={19} />
                الأقسام
              </h2>
              <button
                className="btn btn-primary !py-2 text-xs"
                onClick={() => setDepartmentDraft({ id: `new-${Date.now()}`, name: "", color: "#d90a2d", is_active: true })}
              >
                <Plus size={15} />
                قسم جديد
              </button>
            </div>
            {departmentItems.map((d) => (
              <div
                key={d.id}
                className="flex items-center gap-3 border-t border-[var(--line)] py-3 first:border-0"
              >
                <i
                  className="size-3 rounded-full"
                  style={{ background: d.color || "#d90a2d" }}
                />
                <b className="flex-1 text-sm">{d.name}</b>
                <button type="button" onClick={() => setDepartmentDraft({ ...d })} className="text-xs font-bold text-[var(--primary)]">
                  تعديل
                </button>
              </div>
            ))}
          </section>
          <section className="card p-5 sm:p-6">
            <h2 className="mb-5 flex items-center gap-2 font-black">
              <History size={19} />
              سجل العمليات
            </h2>
            {[
              "تحديث إعدادات محتوى المنصة",
              "إضافة حساب موظف جديد",
              "تعديل حالة طلب داخلي",
              "تحديث دليل المرسلين",
            ].map((x, i) => (
              <div
                key={x}
                className="flex gap-3 border-t border-[var(--line)] py-4 first:border-0"
              >
                <i className="mt-1 grid size-8 shrink-0 place-items-center rounded-lg bg-[var(--primary-soft)] text-[var(--primary)]">
                  <ShieldCheck size={15} />
                </i>
                <div>
                  <b className="text-xs">{x}</b>
                  <span className="mt-1 block text-[10px] text-[var(--muted)]">
                    منذ {i + 1} ساعة
                  </span>
                </div>
              </div>
            ))}
          </section>
        </aside>
      </div>
      {departmentDraft && <div className="fixed inset-0 z-[70] grid place-items-center bg-black/45 p-4" onMouseDown={() => setDepartmentDraft(null)}><section className="card w-full max-w-md p-6" onMouseDown={(event) => event.stopPropagation()}><header className="flex items-center justify-between"><h2 className="font-black">{departmentDraft.id.startsWith("new-") ? "قسم جديد" : "تعديل القسم"}</h2><button type="button" onClick={() => setDepartmentDraft(null)}><X size={20}/></button></header><label className="mt-5 block text-xs font-bold">اسم القسم<input className="input mt-2" value={departmentDraft.name} onChange={(event) => setDepartmentDraft({ ...departmentDraft, name: event.target.value })}/></label><label className="mt-4 block text-xs font-bold">لون القسم<input type="color" className="mt-2 h-12 w-full rounded-xl border border-[var(--line)] bg-white p-1" value={departmentDraft.color} onChange={(event) => setDepartmentDraft({ ...departmentDraft, color: event.target.value })}/></label><label className="mt-4 flex items-center gap-2 text-xs font-bold"><input type="checkbox" checked={departmentDraft.is_active ?? true} onChange={(event) => setDepartmentDraft({ ...departmentDraft, is_active: event.target.checked })}/>قسم فعّال</label><button type="button" className="btn btn-primary mt-5 w-full" onClick={saveDepartment} disabled={departmentBusy}><Save size={16}/>{departmentBusy ? "جارٍ الحفظ..." : "حفظ القسم"}</button></section></div>}
    </AppShell>
  );
}
