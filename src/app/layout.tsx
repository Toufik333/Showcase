import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Toufik — Full-Stack Engineer & Designer",
  description:
    "Portfolio of Toufik — a full-stack engineer and designer crafting polished digital experiences with modern web technologies.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans bg-[#fbfbfd] text-[#1d1d1f] antialiased">
        {children}
      </body>
    </html>
  );
}
