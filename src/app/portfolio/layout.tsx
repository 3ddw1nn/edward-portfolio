"use client";

import { usePathname } from "next/navigation";

export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const getTitle = () => {
    if (pathname.includes("/applications")) return "Applications";
    if (pathname.includes("/illustrations")) return "Illustrations";
    if (pathname.includes("/architecture")) return "Architecture";
    return "Portfolio";
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-8">
        <div className="inline-block rounded-none bg-blue-500/10 backdrop-blur-sm px-4 py-2 text-xs text-blue-300 border border-blue-500/20 transform -rotate-1 uppercase tracking-widest mb-4">
          Portfolio
        </div>
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-200 dark:to-slate-400 font-['Epkaisho']">
          {getTitle()}
        </h1>
      </div>
      {children}
    </div>
  );
}
