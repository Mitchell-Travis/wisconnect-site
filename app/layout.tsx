import "./globals.css";
import type { Metadata } from "next";
import { assetPath } from "./assets";

export const metadata: Metadata = {
  title: "WisConnect | People · Capital · Communities",
  description: "WisConnect brings Black women entrepreneurs across Africa and the diaspora together to share knowledge, build business relationships and pursue shared ownership.",
  icons: { icon: assetPath("logo-symbol.webp") }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head><script id="dashboard-theme" dangerouslySetInnerHTML={{ __html: `(()=>{let theme;try{theme=localStorage.getItem('wisconnect-dashboard-theme')}catch{}document.documentElement.dataset.dashboardTheme=theme==='dark'||theme==='light'?theme:matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'})()` }} /></head>
      <body>{children}</body>
    </html>
  );
}
