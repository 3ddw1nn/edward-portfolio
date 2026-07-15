import type { ReactNode } from "react";

export function BrowserFrame({
  domain,
  background,
  children,
}: {
  domain: string;
  background: string;
  children: ReactNode;
}) {
  return (
    <div className="w-full h-full flex flex-col overflow-hidden" style={{ background }}>
      <div className="flex items-center gap-3 px-4 py-2.5 shrink-0 bg-black/30 border-b border-white/10">
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
        </div>
        <div className="flex-1 flex justify-center">
          <div className="px-3 py-0.5 rounded-full bg-black/25 text-[10px] text-white/50 font-mono tracking-wide truncate max-w-[220px]">
            {domain}
          </div>
        </div>
      </div>
      <div className="flex-1 min-h-0 relative">{children}</div>
    </div>
  );
}
