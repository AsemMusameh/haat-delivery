"use client";

import {
  ArrowRight, Building2, Check, ClipboardCopy, Headphones, Phone, PhoneCall,
  Search, ShieldCheck, Store, UserRound, UtensilsCrossed,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { useLocale } from "@/components/locale-provider";

type Contact = { name:string; phone:string; role?:string };
type Branch = { number:number; name:string; primary?:Contact; supervisor:Contact };

const branches:Branch[] = [
  {number:49,name:"Haifa Mall",supervisor:{name:"Isra Haj",phone:"050-9013822"}},
  {number:63,name:"City Center, Haifa",primary:{name:"Hadil Sheikh Ahmad",phone:"054-9960655",role:"Restaurant Manager"},supervisor:{name:"Omer Rolnitsky",phone:"054-7241135"}},
  {number:71,name:"Grand Canyon Haifa – Floor 1",primary:{name:"Khaled Amriya",phone:"050-3048631",role:"Restaurant Manager"},supervisor:{name:"Asraa Daroubi",phone:"054-3225530"}},
  {number:74,name:"Hatzrot Jaffa",supervisor:{name:"Wiam Aboy",phone:"052-7701509"}},
  {number:79,name:"Hadar Haifa",primary:{name:"Omri Huash",phone:"052-5483199",role:"Branch Supervisor"},supervisor:{name:"Isra Haj",phone:"050-9013822"}},
  {number:103,name:"Karmiel Center",primary:{name:"Razan Khawalad",phone:"054-4406428",role:"Restaurant Manager"},supervisor:{name:"Balsam Azaizeh",phone:"054-9830338"}},
  {number:107,name:"Wolfson Holon",primary:{name:"Ahmad Makawi",phone:"053-6220791",role:"Branch Supervisor"},supervisor:{name:"Amran Mjahad",phone:"054-8387174"}},
  {number:119,name:"Tel Hanan (Kosher)",primary:{name:"Miriam Rana Kanaan",phone:"055-9800826",role:"Branch Supervisor"},supervisor:{name:"Hekmat Saka",phone:"050-6708483"}},
  {number:122,name:"Har Yona, Nof HaGalil",supervisor:{name:"Mustafa Yosef",phone:"052-2896319"}},
  {number:144,name:"Dodge Center, Nof HaGalil",primary:{name:"Mias Abu Ahmad",phone:"058-5752545",role:"Branch Supervisor"},supervisor:{name:"Ganit Mahali",phone:"054-9300922"}},
  {number:154,name:"Sakhnin",primary:{name:"Jamil Nasser",phone:"054-4546135",role:"FIRST"},supervisor:{name:"Fahim Abu Younes",phone:"054-2399547"}},
  {number:164,name:"Kochav Ya’ir",primary:{name:"Hiba Masarwa",phone:"052-5003383",role:"Restaurant Manager"},supervisor:{name:"Liat Shkouri",phone:"050-4443063"}},
  {number:183,name:"Azrieli Mall, Acre",primary:{name:"Sandra Makhlouf",phone:"058-4783666",role:"Branch Supervisor"},supervisor:{name:"Mustafa Yosef",phone:"052-2896319"}},
  {number:211,name:"Nazareth – Church of the Annunciation",primary:{name:"Ragad Mansour",phone:"052-8635453",role:"Restaurant Manager"},supervisor:{name:"Ibrahim Hamoudeh",phone:"054-6075041"}},
  {number:220,name:"Star Nahariya (Kosher)",primary:{name:"Hayat Haboush",phone:"050-7703994",role:"Restaurant Manager"},supervisor:{name:"Noy Zaguri",phone:"054-6495217"}},
  {number:223,name:"Planet Jerusalem",primary:{name:"Bilal Sub Laban",phone:"053-8870799",role:"Restaurant Manager"},supervisor:{name:"Amran Mjahad",phone:"054-8387174"}},
  {number:242,name:"Umm al-Fahm Seven",primary:{name:"Lama Mahamid",phone:"054-3199742",role:"Branch Supervisor"},supervisor:{name:"Hanan Ali Hussein",phone:"052-8922897"}},
  {number:243,name:"Big Yarka",primary:{name:"Hanan Lababidi",phone:"050-3358818",role:"Restaurant Manager"},supervisor:{name:"Ibrahim Hamoudeh",phone:"054-6075041"}},
  {number:246,name:"Orion Jerusalem",primary:{name:"Adnan Basti",phone:"054-6230809",role:"FIRST"},supervisor:{name:"Muhammad Shahadeh",phone:"050-3103238"}},
  {number:250,name:"Emek Center",primary:{name:"Hala Zoabi",phone:"052-9638799",role:"FIRST"},supervisor:{name:"Iman Zoabi",phone:"054-3393292"}},
  {number:262,name:"Baka – We Center",primary:{name:"Naba Kattawi",phone:"050-2725787",role:"FIRST"},supervisor:{name:"Amir Wawiya",phone:"052-8877122"}},
  {number:268,name:"Afula Central Station (Kosher)",primary:{name:"Noa Azulay",phone:"053-3347256",role:"FIRST"},supervisor:{name:"Sharon Shalom Almakes",phone:"054-2866132"}},
  {number:270,name:"Dushi Center",primary:{name:"Yaman Abu Ras",phone:"054-2682625",role:"Branch Supervisor"},supervisor:{name:"Alaa Khatib",phone:"052-3044138"}},
  {number:271,name:"Grand Canyon Haifa – Food Court Floor 3 (Kosher)",primary:{name:"Lian Zivak",phone:"052-5615873",role:"Restaurant Manager"},supervisor:{name:"Asraa Daroubi",phone:"054-3225530"}},
  {number:274,name:"Sha'ar Palmer",primary:{name:"Adam Awad",phone:"054-9430354",role:"Restaurant Manager"},supervisor:{name:"Alaa Khatib",phone:"052-3044138"}},
  {number:275,name:"Bi'na – Deir al-Asad, Dabbah Mall",primary:{name:"Saleh Farhat",phone:"055-6855161",role:"SECOND"},supervisor:{name:"Kobi-Yaakov Kadosh",phone:"054-2574007"}},
  {number:279,name:"Shefa-Amr",primary:{name:"Fatma Tantouri",phone:"053-4858799",role:"Restaurant Manager"},supervisor:{name:"Nermin Shahadeh",phone:"054-5220173"}},
  {number:280,name:"Tira",primary:{name:"Ouday Jamhour",phone:"053-6434804",role:"SECOND"},supervisor:{name:"Amir Wawiya",phone:"052-8877122"}},
  {number:296,name:"Tayibe",primary:{name:"Muhammad Wawiya",phone:"054-9957661",role:"Branch Supervisor"},supervisor:{name:"Amir Wawiya",phone:"052-8877122"}},
  {number:303,name:"Rahat Seven",primary:{name:"Maysa Abu Hamed",phone:"054-3330503",role:"Restaurant Manager"},supervisor:{name:"Ranin Hamed",phone:"054-4381957"}},
  {number:306,name:"Tamra SEVEN",primary:{name:"Islam Mughrabi",phone:"054-6470588",role:"Restaurant Manager"},supervisor:{name:"Khaled Suleiman",phone:"054-3277807"}},
  {number:308,name:"Talpiot Jerusalem (Kosher)",primary:{name:"Munther Shouman",phone:"058-7600033",role:"Restaurant Manager"},supervisor:{name:"Amran Mjahad",phone:"054-8387174"}},
];

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
