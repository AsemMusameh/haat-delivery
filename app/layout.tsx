import type { Metadata } from "next";
import "leaflet/dist/leaflet.css";
import "./globals.css";
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
  metadataBase: new URL("https://haat-employee-hub.montaser-jabren.chatgpt.site"),
  title: "HAAT Employee Hub",
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
    title: "HAAT Employee Hub",
    description: "Operations, Quality & AI Platform",
    images: [{ url: "/og.png", width: 1731, height: 909, alt: "HAAT Employee Hub" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "HAAT Employee Hub",
    description: "Operations, Quality & AI Platform",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body><Providers>{children}</Providers></body>
    </html>
  );
}
