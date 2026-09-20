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
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
