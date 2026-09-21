import "./globals.css";
import type { Metadata } from "next";
import { assetPath } from "./assets";

export const metadata: Metadata = {
  title: "WisConnect | People · Capital · Communities",
  description: "WisConnect is a worker-owned cooperative connecting women entrepreneurs, opportunity, capital and communities.",
  icons: { icon: assetPath("logo-symbol.webp") }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head><script id="dashboard-theme" dangerouslySetInnerHTML={{ __html: `(()=>{let theme;try{theme=localStorage.getItem('wisconnect-dashboard-theme')}catch{}document.documentElement.dataset.dashboardTheme=theme==='dark'||theme==='light'?theme:matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'})()` }} /></head>
      <body>{children}</body>
    </html>
  );
}
