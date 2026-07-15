import Image from "next/image";
import { BrowserFrame } from "./BrowserFrame";

export function ClosedAIMockup() {
  return (
    <BrowserFrame domain="closedai" background="#000000">
      <div className="h-full flex flex-col items-center justify-center gap-2 px-6 text-center">
        <div className="relative w-6 h-6 mb-1">
          <Image src="/mockup-logos/closedai-white.svg" alt="" fill className="object-contain" />
        </div>
        <h3 className="text-sm md:text-base font-bold leading-snug text-[#f5f5f5] max-w-[260px]">
          Everything that <span className="line-through text-[#ff8f8f]">went</span>{" "}
          <span className="italic text-[#ff8f8f]">is</span> wrong with OpenAI.
        </h3>
        <p className="text-[8px] text-[#9b9b9b] max-w-[230px] leading-snug">
          One long, cursed conversation: lawsuits, outages, exoduses, and chart crimes.
        </p>
        <span className="text-[7px] rounded-full px-2.5 py-1 bg-[#181818] text-[#d1d1d1] border border-white/10 mt-0.5">
          incidents and counting
        </span>
        <div className="grid grid-cols-2 gap-1.5 mt-1.5 w-full max-w-[240px]">
          <div className="border border-white/10 rounded-md px-2 py-1 text-left">
            <p className="text-[6.5px] text-[#d1d1d1]">Who runs OpenAI this week?</p>
          </div>
          <div className="border border-white/10 rounded-md px-2 py-1 text-left">
            <p className="text-[6.5px] text-[#d1d1d1]">Wasn&apos;t this a nonprofit?</p>
          </div>
        </div>
      </div>
    </BrowserFrame>
  );
}
