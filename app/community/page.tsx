"use client";

import { Heart, ImagePlus, MessageCircle, Reply, Send, SmilePlus, Trophy, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { useLocale } from "@/components/locale-provider";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

type FeedComment={
 id:string;author:string;role:string;body:string;created:string;avatar?:string;
 likes:number;liked?:boolean;replies:FeedComment[];
};
type FeedPost={
 id:string;author:string;role:string;body:string;created:string;avatar?:string;image?:string;
 reactions:Record<string,number>;comments:FeedComment[];myReaction?:string;
};
type ReplyTarget={postId:string;commentId:string;author:string};

const initialPosts:FeedPost[]=[
 {id:"p1",author:"سارة خالد",role:"مشرفة خدمة الزبائن",body:"فخورون بفريق تشات الزبائن بعد تحقيق أعلى تقييم رضا لهذا الشهر 🎉 شكراً لجهودكم والتزامكم.",created:"منذ 35 دقيقة",reactions:{"❤️":18,"👏":12,"🎉":9},comments:[
  {id:"c1",author:"محمود نصّار",role:"Customer Chat",body:"مبروك للجميع! إنجاز نفتخر فيه 👏",created:"منذ 20 دقيقة",likes:6,replies:[{id:"r1",author:"ريم شحرور",role:"Team Leader",body:"تستاهلوا، يعطيكم العافية جميعاً 🌟",created:"منذ 12 دقيقة",likes:3,replies:[]}]},
  {id:"c2",author:"ليان عودة",role:"Voice Center",body:"إنجاز رائع، والقادم أجمل بإذن الله.",created:"منذ 8 دقائق",likes:4,replies:[]}
 ]},
 {id:"p2",author:"أحمد منصور",role:"مدير العمليات",body:"صور من تكريم فريق التوصيل في مكتب طولكرم. نجاحنا يبدأ من الأشخاص الذين يصنعون الفرق كل يوم.",created:"منذ ساعتين",image:"/haat-login-reference.png",reactions:{"❤️":26,"👏":21,"🔥":7},comments:[
  {id:"c3",author:"نور جرار",role:"Control",body:"كل الاحترام للفريق، ومنها للأعلى دائماً.",created:"منذ ساعة",likes:9,replies:[]}
 ]}
];

const uuid=(value:string)=>/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
const countComments=(comments:FeedComment[])=>comments.reduce((sum,item)=>sum+1+countComments(item.replies),0);

function Avatar({name,src,small=false}:{name:string;src?:string;small?:boolean}){
 const size=small?"size-8 text-[10px]":"size-11 text-sm";
 return <span className={`grid ${size} shrink-0 place-items-center overflow-hidden rounded-full bg-gradient-to-br from-rose-100 to-rose-200 font-black text-[var(--primary)] ring-2 ring-white`}>
  {src?.startsWith("http")?<img src={src} alt={name} className="size-full object-cover"/>:<span>{name.trim().slice(0,1)||"H"}</span>}
 </span>;
}

function buildComments(rows:any[],locale:string,currentUserId?:string):FeedComment[]{
 const mapped=new Map<string,FeedComment>();
 for(const row of rows||[])mapped.set(row.id,{id:row.id,author:row.author?.full_name||"HAAT Team",role:row.author?.role||"HAAT Employee",avatar:row.author?.avatar_url,body:row.body,created:new Date(row.created_at).toLocaleString(locale),likes:(row.comment_reactions||[]).length,liked:(row.comment_reactions||[]).some((item:any)=>item.user_id===currentUserId),replies:[]});
 const roots:FeedComment[]=[];
 for(const row of rows||[]){const item=mapped.get(row.id);if(!item)continue;const parent=row.parent_comment_id?mapped.get(row.parent_comment_id):undefined;(parent?parent.replies:roots).push(item)}
 return roots;
}

export default function Community(){
 const{locale}=useLocale();const ar=locale==="ar";
 const[posts,setPosts]=useState(initialPosts);const[body,setBody]=useState("");const[image,setImage]=useState<string>();
 const[drafts,setDrafts]=useState<Record<string,string>>({});const[replying,setReplying]=useState<ReplyTarget>();
 const[currentUser,setCurrentUser]=useState({id:"",name:ar?"محمد أحمد":"Mohammad Ahmad",role:ar?"موظف HAAT":"HAAT Employee",avatar:""});

 useEffect(()=>{const timer=window.setTimeout(()=>{const message=new URLSearchParams(window.location.search).get("celebrate");if(message)setBody(message)},0);return()=>window.clearTimeout(timer)},[]);

 useEffect(()=>{setCurrentUser(user=>({...user,name:ar?"محمد أحمد":"Mohammad Ahmad",role:ar?"موظف HAAT":"HAAT Employee"}))},[ar]);
 useEffect(()=>{if(!isSupabaseConfigured)return;const s=createClient()!;(async()=>{
  const{data:{user}}=await s.auth.getUser();
  if(user){const{data:profile}=await s.from("profiles").select("full_name,role,avatar_url").eq("id",user.id).maybeSingle();setCurrentUser({id:user.id,name:profile?.full_name||user.email||"HAAT",role:profile?.role||"HAAT Employee",avatar:profile?.avatar_url||""})}
  const{data,error}=await s.from("company_posts").select("*,author:profiles(full_name,role,avatar_url),post_reactions(emoji,user_id),post_comments(id,body,created_at,parent_comment_id,author_id,author:profiles(full_name,role,avatar_url),comment_reactions(user_id))").order("created_at",{ascending:false});
  if(error)return;
  if(data?.length)setPosts(data.map((post:any)=>({id:post.id,author:post.author?.full_name||"HAAT",role:post.author?.role||"HAAT Team",avatar:post.author?.avatar_url,body:post.body,created:new Date(post.created_at).toLocaleString(locale),image:post.image_url,reactions:(post.post_reactions||[]).reduce((all:Record<string,number>,reaction:any)=>(all[reaction.emoji]=(all[reaction.emoji]||0)+1,all),{}),comments:buildComments(post.post_comments,locale,user?.id),myReaction:(post.post_reactions||[]).find((reaction:any)=>reaction.user_id===user?.id)?.emoji})))
 })()},[locale]);

 const totalActivity=useMemo(()=>posts.reduce((sum,post)=>sum+Object.values(post.reactions).reduce((a,b)=>a+b,0)+countComments(post.comments),0),[posts]);
 const pick=(file?:File)=>{if(file){if(file.size>5_000_000)return toast.error(ar?"حجم الصورة أكبر من 5MB":"Image must be under 5MB");setImage(URL.createObjectURL(file))}};
 const publish=async()=>{if(!body.trim())return toast.error(ar?"اكتب محتوى المنشور أولاً":"Write something first");let postId=`local-${Date.now()}`;if(isSupabaseConfigured){const s=createClient()!;const{data,error}=await s.from("company_posts").insert({author_id:currentUser.id,body:body.trim()}).select("id").single();if(error)return toast.error(error.message);postId=data.id}setPosts([{id:postId,author:currentUser.name,role:currentUser.role,avatar:currentUser.avatar,body:body.trim(),created:ar?"الآن":"Now",image,reactions:{},comments:[]},...posts]);setBody("");setImage(undefined);toast.success(ar?"تم نشر المنشور":"Post published")};
 const react=async(id:string,emoji:string)=>{const post=posts.find(item=>item.id===id);if(!post)return;setPosts(posts.map(item=>{if(item.id!==id)return item;const next={...item.reactions};if(item.myReaction)next[item.myReaction]=Math.max(0,(next[item.myReaction]||0)-1);if(item.myReaction===emoji)return{...item,reactions:next,myReaction:undefined};next[emoji]=(next[emoji]||0)+1;return{...item,reactions:next,myReaction:emoji}}));if(isSupabaseConfigured&&uuid(id)&&currentUser.id){const s=createClient()!;if(post.myReaction===emoji)await s.from("post_reactions").delete().eq("post_id",id).eq("user_id",currentUser.id);else await s.from("post_reactions").upsert({post_id:id,user_id:currentUser.id,emoji})}};

 const addCommentToTree=(items:FeedComment[],parentId:string|undefined,newComment:FeedComment):FeedComment[]=>parentId?items.map(item=>item.id===parentId?{...item,replies:[...item.replies,newComment]}:{...item,replies:addCommentToTree(item.replies,parentId,newComment)}):[...items,newComment];
 const addComment=async(postId:string,parentId?:string)=>{const key=parentId?`${postId}:${parentId}`:postId;const value=drafts[key]?.trim();if(!value)return;let commentId=`local-${Date.now()}`;if(isSupabaseConfigured&&uuid(postId)&&currentUser.id){const s=createClient()!;const{data,error}=await s.from("post_comments").insert({post_id:postId,author_id:currentUser.id,body:value,parent_comment_id:parentId&&uuid(parentId)?parentId:null}).select("id").single();if(error)return toast.error(error.message);commentId=data.id}const item:FeedComment={id:commentId,author:currentUser.name,role:currentUser.role,avatar:currentUser.avatar,body:value,created:ar?"الآن":"Now",likes:0,replies:[]};setPosts(posts.map(post=>post.id===postId?{...post,comments:addCommentToTree(post.comments,parentId,item)}:post));setDrafts({...drafts,[key]:""});setReplying(undefined)};
 const updateComment=(items:FeedComment[],commentId:string,change:(item:FeedComment)=>FeedComment):FeedComment[]=>items.map(item=>item.id===commentId?change(item):{...item,replies:updateComment(item.replies,commentId,change)});
 const likeComment=async(postId:string,commentId:string)=>{let wasLiked=false;setPosts(posts.map(post=>post.id===postId?{...post,comments:updateComment(post.comments,commentId,item=>(wasLiked=!!item.liked,{...item,liked:!item.liked,likes:Math.max(0,item.likes+(item.liked?-1:1))}))}:post));if(isSupabaseConfigured&&uuid(commentId)&&currentUser.id){const s=createClient()!;if(wasLiked)await s.from("comment_reactions").delete().eq("comment_id",commentId).eq("user_id",currentUser.id);else await s.from("comment_reactions").upsert({comment_id:commentId,user_id:currentUser.id})}};

 const CommentCard=({item,postId,depth=0}:{item:FeedComment;postId:string;depth?:number})=>{
  const key=`${postId}:${item.id}`;const isReplying=replying?.postId===postId&&replying.commentId===item.id;
  return <div className={depth?"mt-3 border-s-2 border-rose-100 ps-3":""}>
   <div className="flex items-start gap-2.5"><Avatar name={item.author} src={item.avatar} small/><div className="min-w-0 flex-1"><div className="rounded-2xl rounded-tr-md bg-rose-50/80 px-3.5 py-2.5 dark:bg-rose-950/20"><div className="flex flex-wrap items-baseline gap-x-2"><b className="text-xs text-[var(--text)]">{item.author}</b><span className="text-[9px] text-[var(--muted)]">{item.role} · {item.created}</span></div><p className="mt-1.5 whitespace-pre-wrap text-xs leading-6 text-[var(--text)]">{item.body}</p></div><div className="mt-1.5 flex items-center gap-4 px-2 text-[10px] font-bold"><button onClick={()=>likeComment(postId,item.id)} className={`flex items-center gap-1 ${item.liked?"text-[var(--primary)]":"text-[var(--muted)] hover:text-[var(--primary)]"}`}><Heart size={12} fill={item.liked?"currentColor":"none"}/>{ar?"إعجاب":"Like"}{item.likes>0&&<span>{item.likes}</span>}</button><button onClick={()=>{setReplying(isReplying?undefined:{postId,commentId:item.id,author:item.author});setTimeout(()=>document.getElementById(`reply-${item.id}`)?.focus(),20)}} className="flex items-center gap-1 text-[var(--muted)] hover:text-[var(--primary)]"><Reply size={12}/>{ar?"رد":"Reply"}</button></div></div></div>
   {isReplying&&<div className="ms-10 mt-2 rounded-2xl border border-rose-100 bg-white p-2 shadow-sm dark:bg-[var(--surface)]"><div className="mb-1.5 flex items-center justify-between px-1 text-[10px] text-[var(--muted)]"><span>{ar?"رد على":"Replying to"} <b className="text-[var(--primary)]">{item.author}</b></span><button aria-label={ar?"إلغاء الرد":"Cancel reply"} onClick={()=>setReplying(undefined)}><X size={13}/></button></div><div className="flex gap-2"><input id={`reply-${item.id}`} className="input h-9 text-xs" value={drafts[key]||""} onChange={event=>setDrafts({...drafts,[key]:event.target.value})} onKeyDown={event=>event.key==="Enter"&&addComment(postId,item.id)} placeholder={ar?"اكتب ردك...":"Write a reply..."}/><button className="toolbar-btn size-9 shrink-0" onClick={()=>addComment(postId,item.id)} aria-label={ar?"إرسال الرد":"Send reply"}><Send size={15}/></button></div></div>}
   {item.replies.map(reply=><CommentCard key={reply.id} item={reply} postId={postId} depth={depth+1}/>)}
  </div>;
 };

 return <AppShell title={ar?"مجتمع الشركة":"Company Feed"}>
  <div className="mx-auto grid max-w-6xl gap-6 xl:grid-cols-[1fr_320px]">
   <section className="space-y-5">
    <article className="card p-5"><div className="flex gap-3"><Avatar name={currentUser.name} src={currentUser.avatar}/><div className="min-w-0 flex-1"><b className="mb-2 block text-xs">{currentUser.name}</b><textarea className="input min-h-24 resize-none" value={body} onChange={event=>setBody(event.target.value)} placeholder={ar?"شارك خبراً، إنجازاً، أو فكرة مع فريق HAAT...":"Share news, an achievement, or an idea with HAAT..."}/></div></div>{image&&<img src={image} alt="Post preview" className="mt-4 max-h-72 w-full rounded-2xl object-cover"/>}<div className="mt-4 flex items-center justify-between border-t border-[var(--line)] pt-4"><label className="btn btn-secondary cursor-pointer text-xs"><ImagePlus size={17}/>{ar?"إضافة صورة":"Add photo"}<input hidden type="file" accept="image/*" onChange={event=>pick(event.target.files?.[0])}/></label><button onClick={publish} className="btn btn-primary"><Send size={17}/>{ar?"نشر":"Post"}</button></div></article>
    {posts.map(post=><article key={post.id} className="card overflow-hidden"><div className="p-5"><div className="flex items-center gap-3"><Avatar name={post.author} src={post.avatar}/><div><b className="block text-sm">{post.author}</b><span className="text-[11px] text-[var(--muted)]">{post.role} · {post.created}</span></div></div><p className="mt-4 whitespace-pre-wrap text-sm leading-8">{post.body}</p></div>{post.image&&<img src={post.image} alt="" className="max-h-[470px] w-full object-cover"/>}<div className="p-5"><div className="flex flex-wrap gap-2">{["❤️","👏","🎉","🔥"].map(emoji=><button key={emoji} onClick={()=>react(post.id,emoji)} aria-pressed={post.myReaction===emoji} className={post.myReaction===emoji?"rounded-full border border-[var(--primary)] bg-[var(--primary)] px-3 py-1.5 text-xs text-white":"rounded-full border border-[var(--line)] bg-[var(--surface-2)] px-3 py-1.5 text-xs hover:border-[var(--primary)]"}>{emoji} {post.reactions[emoji]||0}</button>)}</div><div className="my-4 flex items-center gap-5 border-y border-[var(--line)] py-3 text-xs font-bold text-[var(--muted)]"><span className="flex items-center gap-2"><Heart size={17}/>{Object.values(post.reactions).reduce((a,b)=>a+b,0)} {ar?"تفاعل":"reactions"}</span><span className="flex items-center gap-2"><MessageCircle size={17}/>{countComments(post.comments)} {ar?"تعليق ورد":"comments & replies"}</span></div><div className="space-y-3">{post.comments.map(item=><CommentCard key={item.id} item={item} postId={post.id}/>)}</div><div className="mt-4 flex items-center gap-2 border-t border-[var(--line)] pt-4"><Avatar name={currentUser.name} src={currentUser.avatar} small/><input className="input" value={drafts[post.id]||""} onChange={event=>setDrafts({...drafts,[post.id]:event.target.value})} onKeyDown={event=>event.key==="Enter"&&addComment(post.id)} placeholder={ar?"اكتب تعليقاً باسمك...":"Comment as yourself..."}/><button className="toolbar-btn shrink-0" onClick={()=>addComment(post.id)} aria-label={ar?"إرسال التعليق":"Send comment"}><Send size={17}/></button></div></div></article>)}
   </section>
   <aside className="space-y-4"><article className="card p-5"><h3 className="flex items-center gap-2 font-black"><Trophy className="text-amber-500" size={20}/>{ar?"إنجازات هذا الشهر":"This month’s wins"}</h3><ul className="mt-4 space-y-3 text-xs leading-6 text-[var(--muted)]"><li>🏆 {ar?"96% رضا الزبائن":"96% customer satisfaction"}</li><li>🚀 {ar?"أسرع وقت استجابة":"Fastest response time"}</li><li>❤️ {ar?"150 موظفاً في فريق واحد":"150 employees, one team"}</li></ul></article><article className="card p-5"><h3 className="flex items-center gap-2 font-black"><SmilePlus size={19}/>{ar?"مجتمع إيجابي":"A positive community"}</h3><p className="mt-2 text-xs leading-6 text-[var(--muted)]">{ar?"كل منشور وتعليق يظهر باسم صاحبه. شارك باحترام، احتفل بزملائك، وحافظ على خصوصية معلومات الزبائن.":"Every post and comment shows its author. Post respectfully, celebrate teammates, and protect customer privacy."}</p><div className="mt-4 rounded-2xl bg-rose-50 p-3 text-center text-[10px] font-bold text-rose-700">{totalActivity} {ar?"تفاعل داخل المجتمع":"community interactions"}</div></article></aside>
  </div>
 </AppShell>;
}
