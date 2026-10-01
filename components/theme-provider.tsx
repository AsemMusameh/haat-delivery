"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";
export type PaletteId = "haat" | "ocean" | "emerald" | "violet" | "amber" | "indigo";
export const colorPalettes: { id: PaletteId; name: string; primary: string; secondary: string }[] = [
  { id: "haat", name: "HAAT الأحمر", primary: "#d9153a", secondary: "#ff718b" },
  { id: "ocean", name: "المحيط الأزرق", primary: "#2563eb", secondary: "#38bdf8" },
  { id: "emerald", name: "الزمرد الأخضر", primary: "#059669", secondary: "#34d399" },
  { id: "violet", name: "البنفسجي", primary: "#7c3aed", secondary: "#c084fc" },
  { id: "amber", name: "العنبر", primary: "#d97706", secondary: "#facc15" },
  { id: "indigo", name: "النيلي", primary: "#4338ca", secondary: "#22d3ee" },
];

const ThemeContext = createContext({ theme: "light" as Theme, toggle: () => {}, palette: "haat" as PaletteId, setPalette: (_palette: PaletteId) => {} });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [palette, setPaletteState] = useState<PaletteId>("haat");
  useEffect(() => {
    const savedTheme = (localStorage.getItem("theme") as Theme) || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    const savedPalette = (localStorage.getItem("haat-palette") as PaletteId) || "haat";
    const validPalette = colorPalettes.some((item) => item.id === savedPalette) ? savedPalette : "haat";
    setTheme(savedTheme);
    setPaletteState(validPalette);
    document.documentElement.classList.toggle("dark", savedTheme === "dark");
    document.documentElement.dataset.palette = validPalette;
  }, []);
  const toggle = () => setTheme((current) => {
    const next = current === "dark" ? "light" : "dark";
    localStorage.setItem("theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
    return next;
  });
  const setPalette = (next: PaletteId) => {
    setPaletteState(next);
    localStorage.setItem("haat-palette", next);
    document.documentElement.dataset.palette = next;
  };
  return <ThemeContext.Provider value={{ theme, toggle, palette, setPalette }}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
