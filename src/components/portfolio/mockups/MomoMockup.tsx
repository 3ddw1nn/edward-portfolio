import Image from "next/image";
import { BrowserFrame } from "./BrowserFrame";

export function MomoMockup() {
  return (
    <BrowserFrame domain="momo" background="#0e1210">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(90% 70% at 50% 30%, rgba(163,217,177,0.18), transparent 65%)",
        }}
      />
      <div className="relative h-full flex flex-col items-center justify-center gap-2.5 px-6 text-center">
        <span className="text-[9px] tracking-wide text-[#a3d9b1]/80">
          Your AI companion
        </span>
        <h3 className="text-2xl font-bold text-white lowercase">momo</h3>
        <p className="text-[10px] text-white/50 max-w-[220px] leading-snug">
          A pocket-sized friend that talks with you, remembers you, and grows with you.
        </p>
        <div className="flex items-center gap-2 mt-1">
          <button className="text-[9px] font-medium bg-white text-[#0e1210] rounded-full px-3 py-1.5">
            Start talking free
          </button>
          <button className="text-[9px] font-medium border border-white/25 text-white/80 rounded-full px-3 py-1.5">
            Explore
          </button>
        </div>

        <div
          className="absolute -bottom-6 w-24 h-24 rounded-full flex items-center justify-center"
          style={{
            background:
              "radial-gradient(circle, rgba(163,217,177,0.35), rgba(163,217,177,0.05) 70%)",
          }}
        >
          <div className="relative w-9 h-9 opacity-90">
            <Image
              src="/mockup-logos/momo.svg"
              alt=""
              fill
              className="object-contain"
              style={{ filter: "brightness(0) saturate(100%) invert(80%) sepia(15%) saturate(400%) hue-rotate(70deg)" }}
            />
          </div>
        </div>
      </div>
    </BrowserFrame>
  );
}
