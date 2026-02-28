import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OpenClaw News — The Latest on AI Agents",
  description: "Daily news, tutorials, and insights on OpenClaw and the AI agent revolution. Stay ahead of the curve.",
  keywords: "OpenClaw, AI agents, Claude, Moltbook, autonomous AI, agent platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3225858495320520"
          crossOrigin="anonymous"></script>
      </head>
      <body className="bg-[#f4f1ea] text-neutral-900 antialiased">
        {children}
      </body>
    </html>
  );
}
