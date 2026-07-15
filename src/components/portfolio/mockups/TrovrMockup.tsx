import { BrowserFrame } from "./BrowserFrame";

export function TrovrMockup() {
  return (
    <BrowserFrame domain="trovr" background="#1c1712">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 0%, rgba(245,158,11,0.16), transparent 60%)",
        }}
      />
      <div className="relative h-full flex flex-col items-center justify-center gap-3 px-6 text-center">
        <span className="text-[9px] tracking-wide text-amber-200/70 border border-amber-500/25 bg-amber-500/10 rounded-full px-2.5 py-1">
          Works on ChatGPT, Claude &amp; Gemini
        </span>
        <h3 className="text-xl md:text-2xl font-semibold leading-tight text-[#f5ead9]">
          While AI thinks,
          <br />
          <span className="text-amber-400">you get paid.</span>
        </h3>
        <button className="mt-1 text-[10px] font-medium bg-amber-500 text-[#1c1712] rounded-full px-3.5 py-1.5">
          Get started — it&apos;s free
        </button>

        <div className="absolute bottom-3 right-3 w-[46%] rounded-md bg-[#2b2119] border border-amber-500/15 shadow-lg p-2 text-left">
          <p className="text-[7px] text-amber-300/70 mb-1">Sponsored · Trovr</p>
          <div className="h-6 rounded bg-amber-500/10 mb-1.5" />
          <div className="flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-amber-400 animate-pulse" />
            <p className="text-[7px] text-[#f5ead9]/60">AI is generating…</p>
          </div>
        </div>
      </div>
    </BrowserFrame>
  );
}
