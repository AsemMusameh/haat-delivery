"use client";
import { createContext, useContext, useEffect, useState } from "react";
type Theme="light"|"dark";
const C=createContext({theme:"light" as Theme,toggle:()=>{}});
export function ThemeProvider({children}:{children:React.ReactNode}){const[theme,setTheme]=useState<Theme>("light");useEffect(()=>{const v=(localStorage.getItem("theme") as Theme)||((matchMedia("(prefers-color-scheme: dark)").matches)?"dark":"light");setTheme(v);document.documentElement.classList.toggle("dark",v==="dark")},[]);const toggle=()=>setTheme(v=>{const n=v==="dark"?"light":"dark";localStorage.setItem("theme",n);document.documentElement.classList.toggle("dark",n==="dark");return n});return <C.Provider value={{theme,toggle}}>{children}</C.Provider>}
export const useTheme=()=>useContext(C);
