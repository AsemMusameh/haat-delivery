"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { legacyEnglishEntries, Locale, messages } from "@/lib/i18n";

type LocaleMessages={ [K in keyof typeof messages.ar]: string };
const LocaleContext=createContext<{locale:Locale;setLocale:(locale:Locale)=>void;t:LocaleMessages}>({locale:"ar",setLocale:()=>{},t:messages.ar});
const originalText=new WeakMap<Node,string>();
const originalAttributes=new WeakMap<Element,Map<string,string>>();
const translatedNodes=new Set<Node>();
const translatedElements=new Set<Element>();
const attrs=["placeholder","title","aria-label"];
const initials:Record<string,string>={"أ":"A","م":"M","ل":"L","ر":"R","ن":"N","ك":"K","آ":"A","ع":"O","ج":"J","س":"S","ي":"Y","د":"D"};
function toEnglish(value:string){const trimmed=value.trim();if(trimmed.length===1&&initials[trimmed])return value.replace(trimmed,initials[trimmed]);let result=value;for(const[from,to]of legacyEnglishEntries)result=result.split(from).join(to);return result.replace(/[٠-٩]/g,d=>String("٠١٢٣٤٥٦٧٨٩".indexOf(d))).replace(/\sص(?=\s|$)/g," AM").replace(/\sم(?=\s|$)/g," PM").replaceAll("،",",")}
function translateTree(root:ParentNode){
 const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let node:Node|null;
 while((node=walker.nextNode())){if(node.parentElement?.closest("[data-no-auto-translate]"))continue;const value=node.textContent??"";if(!/[؀-ۿ]/.test(value))continue;if(!originalText.has(node))originalText.set(node,value);node.textContent=toEnglish(value);translatedNodes.add(node)}
 const elements=root instanceof Element?[root,...Array.from(root.querySelectorAll("*"))]:Array.from(root.querySelectorAll("*"));
 for(const el of elements){if(el.closest("[data-no-auto-translate]"))continue;for(const attr of attrs){const value=el.getAttribute(attr);if(!value||!/[؀-ۿ]/.test(value))continue;let originals=originalAttributes.get(el);if(!originals){originals=new Map();originalAttributes.set(el,originals)}if(!originals.has(attr))originals.set(attr,value);el.setAttribute(attr,toEnglish(value));translatedElements.add(el)}}
}
function restoreArabic(){for(const node of translatedNodes){const value=originalText.get(node);if(value!==undefined&&node.isConnected)node.textContent=value}for(const el of translatedElements){const originals=originalAttributes.get(el);if(el.isConnected)originals?.forEach((v,k)=>el.setAttribute(k,v))}translatedNodes.clear();translatedElements.clear()}
export function LocaleProvider({children}:{children:React.ReactNode}){
 const[locale,setLocaleState]=useState<Locale>("ar");
 useEffect(()=>{const saved=localStorage.getItem("preferred-locale") as Locale|null;if(saved==="ar"||saved==="en")setLocaleState(saved)},[]);
 useEffect(()=>{document.documentElement.lang=locale;document.documentElement.dir=locale==="ar"?"rtl":"ltr";if(locale==="ar"){restoreArabic();return}translateTree(document.body);const observer=new MutationObserver(records=>{for(const record of records){if(record.type==="characterData"&&record.target.parentNode)translateTree(record.target.parentNode);for(const added of record.addedNodes)if(added instanceof Element)translateTree(added)}});observer.observe(document.body,{subtree:true,childList:true,characterData:true});return()=>observer.disconnect()},[locale]);
 const value=useMemo(()=>({locale,setLocale:(next:Locale)=>{setLocaleState(next);localStorage.setItem("preferred-locale",next)},t:messages[locale]}),[locale]);
 return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}
export const useLocale=()=>useContext(LocaleContext);
