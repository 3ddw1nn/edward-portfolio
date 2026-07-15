import { BrowserFrame } from "./BrowserFrame";

function RadarIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="8" fill="#07111f" />
      <rect x="0.5" y="0.5" width="31" height="31" rx="7.5" stroke="#2dd4bf" strokeOpacity="0.35" />
      <path d="M13.6 13.4v-0.9a2.4 2.1 0 0 1 4.8 0v0.9" fill="none" stroke="#CBFFF6" strokeWidth="1.3" strokeLinecap="round" />
      <rect x="11.4" y="13.4" width="9.2" height="6.6" rx="1.3" fill="#CBFFF6" />
      <path d="M9.2 16a6.8 6.8 0 0 1 1.9-4.7" stroke="#5eead4" strokeWidth="2" strokeLinecap="round" opacity="0.9" />
      <path d="M6.2 16a9.8 9.8 0 0 1 2.8-6.9" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      <path d="M22.8 16a6.8 6.8 0 0 0-1.9-4.7" stroke="#5eead4" strokeWidth="2" strokeLinecap="round" opacity="0.9" />
      <path d="M25.8 16a9.8 9.8 0 0 0-2.8-6.9" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}

export function JobSignalMockup() {
  return (
    <BrowserFrame domain="jobsignal" background="linear-gradient(180deg, #07111f 0%, #060913 52%, #04060d 100%)">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(70% 60% at 30% 20%, rgba(20,184,166,0.14), transparent 60%), radial-gradient(60% 60% at 80% 30%, rgba(99,102,241,0.12), transparent 60%)",
        }}
      />
      <div className="relative h-full flex flex-col items-center justify-center gap-2.5 px-6 text-center">
        <RadarIcon />
        <span className="text-[8px] tracking-wide text-teal-200/60 border border-white/10 rounded-full px-2.5 py-1">
          Built solo, out of frustration with the job hunt
        </span>
        <h3 className="text-base md:text-lg font-semibold leading-tight text-slate-100">
          The job market is broken.
          <br />
          I built a way to cut through it.
        </h3>
        <button
          className="mt-1 text-[9px] font-semibold text-[#03121f] rounded-full px-3.5 py-1.5"
          style={{ background: "linear-gradient(135deg, #22d3ee, #2dd4bf 48%, #a3e635)" }}
        >
          Get started free
        </button>
      </div>
    </BrowserFrame>
  );
}
