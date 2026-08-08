/* eslint-disable @typescript-eslint/no-explicit-any, @next/next/no-img-element */
"use client";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  AtSign,
  CalendarClock,
  Heart,
  ImagePlus,
  MessageCircle,
  Reply,
  Search,
  Send,
  SmilePlus,
  Trophy,
  Users,
  Video,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { useLocale } from "@/components/locale-provider";
import { mentionTargets, personByName } from "@/lib/community-people";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

type Comment = {
  id: string;
  author: string;
  authorId: string;
  role: string;
  body: string;
  created: string;
  likes: number;
  liked?: boolean;
  replies: Comment[];
};
type Post = {
  id: string;
  author: string;
  authorId: string;
  role: string;
  body: string;
  created: string;
  media?: string;
  mediaType?: "image" | "video";
  scheduledFor?: string;
  mentions: string[];
  reactions: Record<string, number>;
  reactionUsers: Record<string, string[]>;
  comments: Comment[];
  myReaction?: string;
};
type PeopleModal = { title: string; names: string[] } | null;
const initialPosts: Post[] = [
  {
    id: "p1",
    author: "سارة خالد",
    authorId: "sara-khaled",
    role: "مشرفة خدمة الزبائن",
    body: "فخورون بفريق تشات الزبائن بعد تحقيق أعلى تقييم رضا لهذا الشهر 🎉 شكراً لجهودكم والتزامكم. @قسم تشات الزبائن",
    created: "منذ 35 دقيقة",
    mentions: ["dep-chat"],
    reactions: { "❤️": 18, "👏": 12, "🎉": 9, "🔥": 0 },
    reactionUsers: {
      "❤️": ["محمد أحمد", "ليان عودة", "نور جرار", "محمود نصّار"],
      "👏": ["أحمد منصور", "ريم شحرور", "محمد أحمد"],
      "🎉": ["ليان عودة", "نور جرار"],
      "🔥": [],
    },
    comments: [
      {
        id: "c1",
        author: "محمود نصّار",
        authorId: "mahmoud-nassar",
        role: "تشات الزبائن",
        body: "مبروك للجميع! إنجاز نفتخر فيه 👏",
        created: "منذ 20 دقيقة",
        likes: 6,
        replies: [
          {
            id: "r1",
            author: "ريم شحرور",
            authorId: "reem-shahrour",
            role: "قائدة فريق",
            body: "تستاهلوا، يعطيكم العافية جميعاً 🌟",
            created: "منذ 12 دقيقة",
            likes: 3,
            replies: [],
          },
        ],
      },
      {
        id: "c2",
        author: "ليان عودة",
        authorId: "layan-awda",
        role: "فويس سنتر",
        body: "إنجاز رائع، والقادم أجمل بإذن الله.",
        created: "منذ 8 دقائق",
        likes: 4,
        replies: [],
      },
    ],
  },
  {
    id: "p2",
    author: "أحمد منصور",
    authorId: "ahmad-mansour",
    role: "مدير العمليات",
    body: "لقطات من تكريم فريق التوصيل في مكتب طولكرم. نجاحنا يبدأ من الأشخاص الذين يصنعون الفرق كل يوم.",
    created: "منذ ساعتين",
    media: "/haat-login-reference.png",
    mediaType: "image",
    mentions: ["all-employees"],
    reactions: { "❤️": 26, "👏": 21, "🎉": 0, "🔥": 7 },
    reactionUsers: {
      "❤️": ["سارة خالد", "محمد أحمد", "ريم شحرور"],
      "👏": ["نور جرار", "ليان عودة"],
      "🎉": [],
      "🔥": ["محمود نصّار"],
    },
    comments: [
      {
        id: "c3",
        author: "نور جرار",
        authorId: "noor-jarrar",
        role: "كنترول المرسلين",
        body: "كل الاحترام للفريق، ومنها للأعلى دائماً.",
        created: "منذ ساعة",
        likes: 9,
        replies: [],
      },
    ],
  },
];
const uuid = (value: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
const countComments = (items: Comment[]): number =>
  items.reduce((sum, item) => sum + 1 + countComments(item.replies), 0);
const commentNames = (items: Comment[]): string[] =>
  items.flatMap((item) => [item.author, ...commentNames(item.replies)]);
const profileId = (name: string, fallback?: string) =>
  personByName(name)?.id || fallback || "mohammad-ahmad";
function Avatar({
  name,
  id,
  small = false,
}: {
  name: string;
  id?: string;
  small?: boolean;
}) {
  return (
    <Link
      href={`/employees/${profileId(name, id)}`}
      aria-label={`فتح ملف ${name}`}
      className={`grid ${small ? "size-8 text-[10px]" : "size-11 text-sm"} shrink-0 place-items-center rounded-full bg-gradient-to-br from-rose-100 to-rose-200 font-black text-[var(--primary)] ring-2 ring-white transition hover:scale-105 hover:ring-rose-300`}
    >
      {name.trim()[0] || "H"}
    </Link>
  );
}
function MentionText({ text }: { text: string }) {
  const parts = text.split(/(@[^\s،.!?]+)/g);
  return (
    <>
      {parts.map((part, index) =>
        part.startsWith("@") ? (
          <span key={index} className="font-black text-[var(--primary)]">
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </>
  );
}

export default function Community() {
  const { locale } = useLocale();
  const ar = locale === "ar";
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [body, setBody] = useState("");
  const [media, setMedia] = useState<string>();
  const [mediaFile, setMediaFile] = useState<File>();
  const [mediaType, setMediaType] = useState<"image" | "video">("image");
  const [schedule, setSchedule] = useState("");
  const [selectedMentions, setSelectedMentions] = useState<string[]>([]);
  const [mentionOpen, setMentionOpen] = useState(false);
  const [mentionQuery, setMentionQuery] = useState("");
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [replying, setReplying] = useState<{
    postId: string;
    commentId: string;
    author: string;
  }>();
  const [peopleModal, setPeopleModal] = useState<PeopleModal>(null);
  const [currentUser, setCurrentUser] = useState({
    id: "",
    name: "محمد أحمد",
    profileId: "mohammad-ahmad",
    role: "موظف HAAT",
  });
  const fileRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const message = new URLSearchParams(window.location.search).get(
      "celebrate",
    );
    if (message) setBody(message);
    if (!isSupabaseConfigured) return;
    const s = createClient()!;
    (async () => {
      const {
        data: { user },
      } = await s.auth.getUser();
      if (user) {
        const { data: profile } = await s
          .from("profiles")
          .select("full_name,role")
          .eq("id", user.id)
          .maybeSingle();
        setCurrentUser({
          id: user.id,
          name: profile?.full_name || user.email || "HAAT",
          profileId: profileId(profile?.full_name || ""),
          role: profile?.role || "HAAT Employee",
        });
      }
      const { data } = await s
        .from("company_posts")
        .select(
          "*,author:profiles(full_name,role),post_reactions(emoji,user_id,user:profiles(full_name)),post_comments(id,body,created_at,parent_comment_id,author_id,author:profiles(full_name,role),comment_reactions(user_id))",
        )
        .lte("scheduled_for", new Date().toISOString())
        .order("created_at", { ascending: false });
      if (data?.length) {
        const mapComments = (rows: any[]) => {
          const mapped = new Map<string, Comment>();
          for (const row of rows || [])
            mapped.set(row.id, {
              id: row.id,
              author: row.author?.full_name || "HAAT",
              authorId: profileId(row.author?.full_name, row.author_id),
              role: row.author?.role || "موظف",
              body: row.body,
              created: new Date(row.created_at).toLocaleString(locale),
              likes: (row.comment_reactions || []).length,
              liked: (row.comment_reactions || []).some(
                (x: any) => x.user_id === user?.id,
              ),
              replies: [],
            });
          const roots: Comment[] = [];
          for (const row of rows || []) {
            const item = mapped.get(row.id);
            if (!item) continue;
            const parent = row.parent_comment_id
              ? mapped.get(row.parent_comment_id)
              : undefined;
            (parent ? parent.replies : roots).push(item);
          }
          return roots;
        };
        setPosts(
          data.map((post: any) => {
            const reactionUsers: Record<string, string[]> = {
              "❤️": [],
              "👏": [],
              "🎉": [],
              "🔥": [],
            };
            const reactions: Record<string, number> = {
              "❤️": 0,
              "👏": 0,
              "🎉": 0,
              "🔥": 0,
            };
            for (const reaction of post.post_reactions || []) {
              reactions[reaction.emoji] = (reactions[reaction.emoji] || 0) + 1;
              reactionUsers[reaction.emoji].push(
                reaction.user?.full_name || "موظف HAAT",
              );
            }
            return {
              id: post.id,
              author: post.author?.full_name || "HAAT",
              authorId: profileId(post.author?.full_name, post.author_id),
              role: post.author?.role || "فريق HAAT",
              body: post.body,
              created: new Date(post.created_at).toLocaleString(locale),
              media: post.media_url || post.image_url,
              mediaType: post.media_type || "image",
              scheduledFor: post.scheduled_for,
              mentions: post.mentions || [],
              reactions,
              reactionUsers,
              comments: mapComments(post.post_comments),
              myReaction: (post.post_reactions || []).find(
                (x: any) => x.user_id === user?.id,
              )?.emoji,
            };
          }),
        );
      }
    })();
  }, [locale]);
  const visibleTargets = useMemo(
    () =>
      mentionTargets.filter((t) =>
        `${t.label} ${t.subtitle}`.includes(mentionQuery),
      ),
    [mentionQuery],
  );
  const totalActivity = useMemo(
    () =>
      posts.reduce(
        (sum, p) =>
          sum +
          Object.values(p.reactions).reduce((a, b) => a + b, 0) +
          countComments(p.comments),
        0,
      ),
    [posts],
  );
  const pick = (file?: File) => {
    if (!file) return;
    if (file.size > 25_000_000) return toast.error("الحد الأقصى للملف 25MB");
    setMediaFile(file);
    setMediaType(file.type.startsWith("video") ? "video" : "image");
    setMedia(URL.createObjectURL(file));
  };
  const addMention = (id: string) => {
    const target = mentionTargets.find((t) => t.id === id);
    if (!target) return;
    setSelectedMentions((current) =>
      current.includes(id) ? current : [...current, id],
    );
    if (!body.includes(`@${target.label}`))
      setBody(
        (current) =>
          `${current}${current && !current.endsWith(" ") ? " " : ""}@${target.label} `,
      );
    setMentionOpen(false);
    setMentionQuery("");
  };
  const publish = async () => {
    if (!body.trim() && !media) return toast.error("اكتب محتوى أو أضف ملفاً");
    let id = `local-${Date.now()}`,
      finalMedia = media;
    const scheduled = schedule && new Date(schedule).getTime() > Date.now();
    if (isSupabaseConfigured && currentUser.id) {
      const s = createClient()!;
      if (mediaFile) {
        const path = `${currentUser.id}/${Date.now()}-${mediaFile.name.replace(/[^a-zA-Z0-9._-]/g, "-")}`;
        const uploaded = await s.storage
          .from("company-media")
          .upload(path, mediaFile, { contentType: mediaFile.type });
        if (!uploaded.error)
          finalMedia = s.storage.from("company-media").getPublicUrl(path)
            .data.publicUrl;
      }
      const payload = {
        author_id: currentUser.id,
        body: body.trim() || "مرفق",
        image_url: mediaType === "image" ? finalMedia : null,
        media_url: finalMedia,
        media_type: finalMedia ? mediaType : null,
        scheduled_for: scheduled
          ? new Date(schedule).toISOString()
          : new Date().toISOString(),
        mentions: selectedMentions.map(
          (id) => mentionTargets.find((target) => target.id === id)?.label || id,
        ),
      };
      const { data, error } = await s
        .from("company_posts")
        .insert(payload)
        .select("id")
        .single();
      if (!error && data) id = data.id;
      else if (!scheduled) {
        const fallback = await s
          .from("company_posts")
          .insert({
            author_id: currentUser.id,
            body: payload.body,
            image_url: payload.image_url,
          })
          .select("id")
          .single();
        if (fallback.data) id = fallback.data.id;
      }
    }
    const post: Post = {
      id,
      author: currentUser.name,
      authorId: currentUser.profileId,
      role: currentUser.role,
      body: body.trim() || "مرفق",
      created: scheduled
        ? `مجدول: ${new Date(schedule).toLocaleString("ar")}`
        : "الآن",
      media: finalMedia,
      mediaType,
      scheduledFor: scheduled ? schedule : undefined,
      mentions: selectedMentions,
      reactions: { "❤️": 0, "👏": 0, "🎉": 0, "🔥": 0 },
      reactionUsers: { "❤️": [], "👏": [], "🎉": [], "🔥": [] },
      comments: [],
    };
    setPosts((current) => [post, ...current]);
    setBody("");
    setMedia(undefined);
    setMediaFile(undefined);
    setSchedule("");
    setSelectedMentions([]);
    toast.success(scheduled ? "تمت جدولة المنشور" : "تم نشر المنشور");
  };
  const react = async (postId: string, emoji: string) => {
    const target = posts.find((p) => p.id === postId);
    if (!target) return;
    const previous = target.myReaction;
    setPosts((current) =>
      current.map((post) => {
        if (post.id !== postId) return post;
        const reactions = { ...post.reactions };
        const users = Object.fromEntries(
          Object.entries(post.reactionUsers).map(([key, value]) => [
            key,
            [...value],
          ]),
        );
        if (previous) {
          reactions[previous] = Math.max(0, reactions[previous] - 1);
          users[previous] = users[previous].filter(
            (n) => n !== currentUser.name,
          );
        }
        if (previous === emoji)
          return {
            ...post,
            reactions,
            reactionUsers: users,
            myReaction: undefined,
          };
        reactions[emoji] = (reactions[emoji] || 0) + 1;
        users[emoji] = [
          ...users[emoji].filter((n) => n !== currentUser.name),
          currentUser.name,
        ];
        return { ...post, reactions, reactionUsers: users, myReaction: emoji };
      }),
    );
    if (isSupabaseConfigured && uuid(postId) && currentUser.id) {
      const s = createClient()!;
      if (previous === emoji)
        await s
          .from("post_reactions")
          .delete()
          .eq("post_id", postId)
          .eq("user_id", currentUser.id);
      else
        await s
          .from("post_reactions")
          .upsert({ post_id: postId, user_id: currentUser.id, emoji });
    }
  };
  const addToTree = (
    items: Comment[],
    parentId: string | undefined,
    item: Comment,
  ): Comment[] =>
    parentId
      ? items.map((c) =>
          c.id === parentId
            ? { ...c, replies: [...c.replies, item] }
            : { ...c, replies: addToTree(c.replies, parentId, item) },
        )
      : [...items, item];
  const addComment = async (postId: string, parentId?: string) => {
    const key = parentId ? `${postId}:${parentId}` : postId;
    const value = drafts[key]?.trim();
    if (!value) return;
    let id = `local-${Date.now()}`;
    if (isSupabaseConfigured && uuid(postId) && currentUser.id) {
      const s = createClient()!;
      const result = await s
        .from("post_comments")
        .insert({
          post_id: postId,
          author_id: currentUser.id,
          body: value,
          parent_comment_id: parentId && uuid(parentId) ? parentId : null,
        })
        .select("id")
        .single();
      if (result.data) id = result.data.id;
    }
    const item: Comment = {
      id,
      author: currentUser.name,
      authorId: currentUser.profileId,
      role: currentUser.role,
      body: value,
      created: "الآن",
      likes: 0,
      replies: [],
    };
    setPosts((current) =>
      current.map((p) =>
        p.id === postId
          ? { ...p, comments: addToTree(p.comments, parentId, item) }
          : p,
      ),
    );
    setDrafts((current) => ({ ...current, [key]: "" }));
    setReplying(undefined);
  };
  const updateComment = (
    items: Comment[],
    id: string,
    fn: (item: Comment) => Comment,
  ): Comment[] =>
    items.map((item) =>
      item.id === id
        ? fn(item)
        : { ...item, replies: updateComment(item.replies, id, fn) },
    );
  const likeComment = (postId: string, id: string) =>
    setPosts((current) =>
      current.map((p) =>
        p.id === postId
          ? {
              ...p,
              comments: updateComment(p.comments, id, (item) => ({
                ...item,
                liked: !item.liked,
                likes: Math.max(0, item.likes + (item.liked ? -1 : 1)),
              })),
            }
          : p,
      ),
    );
  const CommentCard = ({
    item,
    postId,
    depth = 0,
  }: {
    item: Comment;
    postId: string;
    depth?: number;
  }) => {
    const key = `${postId}:${item.id}`;
    const active = replying?.commentId === item.id;
    return (
      <div className={depth ? "mt-3 border-s-2 border-rose-100 ps-3" : ""}>
        <div className="flex items-start gap-2.5">
          <Avatar name={item.author} id={item.authorId} small />
          <div className="min-w-0 flex-1">
            <div className="rounded-2xl rounded-tr-md bg-rose-50/80 px-3.5 py-2.5 dark:bg-rose-950/20">
              <div className="flex flex-wrap items-baseline gap-x-2">
                <Link
                  href={`/employees/${item.authorId}`}
                  className="text-xs font-black hover:text-[var(--primary)]"
                >
                  {item.author}
                </Link>
                <span className="text-[9px] text-[var(--muted)]">
                  {item.role} • {item.created}
                </span>
              </div>
              <p className="mt-1.5 text-xs leading-6">
                <MentionText text={item.body} />
              </p>
            </div>
            <div className="mt-1.5 flex gap-4 px-2 text-[10px] font-bold">
              <button
                className={
                  item.liked ? "text-[var(--primary)]" : "text-[var(--muted)]"
                }
                onClick={() => likeComment(postId, item.id)}
              >
                <Heart
                  size={12}
                  className="inline"
                  fill={item.liked ? "currentColor" : "none"}
                />{" "}
                إعجاب {item.likes || ""}
              </button>
              <button
                className="text-[var(--muted)]"
                onClick={() =>
                  setReplying(
                    active
                      ? undefined
                      : { postId, commentId: item.id, author: item.author },
                  )
                }
              >
                <Reply size={12} className="inline" /> رد
              </button>
            </div>
          </div>
        </div>
        {active && (
          <div className="ms-10 mt-2 flex gap-2">
            <input
              className="input h-9"
              autoFocus
              value={drafts[key] || ""}
              onChange={(e) => setDrafts({ ...drafts, [key]: e.target.value })}
              onKeyDown={(e) =>
                e.key === "Enter" && addComment(postId, item.id)
              }
              placeholder={`رد على ${item.author}...`}
            />
            <button
              className="toolbar-btn"
              onClick={() => addComment(postId, item.id)}
            >
              <Send size={15} />
            </button>
          </div>
        )}
        {item.replies.map((reply) => (
          <CommentCard
            key={reply.id}
            item={reply}
            postId={postId}
            depth={depth + 1}
          />
        ))}
      </div>
    );
  };
  return (
    <AppShell title={ar ? "مجتمع الشركة" : "Company Feed"}>
      <div className="mx-auto grid max-w-6xl gap-6 xl:grid-cols-[1fr_320px]">
        <section className="space-y-5">
          <article className="card p-5">
            <div className="flex gap-3">
              <Avatar name={currentUser.name} id={currentUser.profileId} />
              <div className="min-w-0 flex-1">
                <Link
                  href={`/employees/${currentUser.profileId}`}
                  className="mb-2 block text-xs font-black hover:text-[var(--primary)]"
                >
                  {currentUser.name}
                </Link>
                <textarea
                  className="input min-h-24 resize-none"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="شارك خبراً، إنجازاً أو فكرة مع فريق HAAT..."
                />
              </div>
            </div>
            {media && (
              <div className="relative mt-4 overflow-hidden rounded-2xl bg-black">
                {mediaType === "video" ? (
                  <video
                    src={media}
                    controls
                    className="max-h-[420px] w-full"
                  />
                ) : (
                  <img
                    src={media}
                    alt="معاينة المرفق"
                    className="max-h-[420px] w-full object-cover"
                  />
                )}
                <button
                  className="absolute left-3 top-3 grid size-8 place-items-center rounded-full bg-black/60 text-white"
                  onClick={() => {
                    setMedia(undefined);
                    setMediaFile(undefined);
                  }}
                >
                  <X size={15} />
                </button>
              </div>
            )}
            {selectedMentions.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {selectedMentions.map((id) => (
                  <span
                    key={id}
                    className="rounded-full bg-[var(--primary-soft)] px-2.5 py-1 text-[9px] font-bold text-[var(--primary)]"
                  >
                    @{mentionTargets.find((t) => t.id === id)?.label}
                  </span>
                ))}
              </div>
            )}
            <div className="relative mt-4 flex flex-wrap items-center gap-2 border-t border-[var(--line)] pt-4">
              <input
                ref={fileRef}
                hidden
                type="file"
                accept="image/*,video/*"
                onChange={(e) => pick(e.target.files?.[0])}
              />
              <button
                className="btn btn-secondary text-xs"
                onClick={() => fileRef.current?.click()}
              >
                {mediaType === "video" ? (
                  <Video size={17} />
                ) : (
                  <ImagePlus size={17} />
                )}
                صورة أو فيديو
              </button>
              <button
                className="btn btn-secondary text-xs"
                onClick={() => setMentionOpen(!mentionOpen)}
              >
                <AtSign size={17} />
                إشارة
              </button>
              <label className="btn btn-secondary cursor-pointer text-xs">
                <CalendarClock size={17} />
                جدولة
                <input
                  hidden
                  type="datetime-local"
                  value={schedule}
                  onChange={(e) => setSchedule(e.target.value)}
                />
              </label>
              {schedule && (
                <span className="rounded-full bg-amber-50 px-2 py-1 text-[9px] font-bold text-amber-700">
                  {new Date(schedule).toLocaleString("ar")}
                </span>
              )}
              <button onClick={publish} className="btn btn-primary ms-auto">
                <Send size={17} />
                {schedule ? "جدولة" : "نشر"}
              </button>
              {mentionOpen && (
                <div className="absolute right-0 top-full z-20 mt-2 w-full max-w-sm rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-3 shadow-2xl">
                  <label className="relative block">
                    <Search
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)]"
                      size={15}
                    />
                    <input
                      autoFocus
                      className="input h-9 pr-9"
                      placeholder="ابحث عن موظف، إدارة أو قسم"
                      value={mentionQuery}
                      onChange={(e) => setMentionQuery(e.target.value)}
                    />
                  </label>
                  <div className="mt-2 max-h-64 overflow-y-auto">
                    {visibleTargets.map((target) => (
                      <button
                        key={target.id}
                        onClick={() => addMention(target.id)}
                        className="flex w-full items-center gap-3 rounded-xl p-2.5 text-start hover:bg-[var(--surface-2)]"
                      >
                        <span className="grid size-8 place-items-center rounded-full bg-[var(--primary-soft)] text-[var(--primary)]">
                          {target.kind === "employee" ? (
                            target.label[0]
                          ) : (
                            <Users size={15} />
                          )}
                        </span>
                        <span>
                          <b className="block text-[10px]">{target.label}</b>
                          <small className="text-[8px] text-[var(--muted)]">
                            {target.subtitle}
                          </small>
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </article>
          {posts.map((post) => (
            <article key={post.id} className="card overflow-hidden">
              <div className="p-5">
                <div className="flex items-center gap-3">
                  <Avatar name={post.author} id={post.authorId} />
                  <div>
                    <Link
                      href={`/employees/${post.authorId}`}
                      className="block text-sm font-black hover:text-[var(--primary)]"
                    >
                      {post.author}
                    </Link>
                    <span className="text-[11px] text-[var(--muted)]">
                      {post.role} • {post.created}
                    </span>
                  </div>
                  {post.scheduledFor && (
                    <span className="ms-auto rounded-full bg-amber-50 px-2.5 py-1 text-[9px] font-bold text-amber-700">
                      <CalendarClock size={12} className="inline" /> مجدول
                    </span>
                  )}
                </div>
                <p className="mt-4 whitespace-pre-wrap text-sm leading-8">
                  <MentionText text={post.body} />
                </p>
              </div>
              {post.media &&
                (post.mediaType === "video" ? (
                  <div className="bg-black">
                    <video
                      src={post.media}
                      controls
                      className="max-h-[520px] w-full"
                    >
                      <track kind="captions" />
                    </video>
                  </div>
                ) : (
                  <img
                    src={post.media}
                    alt="مرفق المنشور"
                    className="max-h-[520px] w-full object-cover"
                  />
                ))}
              <div className="p-5">
                <div className="flex flex-wrap gap-2">
                  {["❤️", "👏", "🎉", "🔥"].map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => react(post.id, emoji)}
                      className={
                        post.myReaction === emoji
                          ? "rounded-full border border-[var(--primary)] bg-[var(--primary)] px-3 py-1.5 text-xs text-white"
                          : "rounded-full border border-[var(--line)] bg-[var(--surface-2)] px-3 py-1.5 text-xs hover:border-[var(--primary)]"
                      }
                    >
                      {emoji} {post.reactions[emoji] || 0}
                    </button>
                  ))}
                </div>
                <div className="my-4 flex items-center gap-5 border-y border-[var(--line)] py-3 text-xs font-bold text-[var(--muted)]">
                  <button
                    onClick={() =>
                      setPeopleModal({
                        title: "الأشخاص المتفاعلون",
                        names: Array.from(
                          new Set(Object.values(post.reactionUsers).flat()),
                        ),
                      })
                    }
                    className="flex items-center gap-2 hover:text-[var(--primary)]"
                  >
                    <Heart size={17} />
                    {Object.values(post.reactions).reduce(
                      (a, b) => a + b,
                      0,
                    )}{" "}
                    تفاعل
                  </button>
                  <button
                    onClick={() =>
                      setPeopleModal({
                        title: "الأشخاص المعلّقون",
                        names: Array.from(new Set(commentNames(post.comments))),
                      })
                    }
                    className="flex items-center gap-2 hover:text-[var(--primary)]"
                  >
                    <MessageCircle size={17} />
                    {countComments(post.comments)} تعليق ورد
                  </button>
                </div>
                <div className="space-y-3">
                  {post.comments.map((item) => (
                    <CommentCard key={item.id} item={item} postId={post.id} />
                  ))}
                </div>
                <div className="mt-4 flex items-center gap-2 border-t border-[var(--line)] pt-4">
                  <Avatar
                    name={currentUser.name}
                    id={currentUser.profileId}
                    small
                  />
                  <input
                    className="input"
                    value={drafts[post.id] || ""}
                    onChange={(e) =>
                      setDrafts({ ...drafts, [post.id]: e.target.value })
                    }
                    onKeyDown={(e) => e.key === "Enter" && addComment(post.id)}
                    placeholder="اكتب تعليقاً باسمك..."
                  />
                  <button
                    className="toolbar-btn shrink-0"
                    onClick={() => addComment(post.id)}
                  >
                    <Send size={17} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>
        <aside className="space-y-4">
          <article className="card p-5">
            <h3 className="flex items-center gap-2 font-black">
              <Trophy className="text-amber-500" size={20} />
              إنجازات هذا الشهر
            </h3>
            <ul className="mt-4 space-y-3 text-xs leading-6 text-[var(--muted)]">
              <li>🏆 96% رضا الزبائن</li>
              <li>🚀 أسرع وقت استجابة</li>
              <li>❤️ 150 موظفاً في فريق واحد</li>
            </ul>
          </article>
          <article className="card p-5">
            <h3 className="flex items-center gap-2 font-black">
              <SmilePlus size={19} />
              مجتمع إيجابي
            </h3>
            <p className="mt-2 text-xs leading-6 text-[var(--muted)]">
              اضغط على اسم أو صورة أي شخص لفتح ملفه. اضغط على عدد التفاعلات أو
              التعليقات لمعرفة أصحابها.
            </p>
            <div className="mt-4 rounded-2xl bg-rose-50 p-3 text-center text-[10px] font-bold text-rose-700">
              {totalActivity} تفاعل داخل المجتمع
            </div>
          </article>
        </aside>
      </div>
      {peopleModal && (
        <div
          className="fixed inset-0 z-[90] grid place-items-center bg-black/45 p-4"
          onMouseDown={() => setPeopleModal(null)}
        >
          <div
            className="card w-full max-w-md p-5"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-black">{peopleModal.title}</h3>
              <button
                className="toolbar-btn"
                onClick={() => setPeopleModal(null)}
              >
                <X size={16} />
              </button>
            </div>
            <div className="mt-4 max-h-[60vh] space-y-2 overflow-y-auto">
              {peopleModal.names.length === 0 ? (
                <p className="p-8 text-center text-xs text-[var(--muted)]">
                  لا يوجد أشخاص بعد
                </p>
              ) : (
                peopleModal.names.map((name) => {
                  const person = personByName(name);
                  return (
                    <Link
                      key={name}
                      href={`/employees/${person?.id || "mohammad-ahmad"}`}
                      className="flex items-center gap-3 rounded-2xl border border-[var(--line)] p-3 hover:bg-[var(--surface-2)]"
                    >
                      <Avatar name={name} id={person?.id} small />
                      <div>
                        <b className="block text-xs">{name}</b>
                        <span className="text-[9px] text-[var(--muted)]">
                          {person?.title || "موظف HAAT"}
                        </span>
                      </div>
                    </Link>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
