"use client";
import { Toaster } from "sonner";
import { ThemeProvider } from "./theme-provider";
import { ServiceWorkerRegister } from "./service-worker-register";
import { LocaleProvider } from "./locale-provider";
import { PageLoader } from "./page-loader";
export function Providers({children}:{children:React.ReactNode}) { return <ThemeProvider><LocaleProvider><ServiceWorkerRegister/><PageLoader/><Toaster richColors position="top-center" closeButton />{children}</LocaleProvider></ThemeProvider>; }
