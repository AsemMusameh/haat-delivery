"use client";

import {
  ArrowRight, Building2, Check, ClipboardCopy, Headphones, Phone, PhoneCall,
  Search, ShieldCheck, Store, UserRound, UtensilsCrossed,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { useLocale } from "@/components/locale-provider";
import { mcdonaldsBranches } from "@/lib/mcdonalds-branches";

type Contact = { name:string; phone:string; role?:string };
type Branch = { number:number; name:string; primary?:Contact; supervisor:Contact };

const branches:Branch[] = mcdonaldsBranches.map((branch) => ({
  number: branch.number,
  name: branch.name,
  primary: branch.branchManager ? { name: "Branch Manager", phone: branch.branchManager, role: "Branch Manager" } : undefined,
  supervisor: { name: "Supervisor", phone: branch.supervisor, role: "Supervisor" },
}));

const dial = (phone:string) => phone.replace(/\D/g, "");

export default function RestaurantsPage(){
  const { locale } = useLocale();
  const ar = locale === "ar";
  const [selectedBrand,setSelectedBrand] = useState(false);
  const [query,setQuery] = useState("");
  const filtered = useMemo(()=>{
    const term=query.trim().toLowerCase();
    if(!term)return branches;
    return branches.filter(branch=>`${branch.number} ${branch.name} ${branch.primary?.name||""} ${branch.primary?.phone||""} ${branch.supervisor.name} ${branch.supervisor.phone}`.toLowerCase().includes(term));
  },[query]);
  const copyPhone=async(phone:string)=>{await navigator.clipboard.writeText(phone);toast.success(ar?"تم نسخ الرقم":"Number copied")};

  return <AppShell title={ar?"التواصل مع المطاعم":"Restaurant Contacts"}>
    <section className="restaurant-hero">
      <div><span><ShieldCheck size={16}/>{ar?"دليل اتصال موحّد":"Verified contact directory"}</span><h2>{ar?"الرقم الصحيح، بدون بحث طويل":"The right number, without the long search"}</h2><p>{ar?"اختار المطعم والفرع، واتصل مباشرة بالشخص المناسب.":"Choose a restaurant and branch, then call the right contact."}</p></div>
      <i><Headphones size={34}/></i>
    </section>

    <section className="brand-picker card">
      <header><div><span>{ar?"الخطوة 1":"Step 1"}</span><h3>{ar?"اختار المطعم":"Choose the restaurant"}</h3></div>{selectedBrand&&<button type="button" onClick={()=>{setSelectedBrand(false);setQuery("")}}><ArrowRight size={15}/>{ar?"تغيير":"Change"}</button>}</header>
      <button type="button" className={`restaurant-brand ${selectedBrand?"selected":""}`} onClick={()=>setSelectedBrand(true)}>
        <i className="mcd-mark">M</i><span><b>{ar?"ماكدونالدز":"McDonald's"}</b><small>{branches.length} {ar?"فرع متاح":"branches available"}</small></span>{selectedBrand?<em><Check size={17}/>{ar?"تم الاختيار":"Selected"}</em>:<em>{ar?"عرض الفروع":"View branches"}</em>}
      </button>
    </section>

    {!selectedBrand?<section className="restaurant-empty card"><UtensilsCrossed size={34}/><h3>{ar?"اختار ماكدونالدز لعرض الأرقام":"Choose McDonald's to view the numbers"}</h3><p>{ar?"ستظهر لك جميع الفروع وأرقام التواصل بشكل مرتب.":"All branch contacts will appear in a clean list."}</p></section>:<>
      <section className="branch-tools card"><div><span><Building2 size={18}/>{ar?"فروع ماكدونالدز":"McDonald's branches"}</span><b>{filtered.length}</b></div><label><Search size={18}/><input value={query} onChange={event=>setQuery(event.target.value)} placeholder={ar?"ابحث باسم الفرع أو رقمه...":"Search by branch name or number..."}/></label></section>
      <div className="contact-tip"><PhoneCall size={18}/><p><b>{ar?"وصول سريع":"Quick access"}</b><span>{ar?"ابدأ بالرقم الأساسي، واستخدم رقم المشرف عند الحاجة.":"Start with the primary number, then use the supervisor if needed."}</span></p></div>
      <section className="branch-grid">{filtered.map(branch=><BranchCard key={branch.number} branch={branch} ar={ar} copyPhone={copyPhone}/>)}</section>
      {!filtered.length&&<section className="restaurant-empty card"><Search size={30}/><h3>{ar?"لا توجد نتائج":"No results"}</h3><p>{ar?"جرّب اسمًا أو رقم فرع آخر.":"Try another name or branch number."}</p></section>}
    </>}
  </AppShell>
}

function BranchCard({branch,ar,copyPhone}:{branch:Branch;ar:boolean;copyPhone:(phone:string)=>void}){
  const main=branch.primary||branch.supervisor;
  const backup=branch.primary?branch.supervisor:null;
  return <article className="branch-card card">
    <header><div><span>#{branch.number}</span><h3 dir="ltr">{branch.name}</h3></div><Store size={20}/></header>
    <ContactRow contact={main} label={ar?"الرقم الأساسي":"Primary contact"} primary ar={ar} copyPhone={copyPhone}/>
    {backup&&<ContactRow contact={backup} label={ar?"رقم المشرف":"Supervisor"} ar={ar} copyPhone={copyPhone}/>} 
  </article>
}

function ContactRow({contact,label,primary=false,ar,copyPhone}:{contact:Contact;label:string;primary?:boolean;ar:boolean;copyPhone:(phone:string)=>void}){
  return <div className={`contact-row ${primary?"primary":""}`}><i><UserRound size={18}/></i><div><span>{label}</span><b>{contact.name}</b><a dir="ltr" href={`tel:${dial(contact.phone)}`}>{contact.phone}</a></div><aside><a href={`tel:${dial(contact.phone)}`} title={ar?"اتصال":"Call"}><Phone size={17}/></a><button type="button" onClick={()=>copyPhone(contact.phone)} title={ar?"نسخ الرقم":"Copy number"}><ClipboardCopy size={16}/></button></aside></div>
}
