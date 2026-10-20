import "./globals.css";
import type { Metadata } from "next";
import { assetPath } from "./assets";

export const metadata: Metadata = {
  title: "WisConnect | Land · Capital · Communities",
  description: "WisConnect connects Black women business owners across Africa, the African diaspora and emerging markets to share knowledge, build business relationships and pursue shared ownership.",
  icons: { icon: { url: assetPath("wisconnect-logo-approved.png"), type: "image/png" } }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head><script id="dashboard-theme" dangerouslySetInnerHTML={{ __html: `(()=>{let theme;try{theme=localStorage.getItem('wisconnect-dashboard-theme')}catch{}document.documentElement.dataset.dashboardTheme=theme==='dark'||theme==='light'?theme:matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'})()` }} /></head>
      <body>{children}</body>
    </html>
  );
}
