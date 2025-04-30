import type { Metadata } from "next";
import { GeistSans, GeistMono } from "geist/font";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PostHogProvider } from "@/components/PostHogProvider";

export const metadata: Metadata = {
  title: "Edward Lee - Portfolio",
  description:
    "Portfolio website of Edward Lee, showcasing applications, illustrations, and architecture work.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`dark ${GeistSans.className} ${GeistMono.className}`}
    >
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
