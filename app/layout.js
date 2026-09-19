import "./globals.css";
import { Manrope, Newsreader } from "next/font/google";

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
});

export const metadata = {
  title: "WisConnect | People · Capital · Communities",
  description: "WisConnect is a worker-owned cooperative connecting women entrepreneurs, opportunity, capital and communities."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${manrope.variable} ${newsreader.variable}`}>
      <body>{children}</body>
    </html>
  );
}
