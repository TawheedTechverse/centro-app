import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { NavBar } from "@/components/nav-bar";
import { ThemeInitScript } from "@/components/theme-init-script";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Centro | Manage your Business",
  description: "Centro business management system for rosters, orders, expiry tracking and growth.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${dmSans.variable} h-full antialiased`}>
      <head>
        <ThemeInitScript />
      </head>
      <body className="min-h-full flex flex-col">
        <NavBar />
        <main className="flex flex-1 flex-col">{children}</main>
      </body>
    </html>
  );
}
