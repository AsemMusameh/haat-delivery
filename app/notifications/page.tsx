"use client";

import { AtSign, Megaphone, MessagesSquare } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { useLocale } from "@/components/locale-provider";
import { useNotifications } from "@/lib/hooks";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { relativeTime } from "@/lib/utils";

export default function Notifications() {
  const { locale } = useLocale();
  const ar = locale === "ar";
  const { data: items, setData: setItems } = useNotifications();
  const markAll = async () => {
    if (isSupabaseConfigured) {
      const s = createClient()!;
      const {
        data: { user },
      } = await s.auth.getUser();
      if (user) {
        const { error } = await s
          .from("notifications")
          .update({ is_read: true, read_at: new Date().toISOString() })
          .eq("user_id", user.id)
          .eq("is_read", false);
        if (error) return toast.error(error.message);
      }
    }
    setItems(items.map((item) => ({ ...item, is_read: true })));
    toast.success(
      ar
        ? "تم تحديد جميع الإشعارات كمقروءة"
        : "All notifications marked as read",
    );
  };
  return (
    <AppShell
      title={ar ? "مركز الإشعارات" : "Notification Center"}
      action={
        <button
          className="hidden text-xs font-bold text-[var(--primary)] sm:block"
          onClick={markAll}
        >
          {ar ? "تحديد الكل كمقروء" : "Mark all read"}
        </button>
      }
    >
      <div className="card mx-auto max-w-3xl overflow-hidden">
        <div className="flex items-center justify-between border-b border-[var(--line)] p-5">
          <h2 className="font-extrabold">
            {ar ? "الإشعارات الأخيرة" : "Recent notifications"}
          </h2>
          <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-bold text-red-600">
            {items.filter((item) => !item.is_read).length}{" "}
            {ar ? "غير مقروء" : "unread"}
          </span>
        </div>
        {items.map((item) => {
          const Icon = item.kind === "mention" ? AtSign : item.kind === "community_post" ? MessagesSquare : Megaphone;
          return (
          <Link
            key={item.id}
            href={item.link || `/announcements/${item.announcement_id}`}
            className={`flex gap-4 border-b border-[var(--line)] p-5 last:border-0 hover:bg-[var(--surface-2)] ${!item.is_read ? "bg-[color-mix(in_srgb,var(--primary-soft)_45%,var(--surface))]" : ""}`}
          >
            <i className="grid size-11 shrink-0 place-items-center rounded-xl bg-[var(--primary-soft)] text-[var(--primary)]">
              <Icon size={20} />
            </i>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <b className="text-sm">{item.title}</b>
                {!item.is_read && (
                  <i className="size-2 rounded-full bg-[var(--primary)]" />
                )}
              </div>
              <p className="mt-1 text-sm text-[var(--muted)]">{item.body}</p>
              <span className="mt-2 block text-[11px] text-[var(--muted)]">
                {relativeTime(item.created_at)}
              </span>
            </div>
          </Link>
          );
        })}
      </div>
    </AppShell>
  );
}
