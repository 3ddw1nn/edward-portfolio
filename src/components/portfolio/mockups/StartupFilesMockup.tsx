import Image from "next/image";
import { BrowserFrame } from "./BrowserFrame";

export function StartupFilesMockup() {
  return (
    <BrowserFrame domain="startupfiles" background="linear-gradient(180deg, #fbf8f2 0%, #f4ecdf 100%)">
      <div className="relative h-full flex flex-col items-center justify-center gap-2.5 px-6 text-center">
        <div className="relative w-16 h-4 mb-1 opacity-90">
          <Image src="/mockup-logos/startupfiles.svg" alt="" fill className="object-contain object-left" />
        </div>
        <span className="text-[9px] tracking-wide text-[#8e4d1e]/80 border border-[#b96a2a]/25 bg-[#b96a2a]/10 rounded-full px-2.5 py-1">
          California only, for now
        </span>
        <h3 className="text-base md:text-lg font-extrabold leading-tight text-[#0f172a] max-w-[280px]">
          Start a business without paying a{" "}
          <span className="text-[#b96a2a]">lawyer</span> to explain the paperwork.
        </h3>
        <div className="flex items-center gap-2 mt-1">
          <button className="text-[9px] font-medium bg-[#b96a2a] text-white rounded-full px-3 py-1.5">
            Start your setup
          </button>
          <button className="text-[9px] font-medium border border-[#0f172a]/20 text-[#0f172a]/70 rounded-full px-3 py-1.5">
            Preview
          </button>
        </div>
        <div className="flex items-center gap-4 mt-2 pt-2 border-t border-[#0f172a]/10 w-full max-w-[240px] justify-center">
          <div>
            <p className="text-xs font-bold text-[#0f172a]">480+</p>
            <p className="text-[7px] text-[#756856]">CA cities</p>
          </div>
          <div>
            <p className="text-xs font-bold text-[#0f172a]">2</p>
            <p className="text-[7px] text-[#756856]">business paths</p>
          </div>
          <div>
            <p className="text-xs font-bold text-[#0f172a]">$0</p>
            <p className="text-[7px] text-[#756856]">to start</p>
          </div>
        </div>
      </div>
    </BrowserFrame>
  );
}
