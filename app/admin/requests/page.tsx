"use client";
import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Clock3, Inbox, Search } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
type Req = {
  id: string;
  employeeName: string;
  employeeId: string;
  department: string;
  type: string;
  title: string;
  details: string;
  status: string;
  priority: string;
  managerNote?: string;
  createdAt: string;
};
const labels: Record<string, string> = {
  leave: "إجازة",
  shift_change: "تعديل وردية",
  salary: "مشكلة راتب",
  document: "طلب وثيقة",
  technical: "مشكلة تقنية",
  suggestion: "اقتراح",
  complaint: "شكوى داخلية",
  training: "تدريب",
};
const statuses = [
  ["pending", "قيد الانتظار"],
  ["in_review", "قيد المراجعة"],
  ["approved", "مقبول"],
  ["rejected", "مرفوض"],
  ["completed", "مكتمل"],
];
export default function AdminRequests() {
  const [items, setItems] = useState<Req[]>([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [active, setActive] = useState<Req | null>(null);
  const [note, setNote] = useState("");
  const load = () =>
    fetch("/api/requests?all=1")
      .then((r) => r.json())
      .then((d) => setItems(d.requests || []));
  useEffect(() => {
    load();
  }, []);
  const visible = useMemo(
    () =>
      items.filter(
        (item) =>
          (filter === "all" || item.status === filter) &&
          `${item.employeeName} ${item.employeeId} ${item.title}`.includes(
            query,
          ),
      ),
    [items, query, filter],
  );
  const update = async (status: string) => {
    if (!active) return;
    const response = await fetch("/api/requests", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: active.id, status, managerNote: note }),
    });
    if (response.ok) {
      toast.success("تم تحديث الطلب");
      setActive(null);
      load();
    } else toast.error("تعذر تحديث الطلب");
  };
  return (
    <AppShell admin title="إدارة الطلبات">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-4 sm:grid-cols-3">
          <article className="stat-card card red p-5">
            <Inbox />
            <span className="stat-label">كل الطلبات</span>
            <strong>{items.length}</strong>
          </article>
          <article className="stat-card card orange p-5">
            <Clock3 />
            <span className="stat-label">بانتظار المراجعة</span>
            <strong>
              {items.filter((i) => i.status === "pending").length}
            </strong>
          </article>
          <article className="stat-card card green p-5">
            <CheckCircle2 />
            <span className="stat-label">مغلقة</span>
            <strong>
              {
                items.filter((i) =>
                  ["completed", "approved", "rejected"].includes(i.status),
                ).length
              }
            </strong>
          </article>
        </div>
        <section className="card mt-5 p-5">
          <div className="flex flex-wrap gap-3">
            <label className="relative min-w-64 flex-1">
              <Search
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)]"
                size={17}
              />
              <input
                className="input pr-10"
                placeholder="ابحث بالاسم، الرقم أو عنوان الطلب"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </label>
            <select
              className="input w-48"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">كل الحالات</option>
              {statuses.map((s) => (
                <option key={s[0]} value={s[0]}>
                  {s[1]}
                </option>
              ))}
            </select>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="table min-w-[850px]">
              <thead>
                <tr>
                  <th>الموظف</th>
                  <th>النوع</th>
                  <th>الطلب</th>
                  <th>الحالة</th>
                  <th>التاريخ</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {visible.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <b>{item.employeeName}</b>
                      <small className="block text-[var(--muted)]">
                        #{item.employeeId} • {item.department}
                      </small>
                    </td>
                    <td>{labels[item.type] || item.type}</td>
                    <td>
                      <b>{item.title}</b>
                      <small className="block max-w-xs truncate text-[var(--muted)]">
                        {item.details}
                      </small>
                    </td>
                    <td>{statuses.find((s) => s[0] === item.status)?.[1]}</td>
                    <td>{new Date(item.createdAt).toLocaleDateString("ar")}</td>
                    <td>
                      <button
                        className="btn btn-secondary"
                        onClick={() => {
                          setActive(item);
                          setNote(item.managerNote || "");
                        }}
                      >
                        مراجعة
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
      {active && (
        <div
          className="fixed inset-0 z-[80] grid place-items-center bg-black/45 p-4"
          onMouseDown={() => setActive(null)}
        >
          <div
            className="card w-full max-w-xl p-6"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <span className="text-[10px] font-black text-[var(--primary)]">
              {labels[active.type]}
            </span>
            <h3 className="mt-1 text-xl font-black">{active.title}</h3>
            <p className="mt-1 text-[10px] text-[var(--muted)]">
              {active.employeeName} • #{active.employeeId} • {active.department}
            </p>
            <p className="mt-5 rounded-2xl bg-[var(--surface-2)] p-4 text-xs leading-6">
              {active.details}
            </p>
            <label className="mt-4 block text-[10px] font-bold">
              ملاحظة للموظف
              <textarea
                className="input mt-1.5 min-h-24"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </label>
            <div className="mt-5 flex flex-wrap gap-2">
              {statuses.slice(1).map((s) => (
                <button
                  key={s[0]}
                  className={
                    s[0] === "approved"
                      ? "btn btn-primary"
                      : "btn btn-secondary"
                  }
                  onClick={() => update(s[0])}
                >
                  {s[1]}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
