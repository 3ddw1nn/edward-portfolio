"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";

const HERO_BG = "/images/hero-background.jpg";
const CIRCUMFERENCE = 2 * Math.PI * 49;

// Shared entrance easing
const SPRING = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const { scrollY }  = useScroll();
  const [curtainGone, setCurtainGone] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setCurtainGone(true), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const SPACING = 44;
    let frame: number;

    const draw = () => {
      const scroll = scrollY.get();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cols = Math.ceil(canvas.width  / SPACING) + 1;
      const rows = Math.ceil(canvas.height / SPACING) + 1;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = c * SPACING;
          const y = r * SPACING;
          const phase = (c + r) * 0.35 - scroll * 0.015;
          const wave  = (Math.sin(phase) + 1) / 2;
          const radius = 0.6 + wave * 1.6;
          const alpha  = 0.25 + wave * 0.75;
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,255,255,${alpha})`;
          ctx.fill();
        }
      }
      frame = requestAnimationFrame(draw);
    };

    frame = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, [scrollY]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const paintingOpacity = useTransform(scrollYProgress, [0, 0.65, 1], [1, 0.6, 0]);
  const heroUiOpacity   = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scrimOpacity    = useTransform(scrollYProgress, [0, 0.3, 0.7], [0.75, 0.55, 0]);
  const sectionReveal   = useTransform(scrollYProgress, [0.65, 1], [0, 1]);

  const triangleRotate  = useTransform(scrollY, [0, 1000], [0, 360]);
  const triangleOpacity = useTransform(scrollY, [700, 900], [1, 0]);

  const circleDrawOffset      = useTransform(scrollY, [0, 700], [CIRCUMFERENCE, 0]);
  const circleRotate          = useTransform(scrollY, [0, 700], [0, 45]);
  const circleOpacity         = useTransform(scrollY, [0, 200], [1, 0]);
  const rightCircleDrawOffset = useTransform(scrollY, [0, 800], [CIRCUMFERENCE, 0]);
  const rightCircleRotate     = useTransform(scrollY, [0, 800], [0, -40]);
  const rightCircleOpacity    = useTransform(scrollY, [700, 900], [1, 0]);

  const lineScaleX  = useTransform(scrollY, [0, 400], [0, 1]);
  const lineOpacity = useTransform(scrollY, [700, 900], [1, 0]);
  const diagX       = useTransform(scrollY, [0, 700], [-900, 900]);
  const diagOpacity = useTransform(scrollY, [700, 900], [1, 0]);
  const dotGridY    = useTransform(scrollY, [0, 700], [0, -50]);
  const dotGridOpacity = useTransform(scrollY, [700, 900], [1, 0]);

  return (
    <div
      id="hero-scroll-root"
      ref={containerRef}
      className="relative w-full"
      style={{ height: "100vh" }}
    >
      {/* Solid black base */}
      <div className="fixed inset-0 z-[4] bg-black pointer-events-none" aria-hidden />

      {/* Tint */}
      <div className="fixed inset-0 z-[7] bg-black/10 pointer-events-none" aria-hidden />

      {/* ── Painting ── */}

      {/* Mobile — outer: entrance fade, inner: scroll opacity */}
      <motion.div
        className="fixed inset-0 z-[5] pointer-events-none md:hidden"
        initial={{ opacity: 0, scale: 1.08 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2.4, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        aria-hidden
      >
        <motion.div
          className="absolute inset-0"
          style={{
            opacity: paintingOpacity,
            backgroundImage: `url(${HERO_BG})`,
            backgroundSize: "400%",
            backgroundPosition: "45% 40%",
            backgroundRepeat: "no-repeat",
          }}
        />
      </motion.div>

      {/* Desktop — outer: entrance fade, inner: scroll opacity + parallax */}
      <motion.div
        className="fixed inset-0 z-[5] pointer-events-none hidden md:block"
        initial={{ opacity: 0, scale: 1.08 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2.4, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        aria-hidden
      >
        <motion.div
          className="absolute inset-0"
          style={{
            opacity: paintingOpacity,
            backgroundImage: `url(${HERO_BG})`,
            backgroundSize: "215%",
            backgroundPositionX: "50%",
            backgroundPositionY: "calc(77% + 1500px)",
            backgroundRepeat: "no-repeat",
          }}
        />
      </motion.div>

      {/* Scrim — entrance */}
      <motion.div
        className="fixed inset-0 z-[6] pointer-events-none bg-gradient-to-b from-black/50 via-black/15 to-black/35"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.3 }}
        style={{ opacity: scrimOpacity }}
        aria-hidden
      />

      {/* ── Decorative layer ── */}

      {/* Dot wave canvas */}
      <motion.canvas
        ref={canvasRef}
        className="fixed inset-0 z-[8] pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.6 }}
        style={{ y: dotGridY, opacity: dotGridOpacity }}
        aria-hidden
      />

      {/* Left circle */}
      <motion.div
        className="fixed -translate-x-1/2 z-[8] pointer-events-none hidden md:block"
        style={{
          width: "120vh", height: "120vh",
          left: "calc(-20% + 550px)", top: "calc(50% - 500px)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.0 }}
      >
        <motion.svg
          className="w-full h-full"
          style={{ rotate: circleRotate, opacity: circleOpacity, originX: "50%", originY: "50%" }}
          viewBox="0 0 100 100" fill="none" aria-hidden
        >
          <motion.circle
            cx={50} cy={50} r={49}
            fill="none" stroke="white" strokeWidth={0.25}
            strokeDasharray={`${CIRCUMFERENCE * 0.5} ${CIRCUMFERENCE * 0.5}`}
            style={{ strokeDashoffset: circleDrawOffset }}
            transform="rotate(-90, 50, 50)"
          />
        </motion.svg>
      </motion.div>

      {/* Right circle */}
      <motion.div
        className="fixed z-[8] pointer-events-none hidden md:block"
        style={{
          width: "80vh", height: "80vh",
          right: 0, top: "calc(50% + 130px)",
          x: "calc(50% - 50px)", y: "-50%",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.1 }}
      >
        <motion.svg
          className="w-full h-full"
          style={{ rotate: rightCircleRotate, opacity: rightCircleOpacity, originX: "50%", originY: "50%" }}
          viewBox="0 0 100 100" fill="none" aria-hidden
        >
          <motion.circle
            cx={50} cy={50} r={49}
            fill="none" stroke="white" strokeWidth={0.28}
            strokeDasharray={`${CIRCUMFERENCE * 0.5} ${CIRCUMFERENCE * 0.5}`}
            style={{ strokeDashoffset: rightCircleDrawOffset }}
            transform="rotate(90, 50, 50)"
          />
        </motion.svg>
      </motion.div>

      {/* Triangle */}
      <div className="fixed top-14 md:top-16 left-1/2 -translate-x-1/2 z-[8] pointer-events-none">
        <motion.div
          style={{ rotate: triangleRotate, opacity: triangleOpacity }}
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.9, ease: SPRING }}
        >
          <svg width="96" height="82" viewBox="0 0 56 48" fill="none">
            <polygon points="28,2 2,46 54,46" fill="none" stroke="white" strokeWidth="0.5" strokeLinejoin="round"/>
          </svg>
        </motion.div>
      </div>

      {/* Horizontal line */}
      <motion.div
        className="fixed z-[8] pointer-events-none hidden md:block"
        style={{ top: "55%", left: "264px", right: "96px", opacity: lineOpacity }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.2 }}
        aria-hidden
      >
        <motion.div
          className="h-px w-full bg-white"
          style={{ scaleX: lineScaleX, originX: "50%" }}
        />
      </motion.div>

      {/* Diagonal scan line */}
      <motion.div
        className="fixed z-[8] pointer-events-none hidden md:block"
        style={{
          top: "-50vh", left: "50%",
          width: "1px", height: "200vh",
          background: "linear-gradient(to bottom, transparent, white 25%, white 75%, transparent)",
          rotate: "22deg",
          x: diagX,
          opacity: diagOpacity,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.3 }}
        aria-hidden
      />

      {/* Black section reveal overlay */}
      <motion.div
        className="fixed inset-0 z-[20] pointer-events-none bg-black"
        style={{ opacity: sectionReveal }}
        aria-hidden
      />

      {/* Curtain — hides any background-position flash on load, fades out once mounted */}
      <motion.div
        className="fixed inset-0 z-[19] pointer-events-none bg-black"
        initial={{ opacity: 1 }}
        animate={{ opacity: curtainGone ? 0 : 1 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        aria-hidden
      />

      {/* ── Hero text ── */}
      <div className="relative z-[15] h-screen w-full">
        <motion.div
          className="absolute inset-0 flex flex-col pt-16 md:pt-24 pb-10 md:pb-20 px-4 md:px-8"
          style={{ opacity: heroUiOpacity }}
        >
          <div className="flex-1 flex flex-col justify-center min-h-0" style={{ paddingTop: "80px" }}>

            {/* ARTIST & */}
            <div className="flex items-baseline gap-2 md:gap-4 overflow-hidden">
              <motion.h1
                className="font-hero font-normal text-white uppercase leading-[0.82] tracking-tight drop-shadow-[0_2px_24px_rgba(0,0,0,0.45)]"
                style={{ fontSize: "clamp(4.25rem, 19vw, 13rem)" }}
                initial={{ y: "105%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.9, delay: 0.55, ease: SPRING }}
              >
                Artist
              </motion.h1>
              <motion.span
                className="font-hero text-[#e04545] leading-none drop-shadow-md"
                style={{ fontSize: "clamp(2.25rem, 9vw, 6rem)" }}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.8, ease: SPRING }}
              >
                &amp;
              </motion.span>
            </div>

            {/* DEVELOPER */}
            <div className="overflow-hidden">
              <motion.h1
                className="font-hero font-normal text-white uppercase leading-[0.82] tracking-tight drop-shadow-[0_2px_24px_rgba(0,0,0,0.45)]"
                style={{ fontSize: "clamp(4.25rem, 19vw, 13rem)" }}
                initial={{ y: "105%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.9, delay: 0.7, ease: SPRING }}
              >
                Developer
              </motion.h1>
            </div>

            {/* CREATIVE */}
            <motion.p
              className="font-brutal text-white/75 text-base md:text-xl lg:text-2xl mt-6 tracking-[0.25em] uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.95, ease: "easeOut" }}
            >
              creative
            </motion.p>

            {/* Description + button */}
            <div className="flex flex-col items-start md:items-end text-left md:text-right gap-4 mt-8 md:mt-[-111px] lg:mt-[-89px] md:ml-auto">
              <motion.p
                className="font-brutal text-white text-base sm:text-lg md:text-2xl lg:text-3xl leading-relaxed tracking-[0.1em] md:tracking-[0.12em] uppercase max-w-xs md:max-w-sm drop-shadow-[0_2px_16px_rgba(0,0,0,0.95)]"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 1.1, ease: "easeOut" }}
              >
                I build full-stack products, paint and illustrate, and design spaces — based in Los
                Angeles. I care about clarity, craft, and calm interfaces.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.3, ease: "easeOut" }}
              >
                <Link
                  href="/#contact"
                  className="inline-flex items-center justify-center rounded-md border border-white/85 px-6 md:px-8 py-2.5 md:py-3 font-brutal text-xs md:text-base tracking-[0.2em] text-white uppercase hover:bg-white hover:text-black transition-colors duration-300 whitespace-nowrap"
                >
                  Contact me
                </Link>
              </motion.div>
            </div>

          </div>
        </motion.div>
      </div>
    </div>
  );
}
