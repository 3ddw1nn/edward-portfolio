import type { Metadata } from "next";
import { Inter as GeistSans } from "next/font/google";
import { JetBrains_Mono as GeistMono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PostHogProvider } from "@/components/PostHogProvider";

const sans = GeistSans({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const mono = GeistMono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Edward Lee - Portfolio",
  description:
    "Portfolio website of Edward Lee, showcasing applications, illustrations, and architecture work.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`dark ${sans.variable} ${mono.variable}`}>
      <body
        className={`antialiased min-h-screen flex flex-col bg-slate-900 text-slate-50`}
        suppressHydrationWarning
      >
        <PostHogProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </PostHogProvider>
      </body>
    </html>
  );
}
