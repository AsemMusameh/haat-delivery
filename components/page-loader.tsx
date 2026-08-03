"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function PageLoader(){
  const pathname=usePathname();
  const[visible,setVisible]=useState(false);
  useEffect(()=>{setVisible(false)},[pathname]);
  useEffect(()=>{
    let showTimer:ReturnType<typeof setTimeout>|undefined;
    let safetyTimer:ReturnType<typeof setTimeout>|undefined;
    const stop=()=>{clearTimeout(showTimer);clearTimeout(safetyTimer);setVisible(false)};
    const start=(event:MouseEvent)=>{
      const target=event.target as HTMLElement|null;
      const link=target?.closest("a");
      if(!link?.href||link.hasAttribute("download")||link.target==="_blank"||event.defaultPrevented)return;
      const next=new URL(link.href,location.href),current=new URL(location.href);
      if(next.origin!==current.origin||(next.pathname===current.pathname&&next.search===current.search))return;
      clearTimeout(showTimer);clearTimeout(safetyTimer);
      showTimer=setTimeout(()=>setVisible(true),180);
      safetyTimer=setTimeout(stop,3200);
    };
    document.addEventListener("click",start,true);window.addEventListener("pageshow",stop);
    return()=>{document.removeEventListener("click",start,true);window.removeEventListener("pageshow",stop);clearTimeout(showTimer);clearTimeout(safetyTimer)};
  },[]);
  if(!visible)return null;
  return <div className="page-loader" role="status" aria-live="polite" aria-label="جارٍ تجهيز الصفحة"><div className="loader-scene"><span className="loader-orbit"><i/><i/><i/></span><div className="loader-logo"><img src="/haat-logo.png" alt=""/></div><strong>لحظات ونوصلك…</strong><small>نجهّز لك الصفحة</small><span className="loader-track"><i/></span></div></div>;
}
