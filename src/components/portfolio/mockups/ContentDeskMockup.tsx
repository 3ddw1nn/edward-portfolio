import { BrowserFrame } from "./BrowserFrame";

const features = ["AI campaign sequences", "Real publishing", "Scheduling", "Analytics"];

export function ContentDeskMockup() {
  return (
    <BrowserFrame domain="contentdesk" background="#0a0a0a">
      <div className="h-full flex flex-col items-center justify-center gap-2.5 px-6 text-center">
        <h3 className="text-xl font-bold text-white tracking-tight">ContentDesk</h3>
        <p className="text-[10px] text-white/50 max-w-[220px] leading-snug">
          AI-generated social media campaign sequences, reviewed and approved step by step.
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <button
            className="text-[9px] font-medium text-white rounded-md px-3 py-1.5"
            style={{ background: "oklch(0.68 0.19 280)" }}
          >
            Sign up
          </button>
          <button className="text-[9px] font-medium border border-white/15 text-white/70 rounded-md px-3 py-1.5">
            Sign in
          </button>
        </div>
        <div className="grid grid-cols-2 gap-1.5 mt-2 w-full max-w-[240px]">
          {features.map((f) => (
            <div key={f} className="border border-white/10 rounded-md px-2 py-1.5 text-left">
              <p className="text-[7px] text-white/55 leading-tight">{f}</p>
            </div>
          ))}
        </div>
      </div>
    </BrowserFrame>
  );
}
