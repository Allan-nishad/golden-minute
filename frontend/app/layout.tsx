import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GOLDEN MINUTE — Real-Time Emergency Guidance Copilot",
  description:
    "Safety-first real-time voice emergency first-aid copilot powered by Moss & deterministic validation gates.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-[#0B0F19] text-zinc-100 min-h-screen selection:bg-amber-500 selection:text-black">
        {children}
      </body>
    </html>
  );
}
