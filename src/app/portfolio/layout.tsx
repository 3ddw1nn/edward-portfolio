export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto py-10 md:py-16 px-4 md:px-6">
      <div className="mb-10">
        <div className="inline-block rounded-lg bg-slate-100 dark:bg-slate-800 px-3 py-1 text-sm mb-3">
          Portfolio
        </div>
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-200 dark:to-slate-400">
          Applications
        </h1>
        <div className="h-1 w-20 bg-gradient-to-r from-slate-600 to-slate-400 dark:from-slate-400 dark:to-slate-600 mt-4 rounded-full"></div>
      </div>
      {children}
    </div>
  );
}
