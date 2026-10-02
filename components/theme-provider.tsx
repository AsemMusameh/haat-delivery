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

const storedTheme = (): Theme => {
  if (typeof window === "undefined") return "light";
  const saved = window.localStorage.getItem("theme");
  if (saved === "light" || saved === "dark") return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

const storedPalette = (): PaletteId => {
  if (typeof window === "undefined") return "haat";
  const saved = window.localStorage.getItem("haat-palette") as PaletteId | null;
  return saved && colorPalettes.some((item) => item.id === saved) ? saved : "haat";
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(storedTheme);
  const [palette, setPaletteState] = useState<PaletteId>(storedPalette);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.dataset.palette = palette;
    window.localStorage.setItem("theme", theme);
    window.localStorage.setItem("haat-palette", palette);
  }, [theme, palette]);
  const toggle = () => setTheme((current) => {
    const next = current === "dark" ? "light" : "dark";
    return next;
  });
  const setPalette = (next: PaletteId) => {
    setPaletteState(next);
  };
  return <ThemeContext.Provider value={{ theme, toggle, palette, setPalette }}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
