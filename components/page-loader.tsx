"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function PageLoader(){
  const pathname=usePathname();
  const[visible,setVisible]=useState(false);
  useEffect(()=>{setVisible(false)},[pathname]);
  useEffect(()=>{
    const start=(event:MouseEvent)=>{const target=event.target as HTMLElement|null;const link=target?.closest("a");if(link&&link.href&&new URL(link.href).origin===location.origin&&!link.hasAttribute("download"))setVisible(true)};
    document.addEventListener("click",start,true);
    return()=>document.removeEventListener("click",start,true);
  },[]);
  if(!visible)return null;
  return <div className="page-loader" role="status" aria-label="Loading"><div className="loader-logo"><img src="/haat-logo.png" alt=""/></div><i/></div>;
}
