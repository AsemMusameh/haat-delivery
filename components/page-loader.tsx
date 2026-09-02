"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function PageLoader(){
  const pathname=usePathname();
  const[visible,setVisible]=useState(false);
  useEffect(()=>{const frame=requestAnimationFrame(()=>setVisible(false));return()=>cancelAnimationFrame(frame)},[pathname]);
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
      showTimer=setTimeout(()=>setVisible(true),120);
      safetyTimer=setTimeout(stop,1800);
    };
    document.addEventListener("click",start,true);window.addEventListener("pageshow",stop);
    return()=>{document.removeEventListener("click",start,true);window.removeEventListener("pageshow",stop);clearTimeout(showTimer);clearTimeout(safetyTimer)};
  },[]);
  if(!visible)return null;
  return <div className="route-progress" role="progressbar" aria-label="جارٍ فتح الصفحة"><i/></div>;
}
