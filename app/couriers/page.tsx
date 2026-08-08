"use client";
import { useEffect, useMemo, useState } from "react";
import { Bike, Copy, MapPin, Phone, Search } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
type Courier = {
  id: string;
  name: string;
  phone: string;
  area: string;
  shift: string;
  notes?: string;
};
export default function Couriers() {
  const [items, setItems] = useState<Courier[]>([]);
  const [query, setQuery] = useState("");
  useEffect(() => {
    fetch("/api/couriers")
      .then((r) => r.json())
      .then((d) => setItems(d.couriers || []));
  }, []);
  const visible = useMemo(
    () =>
      items.filter((item) =>
        `${item.name} ${item.phone} ${item.area}`.includes(query),
      ),
    [items, query],
  );
  return (
    <AppShell title="دليل المرسلين">
      <div className="mx-auto max-w-7xl">
        <section className="restaurant-hero">
          <div>
            <span>
              <Bike size={15} /> دليل داخلي محدّث
            </span>
            <h2>أرقام المرسلين</h2>
            <p>ابحث بالاسم أو المنطقة واتصل مباشرة من الهاتف.</p>
          </div>
          <i>
            <Phone size={36} />
          </i>
        </section>
        <label className="relative mt-5 block">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
          <input
            className="input h-14 pr-12 text-sm"
            placeholder="ابحث باسم المرسل، الرقم أو المنطقة..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        {visible.length === 0 ? (
          <article className="card mt-5 grid min-h-64 place-items-center p-8 text-center">
            <div>
              <Bike className="mx-auto text-[var(--primary)]" size={42} />
              <h3 className="mt-4 font-black">لم تُضف أرقام المرسلين بعد</h3>
              <p className="mt-2 text-xs text-[var(--muted)]">
                يمكن للإدارة إضافتها أو استيرادها من صفحة إدارة دليل المرسلين.
              </p>
            </div>
          </article>
        ) : (
          <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {visible.map((item) => (
              <article key={item.id} className="card p-5">
                <div className="flex items-start justify-between">
                  <i className="grid size-12 place-items-center rounded-2xl bg-[var(--primary-soft)] text-[var(--primary)]">
                    <Bike />
                  </i>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[9px] font-bold text-emerald-700">
                    متاح
                  </span>
                </div>
                <h3 className="mt-4 text-base font-black">{item.name}</h3>
                <p className="mt-1 flex items-center gap-1.5 text-[10px] text-[var(--muted)]">
                  <MapPin size={13} />
                  {item.area} • {item.shift}
                </p>
                <a
                  href={`tel:${item.phone}`}
                  dir="ltr"
                  className="mt-4 block rounded-2xl bg-[var(--surface-2)] p-3 text-center text-lg font-black text-[var(--primary)]"
                >
                  {item.phone}
                </a>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <a
                    href={`tel:${item.phone}`}
                    className="btn btn-primary justify-center"
                  >
                    <Phone size={16} />
                    اتصال
                  </a>
                  <button
                    className="btn btn-secondary justify-center"
                    onClick={() =>
                      navigator.clipboard
                        .writeText(item.phone)
                        .then(() => toast.success("تم نسخ الرقم"))
                    }
                  >
                    <Copy size={16} />
                    نسخ
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
