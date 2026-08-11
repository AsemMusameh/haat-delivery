"use client";
import { useEffect, useMemo, useState } from "react";
import {
  CalendarRange,
  FileQuestion,
  GraduationCap,
  Lightbulb,
  MessageSquareWarning,
  MonitorCog,
  RefreshCcw,
  Send,
  ShieldAlert,
  WalletCards,
} from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { PageIntro } from "@/components/ui";

const types = [
  {
    id: "leave",
    label: "طلب إجازة",
    icon: CalendarRange,
    desc: "إجازة سنوية، مرضية أو طارئة",
  },
  {
    id: "shift_change",
    label: "تعديل وردية",
    icon: RefreshCcw,
    desc: "تبديل أو تعديل موعد الوردية",
  },
  {
    id: "salary",
    label: "مشكلة راتب",
    icon: WalletCards,
    desc: "استفسار أو نقص متعلق بالراتب",
  },
  {
    id: "document",
    label: "طلب وثيقة",
    icon: FileQuestion,
    desc: "إفادة عمل أو مستند إداري",
  },
  {
    id: "technical",
    label: "مشكلة تقنية",
    icon: MonitorCog,
    desc: "حساب، جهاز أو نظام عمل",
  },
  {
    id: "suggestion",
    label: "اقتراح",
    icon: Lightbulb,
    desc: "فكرة لتحسين العمل",
  },
  {
    id: "complaint",
    label: "شكوى داخلية",
    icon: ShieldAlert,
    desc: "ترسل بسرية إلى الإدارة",
  },
  {
    id: "training",
    label: "طلب تدريب",
    icon: GraduationCap,
    desc: "تدريب أو تطوير مهني",
  },
];
type Req = {
  id: string;
  type: string;
  title: string;
  details: string;
  status: string;
  createdAt: string;
  fromDate?: string;
  toDate?: string;
  managerNote?: string;
};
const status: { [key: string]: [string, string] } = {
  pending: ["قيد الانتظار", "bg-amber-50 text-amber-700"],
  in_review: ["قيد المراجعة", "bg-blue-50 text-blue-700"],
  approved: ["مقبول", "bg-emerald-50 text-emerald-700"],
  rejected: ["مرفوض", "bg-rose-50 text-rose-700"],
  completed: ["مكتمل", "bg-slate-100 text-slate-700"],
};
export default function RequestsPage() {
  const [items, setItems] = useState<Req[]>([]);
  const [selected, setSelected] = useState("leave");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    details: "",
    fromDate: "",
    toDate: "",
    priority: "normal",
  });
  const load = () =>
    fetch("/api/requests")
      .then((r) => r.json())
      .then((d) => setItems(d.requests || []))
      .catch(() => {});
  const selectedType = useMemo(
    () => types.find((t) => t.id === selected)!,
    [selected],
  );
  const start = (id: string) => {
    setSelected(id);
    setOpen(true);
    setForm({
      title: "",
      details: "",
      fromDate: "",
      toDate: "",
      priority: "normal",
    });
  };
  useEffect(() => {
    load();
    const requestedType = new URLSearchParams(window.location.search).get("new");
    if (requestedType && types.some((type) => type.id === requestedType)) {
      const timer = window.setTimeout(() => {
        setSelected(requestedType);
        setOpen(true);
      }, 0);
      return () => window.clearTimeout(timer);
    }
  }, []);
  const send = async () => {
    if (!form.title.trim() || !form.details.trim())
      return toast.error("أدخل عنوان الطلب وتفاصيله");
    setLoading(true);
    const response = await fetch("/api/requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, type: selected }),
    });
    setLoading(false);
    if (!response.ok) return toast.error("تعذر إرسال الطلب");
    toast.success("تم إرسال الطلب للإدارة");
    setOpen(false);
    load();
  };
  return (
    <AppShell title="الطلبات الداخلية">
      <div className="mx-auto max-w-7xl">
        <PageIntro eyebrow="طلبات موحّدة • متابعة مباشرة" title="كل طلباتك من مكان واحد" description="اختر نوع الطلب، أرسل التفاصيل، وتابع حالة المعالجة ورد الإدارة مباشرة من المنصة." icon={FileQuestion}/>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {types.map(({ id, label, icon: Icon, desc }) => (
            <button
              key={id}
              onClick={() => start(id)}
              className="card card-interactive group p-5 text-start"
            >
              <i className="grid size-11 place-items-center rounded-2xl bg-[var(--primary-soft)] text-[var(--primary)]">
                <Icon size={21} />
              </i>
              <b className="mt-4 block text-sm font-black">{label}</b>
              <span className="mt-1 block text-[10px] leading-5 text-[var(--muted)]">
                {desc}
              </span>
            </button>
          ))}
        </div>
        <section className="card mt-6 p-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-black">طلباتي السابقة</h3>
              <p className="mt-1 text-[10px] text-[var(--muted)]">
                آخر تحديثات الإدارة على طلباتك
              </p>
            </div>
            <span className="rounded-full bg-[var(--surface-2)] px-3 py-1 text-[10px] font-bold">
              {items.length} طلب
            </span>
          </div>
          <div className="mt-4 space-y-3">
            {items.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[var(--line)] p-8 text-center text-xs text-[var(--muted)]">
                <MessageSquareWarning className="mx-auto mb-2" />
                لا يوجد لديك طلبات حتى الآن
              </div>
            ) : (
              items.map((item) => {
                const state = status[item.status] || status.pending;
                const type = types.find((t) => t.id === item.type);
                return (
                  <article
                    key={item.id}
                    className="rounded-2xl border border-[var(--line)] bg-[var(--surface-2)] p-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <span className="text-[9px] font-black text-[var(--primary)]">
                          {type?.label || item.type}
                        </span>
                        <h4 className="mt-1 text-sm font-black">
                          {item.title}
                        </h4>
                        <p className="mt-1 text-[10px] text-[var(--muted)]">
                          {new Date(item.createdAt).toLocaleString("ar")}
                        </p>
                      </div>
                      <span
                        className={`rounded-full px-3 py-1 text-[9px] font-black ${state[1]}`}
                      >
                        {state[0]}
                      </span>
                    </div>
                    <p className="mt-3 text-xs leading-6">{item.details}</p>
                    {item.managerNote && (
                      <div className="mt-3 rounded-xl bg-white p-3 text-[10px] leading-5 dark:bg-[var(--surface)]">
                        <b>ملاحظة الإدارة:</b> {item.managerNote}
                      </div>
                    )}
                  </article>
                );
              })
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
            className="card w-full max-w-xl p-6"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-black text-[var(--primary)]">
                  طلب جديد
                </span>
                <h3 className="mt-1 text-xl font-black">
                  {selectedType.label}
                </h3>
              </div>
              <button onClick={() => setOpen(false)} className="toolbar-btn">
                ×
              </button>
            </div>
            <div className="mt-5 space-y-4">
              <label className="block text-[10px] font-bold">
                عنوان الطلب
                <input
                  className="input mt-1.5"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="اكتب عنواناً واضحاً"
                />
              </label>
              <label className="block text-[10px] font-bold">
                التفاصيل
                <textarea
                  className="input mt-1.5 min-h-28 resize-none"
                  value={form.details}
                  onChange={(e) =>
                    setForm({ ...form, details: e.target.value })
                  }
                  placeholder="اشرح المطلوب وأي معلومات تساعد على معالجته"
                />
              </label>
              {["leave", "shift_change"].includes(selected) && (
                <div className="grid grid-cols-2 gap-3">
                  <label className="text-[10px] font-bold">
                    من تاريخ
                    <input
                      type="date"
                      className="input mt-1.5"
                      value={form.fromDate}
                      onChange={(e) =>
                        setForm({ ...form, fromDate: e.target.value })
                      }
                    />
                  </label>
                  <label className="text-[10px] font-bold">
                    إلى تاريخ
                    <input
                      type="date"
                      className="input mt-1.5"
                      value={form.toDate}
                      onChange={(e) =>
                        setForm({ ...form, toDate: e.target.value })
                      }
                    />
                  </label>
                </div>
              )}
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                className="btn btn-secondary"
                onClick={() => setOpen(false)}
              >
                إلغاء
              </button>
              <button
                className="btn btn-primary"
                disabled={loading}
                onClick={send}
              >
                <Send size={16} />
                {loading ? "جاري الإرسال..." : "إرسال الطلب"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
