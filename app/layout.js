import "./globals.css";

export const metadata = {
  title: "WisConnect | People · Capital · Communities",
  description: "WisConnect is a worker-owned cooperative connecting women entrepreneurs, opportunity, capital and communities."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
