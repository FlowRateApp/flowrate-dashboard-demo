import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "FlowRate Dashboard - Lightning Network Analytics",
  description:
    "Monitor your Bitcoin portfolio and Lightning Network performance with real-time analytics and institutional-grade dashboards.",
  keywords: [
    "Bitcoin",
    "Lightning Network",
    "Dashboard",
    "Analytics",
    "Bitcoin Treasury",
  ],
  metadataBase: new URL("https://flowrate.com"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} dark`}>
      <body className="bg-background-dark text-text-light antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
