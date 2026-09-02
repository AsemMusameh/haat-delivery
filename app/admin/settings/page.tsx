"use client";
import { useEffect, useMemo, useState } from "react";
import {
  Building2,
  History,
  Plus,
  Save,
  Settings2,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { departments } from "@/lib/demo-data";
type Setting = {
  key: string;
  label: string;
  value: string;
  groupName: string;
  updatedAt?: string;
};
export default function Settings() {
  const [items, setItems] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    fetch("/api/portal-settings")
      .then((r) => r.json())
      .then((d) => setItems(d.settings || []));
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
                onClick={() =>
                  toast.info(
                    "إضافة الأقسام الجديدة متاحة من قاعدة حسابات الموظفين",
                  )
                }
              >
                <Plus size={15} />
                قسم جديد
              </button>
            </div>
            {departments.map((d) => (
              <div
                key={d.id}
                className="flex items-center gap-3 border-t border-[var(--line)] py-3 first:border-0"
              >
                <i
                  className="size-3 rounded-full"
                  style={{ background: d.color }}
                />
                <b className="flex-1 text-sm">{d.name}</b>
                <button className="text-xs font-bold text-[var(--primary)]">
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
    </AppShell>
  );
}
