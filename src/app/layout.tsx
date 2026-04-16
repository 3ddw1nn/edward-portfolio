import type { Metadata } from "next";
import { Cormorant_Garamond, Newsreader, Oswald, Bebas_Neue } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PostHogProvider } from "@/components/PostHogProvider";

const newsreader = Newsreader({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const oswald = Oswald({
  variable: "--font-brutal",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const bebasNeue = Bebas_Neue({
  variable: "--font-hero",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Edward Lee — Software Engineer · Artist · Architect",
  description:
    "Portfolio of Edward Lee — full-stack engineer, digital artist, and architectural designer. Past work includes Knoxlabs and Muffin Technologies.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`scroll-smooth ${newsreader.variable} ${cormorant.variable} ${oswald.variable} ${bebasNeue.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: `history.scrollRestoration = "manual"; window.scrollTo(0, 0);` }} />
      </head>
      <body
        className="antialiased min-h-screen flex flex-col text-white bg-black"
        suppressHydrationWarning
      >
        <PostHogProvider>
          <Navbar />
          <main className="flex-1 font-sans text-ink selection:bg-ink/10 selection:text-ink">
            {children}
          </main>
          <Footer />
        </PostHogProvider>
      </body>
    </html>
  );
}
