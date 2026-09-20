import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MoodGarden — AI Mood & Habit Journal",
  description:
    "A daily journaling app that scores sentiment, correlates moods against habits, and blooms a monthly garden.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col antialiased selection:bg-[#7C9885]/20">
        <Navbar />
        <main className="flex-1 w-full max-w-xl mx-auto px-4 pb-12">
          {children}
        </main>
      </body>
    </html>
  );
}
