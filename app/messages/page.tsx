"use client";

import { CheckCheck, MessageCircleMore, Search, Send, SmilePlus } from "lucide-react";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { useLocale } from "@/components/locale-provider";
import { demoEmployees } from "@/lib/demo-data";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

type ChatMessage = { id: string; mine: boolean; body: string; time: string };

const seed: ChatMessage[] = [
  { id: "m1", mine: false, body: "مرحباً، هل اطلعت على تحديث سياسة خدمة الزبائن؟", time: "10:24" },
  { id: "m2", mine: true, body: "نعم، قرأته وتم تأكيد الاطلاع. شكراً للتذكير.", time: "10:27" },
];

const conversationMeta = [
  { preview: "شكرًا، وصلتني التفاصيل.", time: "الآن", unread: 2 },
  { preview: "ممكن نتأكد من آخر تحديث؟", time: "10:18", unread: 0 },
  { preview: "تمام، رح أتابع الموضوع.", time: "09:42", unread: 1 },
  { preview: "تمت المتابعة مع القسم.", time: "أمس", unread: 0 },
];

export default function Messages() {
  const { locale } = useLocale();
  const ar = locale === "ar";
  const [active, setActive] = useState(demoEmployees[1]);
  const [messages, setMessages] = useState(seed);
  const [text, setText] = useState("");
  const [query, setQuery] = useState("");

  const employees = useMemo(() => {
    const value = query.trim().toLowerCase();
    return demoEmployees.filter((employee) => !value || `${employee.full_name} ${employee.email}`.toLowerCase().includes(value));
  }, [query]);

  const send = async () => {
    const body = text.trim();
    if (!body) return;
    setMessages((current) => [...current, { id: `local-${Date.now()}-${Math.random().toString(36).slice(2)}`, mine: true, body, time: new Date().toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" }) }]);
    setText("");
    if (isSupabaseConfigured) {
      const supabase = createClient()!;
      const { data: { user } } = await supabase.auth.getUser();
      if (user) await supabase.from("direct_messages").insert({ sender_id: user.id, recipient_id: active.id, body });
    }
  };

  return <AppShell title={ar ? "الرسائل" : "Messages"}>
    <div className="messages-shell">
      <aside className="messages-sidebar">
        <header className="messages-sidebar-heading">
          <span><MessageCircleMore size={20}/></span>
          <div><h2>{ar ? "المحادثات" : "Conversations"}</h2><p>{ar ? "تواصل سريع مع فريقك" : "Stay connected with your team"}</p></div>
          <b>{demoEmployees.length}</b>
        </header>

        <label className="messages-search">
          <Search size={17}/>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={ar ? "ابحث بالاسم أو البريد..." : "Search by name or email..."}/>
        </label>

        <div className="messages-people-list">
          {employees.map((employee, index) => {
            const meta = conversationMeta[index % conversationMeta.length];
            const selected = active.id === employee.id;
            return <button key={employee.id} onClick={() => setActive(employee)} className={`messages-person ${selected ? "active" : ""}`}>
              <span className="messages-avatar">{employee.full_name[0]}<i/></span>
              <div className="messages-person-copy"><span><b>{employee.full_name}</b><time>{meta.time}</time></span><p>{meta.preview}</p><small>{employee.department?.name}</small></div>
              {meta.unread > 0 && !selected ? <em>{meta.unread}</em> : null}
            </button>;
          })}
          {!employees.length && <div className="messages-empty"><Search size={23}/><b>{ar ? "لا توجد نتائج" : "No results"}</b></div>}
        </div>
      </aside>

      <section className="messages-conversation">
        <header className="messages-conversation-heading">
          <span className="messages-avatar large">{active.full_name[0]}<i/></span>
          <div><h2>{active.full_name}</h2><p><i/>{ar ? "متصل الآن" : "Online now"}<span>·</span>{active.department?.name}</p></div>
          <span className="messages-private">{ar ? "محادثة خاصة" : "Private chat"}</span>
        </header>

        <div className="messages-thread">
          <div className="messages-day"><span>{ar ? "اليوم" : "Today"}</span></div>
          {messages.map((message) => <div key={message.id} className={`message-row ${message.mine ? "mine" : "theirs"}`}>
            {!message.mine && <span className="message-mini-avatar">{active.full_name[0]}</span>}
            <div className="message-bubble"><p>{message.body}</p><span>{message.time}{message.mine && <CheckCheck size={13}/>}</span></div>
          </div>)}
        </div>

        <footer className="messages-composer">
          <button type="button" onClick={() => setText((current) => `${current} 😊`)} aria-label={ar ? "إضافة رمز تعبيري" : "Add emoji"}><SmilePlus size={20}/></button>
          <input value={text} onChange={(event) => setText(event.target.value)} onKeyDown={(event) => event.key === "Enter" && send()} placeholder={ar ? "اكتب رسالتك هنا..." : "Write your message..."}/>
          <button type="button" className="messages-send" onClick={send} aria-label={ar ? "إرسال الرسالة" : "Send message"}><Send size={19}/><span>{ar ? "إرسال" : "Send"}</span></button>
        </footer>
      </section>
    </div>
    {!isSupabaseConfigured && <p className="mt-3 text-xs text-[var(--muted)]">{ar ? "وضع تجريبي: يتم عرض المحادثة داخل هذه الجلسة فقط." : "Demo mode: messages stay in this session only."}</p>}
  </AppShell>;
}
