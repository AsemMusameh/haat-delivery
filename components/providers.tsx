"use client";
import { Toaster } from "sonner";
import { ThemeProvider } from "./theme-provider";
import { ServiceWorkerRegister } from "./service-worker-register";
import { LocaleProvider } from "./locale-provider";
export function Providers({children}:{children:React.ReactNode}) { return <ThemeProvider><LocaleProvider><ServiceWorkerRegister/><Toaster richColors position="top-center" closeButton />{children}</LocaleProvider></ThemeProvider>; }
