import type { Metadata } from "next";
import "leaflet/dist/leaflet.css";
import "./globals.css";
import { Providers } from "@/components/providers";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  metadataBase: new URL("https://haat-employee-hub-asem.asemmusameh265.chatgpt.site"),
  title: "HAAT | Tulkarm Office",
  description: "HAAT employee operations, quality and AI platform",
  manifest: "/manifest.webmanifest",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/icons/icon.svg",
    shortcut: "/icons/icon.svg",
    apple: "/icons/icon.svg",
  },
  openGraph: {
    title: "HAAT | Tulkarm Office",
    description: "Operations, Quality & AI Platform",
    images: [{ url: "/og.png", width: 1731, height: 909, alt: "HAAT" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "HAAT | Tulkarm Office",
    description: "Operations, Quality & AI Platform",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const env = (name: string) => process.env[name] ?? "";
  const runtimeConfig = JSON.stringify({
    supabaseUrl: env("NEXT_PUBLIC_SUPABASE_URL"),
    supabaseAnonKey: env("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
  }).replace(/</g, "\\u003c");

  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `window.__HAAT_RUNTIME_CONFIG__=${runtimeConfig}` }} />
      </head>
      <body><Providers>{children}</Providers></body>
    </html>
  );
}
