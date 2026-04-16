"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { codeSkills, programSkills } from "@/data/skills";

function SkillIcon({ title, src, index }: { title: string; src: string; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.2, delay: index * 0.025 }}
      className="group relative flex items-center justify-center p-3 md:p-3.5 rounded-lg hover:bg-white/8 transition-colors duration-150 cursor-default"
    >
      {/* Tooltip */}
      <div
        className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 z-20
          px-2.5 py-1 rounded bg-white text-black font-brutal text-[10px] tracking-[0.12em] uppercase
          whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150"
      >
        {title}
        {/* Arrow */}
        <span className="absolute left-1/2 -translate-x-1/2 -bottom-[5px] w-0 h-0 border-l-[5px] border-r-[5px] border-t-[5px] border-l-transparent border-r-transparent border-t-white" />
      </div>

      <div className="w-7 h-7 md:w-8 md:h-8 relative opacity-100 scale-100 group-hover:scale-110 transition-transform duration-150">
        <Image src={src} alt={title} fill className="object-contain" unoptimized />
      </div>
    </motion.div>
  );
}

function SkillBox({
  label,
  skills,
  delay = 0,
}: {
  label: string;
  skills: { title: string; src: string }[];
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="border border-white/12 rounded-sm bg-white/[0.02] p-5 md:p-7"
    >
      <p className="font-brutal text-sm tracking-[0.2em] uppercase text-white/35 mb-5">
        {label}
      </p>
      <div className="flex flex-wrap gap-1">
        {skills.map((skill, i) => (
          <SkillIcon key={skill.title} {...skill} index={i} />
        ))}
      </div>
    </motion.div>
  );
}

export function SkillsShowcase() {
  return (
    <section className="relative z-10 w-full py-20 md:py-28 overflow-hidden bg-black text-white">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-14"
        >
          <p className="font-display italic text-lg md:text-xl text-white/55 tracking-wide">
            Capabilities
          </p>
          <h2 className="font-brutal font-semibold text-6xl md:text-8xl mt-2 text-white tracking-tight leading-none">
            Skills
          </h2>
          <div className="h-px mt-6 max-w-xs bg-white/25" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <SkillBox label="Languages & Frameworks" skills={codeSkills} delay={0} />
          <SkillBox label="Tools & Programs" skills={programSkills} delay={0.1} />
        </div>
      </div>
    </section>
  );
}
