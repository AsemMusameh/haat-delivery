import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "HAAT Tulkarm Office",
    short_name: "HAAT",
    description: "HAAT Tulkarm Office internal operations platform",
    start_url: "/login",
    scope: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#c50a32",
    orientation: "portrait-primary",
    lang: "ar",
    dir: "rtl",
    icons: [
      {
        src: "/icons/haat-app-icon.png",
        sizes: "1254x1254",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      { name: "التقارير اليومية", url: "/daily-reports" },
      { name: "التقارير الشهرية", url: "/monthly-reports" },
      { name: "الإشعارات", url: "/notifications" },
    ],
  };
}
