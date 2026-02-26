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
      <body className="bg-white text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
