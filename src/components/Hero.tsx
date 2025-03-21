"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export function Hero() {
  const [textIndex, setTextIndex] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const phrases = ["design.", "code.", "ship."];

  useEffect(() => {
    setIsMounted(true);
    const interval = setInterval(() => {
      setTextIndex((prevIndex) => (prevIndex + 1) % phrases.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Image with noise texture overlay */}
      <div className="absolute inset-0 z-0">
        {isMounted ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 object-cover w-full h-full"
            style={{ filter: "brightness(0.4) contrast(1.1)" }}
          >
            <source src="/videos/hero-background.mp4" type="video/mp4" />
          </video>
        ) : (
          /* Static fallback image for SSR */
          <img
            src="/images/hero-fallback.jpg"
            alt="Background fallback"
            className="absolute inset-0 object-cover w-full h-full"
            style={{ filter: "brightness(0.4) contrast(1.1)" }}
          />
        )}
      </div>

      {/* Noise texture overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuNjUiIG51bU9jdGF2ZXM9IjMiIHN0aXRjaFRpbGVzPSJzdGl0Y2giIHJlc3VsdD0ibm9pc2UiLz48ZmVDb2xvck1hdHJpeCB0eXBlPSJtYXRyaXgiIHZhbHVlcz0iMSAwIDAgMCAwIDAgMSAwIDAgMCAwIDAgMSAwIDAgMCAwIDAgMC4xIDAiLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWx0ZXI9InVybCgjbm9pc2UpIi8+PC9zdmc+')] opacity-30 mix-blend-overlay z-10" />

      {/* Diagonal lines */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none z-10">
        <div className="absolute -rotate-45 h-[1px] w-[200%] bg-gradient-to-r from-transparent via-blue-400 to-transparent top-1/4 -left-1/2"></div>
        <div className="absolute -rotate-45 h-[1px] w-[200%] bg-gradient-to-r from-transparent via-purple-400 to-transparent top-2/4 -left-1/2"></div>
        <div className="absolute -rotate-45 h-[1px] w-[200%] bg-gradient-to-r from-transparent via-amber-400 to-transparent top-3/4 -left-1/2"></div>
      </div>

      {/* Animated particles or light effect */}
      <div className="absolute inset-0 z-10 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-purple-500/20 blur-3xl animate-pulse"></div>
        <div
          className="absolute top-2/3 right-1/3 w-40 h-40 rounded-full bg-blue-500/20 blur-3xl animate-pulse"
          style={{ animationDelay: "1000ms" }}
        ></div>
        <div
          className="absolute bottom-1/4 left-1/2 w-36 h-36 rounded-full bg-cyan-500/20 blur-3xl animate-pulse"
          style={{ animationDelay: "2000ms" }}
        ></div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 md:px-6 relative z-20">
        <div className="max-w-5xl mx-auto">
          {/* Asymmetrical layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Left column - Main heading */}
            <div className="md:col-span-7 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-4"
              >
                <div className="inline-block rounded-none bg-blue-500/10 backdrop-blur-sm px-4 py-2 text-xs text-blue-300 border border-blue-500/20 transform -rotate-1 uppercase tracking-widest font-mono">
                  Software Engineer
                </div>
                <div className="inline-block rounded-none bg-blue-500/10 backdrop-blur-sm px-4 py-2 text-xs text-blue-300 border border-blue-500/20 transform -rotate-1 uppercase tracking-widest font-mono">
                  Artist
                </div>
                <h1 className="text-left">
                  <span className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-white mix-blend-difference">
                    EDWARD
                    <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-amber-400">
                      LEE
                    </span>
                  </span>
                </h1>

                <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
              </motion.div>
            </div>

            {/* Right column - Description and buttons */}
            <div className="md:col-span-5 flex flex-col justify-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-8"
              >
                <div className="min-h-[3em]">
                  <p className="text-4xl md:text-5xl lg:text-6xl text-white font-mono font-bold tracking-tight flex items-baseline">
                    <span className="mr-4">I</span>
                    <motion.span
                      key={textIndex}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5 }}
                      className="inline-block min-w-[5ch]"
                    >
                      {phrases[textIndex]}
                    </motion.span>
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-5 pt-4">
                  <Button
                    asChild
                    size="lg"
                    className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border border-white/20 transition-all duration-300 rounded-none transform -rotate-1 hover:rotate-0 hover:translate-y-[-2px]"
                  >
                    <Link
                      href="/portfolio/applications"
                      className="flex items-center gap-2 px-8 py-6 text-sm uppercase tracking-widest font-medium"
                    >
                      View My Work
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="border-purple-500/50 text-purple-300 hover:bg-purple-500/10 transition-all duration-300 rounded-none transform rotate-1 hover:rotate-0 hover:translate-y-[-2px]"
                  >
                    <Link
                      href="/contact"
                      className="flex items-center gap-2 px-8 py-6 text-sm uppercase tracking-widest font-medium"
                    >
                      Contact Me
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.6,
          delay: 1,
          repeat: Infinity,
          repeatType: "reverse",
          repeatDelay: 0.5,
        }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center text-slate-300 opacity-70 z-20"
      >
        <span className="text-xs uppercase tracking-widest mb-2 font-mono">
          Scroll
        </span>
        <ChevronDown className="h-4 w-4" />
      </motion.div>
    </div>
  );
}
