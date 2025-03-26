"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

// Define skill types
type Skill = {
  title: string;
  src: string;
};

// Define the skills
const codeSkills: Skill[] = [
  { title: "JavaScript", src: "/Skills/code/JavaScriptIcon.svg" },
  { title: "TypeScript", src: "/Skills/code/TypeScriptIcon.svg" },
  { title: "React", src: "/Skills/code/ReactIcon.svg" },
  { title: "React Native", src: "/Skills/code/ReactNativeIcon.png" },
  { title: "Node.js", src: "/Skills/code/NodeJSIcon.png" },
  { title: "NestJS", src: "/Skills/code/NestJSIcon.svg" },
  { title: "HTML", src: "/Skills/code/HTMLIcon.svg" },
  { title: "CSS", src: "/Skills/code/CSSIcon.svg" },
  { title: "Tailwind", src: "/Skills/code/TailwindIcon.svg" },
  { title: "Netlify", src: "/Skills/code/NetlifyIcon.svg" },
  { title: "Nx", src: "/Skills/code/NxIcon.svg" },
  { title: "Prisma", src: "/Skills/code/PrismaIcon.svg" },
  { title: "TurboRepo", src: "/Skills/code/TurboRepoIcon.png" },
  { title: "Firebase", src: "/Skills/code/FireBaseIcon.png" },
  { title: "GitHub", src: "/Skills/code/GitHubIcon.svg" },
  { title: "MongoDB", src: "/Skills/code/MongoDBIcon.svg" },
  { title: "Heroku", src: "/Skills/code/HerokuIcon.png" },
  { title: "Railway", src: "/Skills/code/RailwayIcon.svg" },
  { title: "CloudFlare", src: "/Skills/code/CloudFlareIcon.svg" },
];

const programSkills: Skill[] = [
  { title: "Photoshop", src: "/Skills/programs/PSIcon.svg" },
  { title: "Illustrator", src: "/Skills/programs/AiIcon.svg" },
  { title: "After Effects", src: "/Skills/programs/AEIcon.svg" },
  { title: "Premiere Pro", src: "/Skills/programs/PRIcon.svg" },
  { title: "InDesign", src: "/Skills/programs/IDIcon.svg" },
  { title: "XD", src: "/Skills/programs/XDIcon.svg" },
  { title: "Figma", src: "/Skills/programs/FigmaIcon.svg" },
  { title: "Sketch", src: "/Skills/programs/SketchIcon.svg" },
  { title: "Animate", src: "/Skills/programs/ANIcon.svg" },
  { title: "ZBrush", src: "/Skills/programs/ZBrushIcon.png" },
  { title: "Final Cut Pro", src: "/Skills/programs/FinalCutProIcon.png" },
  { title: "VS Code", src: "/Skills/programs/VsCodeIcon.svg" },
  { title: "Postman", src: "/Skills/programs/PostManIcon.svg" },
  { title: "ProCreate", src: "/Skills/programs/ProCreateIcon.svg" },
  { title: "DragonFrame", src: "/Skills/programs/DragonFrameIcon.svg" },
  { title: "AutoDesk", src: "/Skills/programs/AutoDeskIcon.svg" },
];

// Main Skills Showcase component
export function SkillsShowcase() {
  return (
    <section className="w-full py-20 md:py-28 bg-slate-800 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
        <div className="absolute -rotate-45 h-[1px] w-[200%] bg-gradient-to-r from-transparent via-blue-400 to-transparent top-1/4 -left-1/2"></div>
        <div className="absolute -rotate-45 h-[1px] w-[200%] bg-gradient-to-r from-transparent via-purple-400 to-transparent top-2/4 -left-1/2"></div>
        <div className="absolute -rotate-45 h-[1px] w-[200%] bg-gradient-to-r from-transparent via-amber-400 to-transparent top-3/4 -left-1/2"></div>
      </div>

      {/* Noise texture overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuNjUiIG51bU9jdGF2ZXM9IjMiIHN0aXRjaFRpbGVzPSJzdGl0Y2giIHJlc3VsdD0ibm9pc2UiLz48ZmVDb2xvck1hdHJpeCB0eXBlPSJtYXRyaXgiIHZhbHVlcz0iMSAwIDAgMCAwIDAgMSAwIDAgMCAwIDAgMSAwIDAgMCAwIDAgMC4wNSAwIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI25vaXNlKSIvPjwvc3ZnPg==')] opacity-20 mix-blend-overlay"></div>

      {/* Background glow effects */}
      <div className="absolute top-1/3 left-1/4 w-64 h-64 rounded-full bg-cyan-500/5 blur-3xl"></div>
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-purple-500/5 blur-3xl"></div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="inline-block rounded-none bg-blue-500/10 backdrop-blur-sm px-4 py-2 text-xs text-blue-300 border border-blue-500/20 transform -rotate-1 uppercase tracking-widest font-mono mb-6">
            CTRL+ALT+CREATE
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-end justify-between">
            <h2 className="text-left">
              <span className="text-4xl md:text-6xl font-black tracking-tight text-white mix-blend-difference font-['Epkaisho']">
                TECH
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-amber-400">
                  ARSENAL
                </span>
                <span className="text-sm font-mono ml-2 align-top opacity-70">
                  [nerdy flex]
                </span>
              </span>
            </h2>

            <p className="max-w-[500px] text-slate-300 text-sm md:text-base mt-4 md:mt-0 tracking-wide">
              The digital weapons I wield to
              <span className="font-medium text-white">
                {" "}
                turn caffeine into code
              </span>{" "}
              and ideas into reality.
            </p>
          </div>

          <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-slate-700 to-transparent mt-8"></div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Code Box */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="backdrop-blur-md bg-slate-800/30 border border-slate-700/50 shadow-xl transform rotate-1 hover:rotate-0 transition-all duration-500 overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500/50 via-blue-400/20 to-transparent"></div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-6 uppercase tracking-widest flex items-center font-['Epkaisho']">
                  <span className="inline-block h-4 w-4 bg-blue-400 mr-3 transform -rotate-12"></span>
                  Code
                </h3>

                <div className="flex flex-wrap">
                  {codeSkills.map((skill, index) => (
                    <SkillIcon
                      key={skill.title}
                      skill={skill}
                      delay={index * 0.02}
                      color="blue"
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Programs Box */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="backdrop-blur-md bg-slate-800/30 border border-slate-700/50 shadow-xl transform -rotate-1 hover:rotate-0 transition-all duration-500 overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500/50 via-purple-400/20 to-transparent"></div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-6 uppercase tracking-widest flex items-center font-['Epkaisho']">
                  <span className="inline-block h-4 w-4 bg-purple-400 mr-3 transform rotate-12"></span>
                  Programs
                </h3>

                <div className="flex flex-wrap">
                  {programSkills.map((skill, index) => (
                    <SkillIcon
                      key={skill.title}
                      skill={skill}
                      delay={index * 0.02}
                      color="purple"
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Individual skill icon component with hover effect
const SkillIcon = ({
  skill,
  delay = 0,
  color = "blue",
}: {
  skill: Skill;
  delay?: number;
  color?: string;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const borderColor =
    color === "blue" ? "border-blue-500/30" : "border-purple-500/30";
  const hoverBorderColor =
    color === "blue" ? "border-blue-400/50" : "border-purple-400/50";
  const glowColor =
    color === "blue" ? "from-blue-400/20" : "from-purple-400/20";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay }}
      viewport={{ once: true }}
      className="relative w-[16.666%] sm:w-[14.285%] md:w-[16.666%] lg:w-[14.285%]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="w-full aspect-square p-1.5">
        <motion.div
          className={`w-full h-full flex items-center justify-center bg-slate-700/40 backdrop-blur-md border ${borderColor} overflow-hidden transform hover:rotate-0 transition-all duration-300`}
          style={{ rotate: delay % 0.2 < 0.1 ? "1deg" : "-1deg" }}
          whileHover={{
            backgroundColor: "rgba(100, 116, 139, 0.5)",
            borderColor: hoverBorderColor,
            scale: 1.08,
            rotate: 0,
            boxShadow: "0 8px 20px rgba(0, 0, 0, 0.3)",
          }}
          transition={{ duration: 0.2 }}
        >
          <div
            className="w-full h-full flex items-center justify-center bg-slate-700/40 backdrop-blur-md relative z-0"
            style={{
              transform: delay % 0.2 < 0.1 ? "rotate(1deg)" : "rotate(-1deg)",
            }}
          >
            {/* Glow effect on hover */}
            <motion.div
              className={`absolute inset-0 bg-gradient-to-br ${glowColor} to-transparent`}
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.2 }}
            />

            <Image
              src={skill.src}
              alt={skill.title}
              width={40}
              height={40}
              className="w-[70%] h-[70%] object-contain relative z-10"
            />
          </div>
        </motion.div>
      </div>

      {isHovered && (
        <motion.div
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-slate-800/90 backdrop-blur-sm text-white text-[10px] px-2 py-1 border border-slate-700/50 shadow-lg uppercase tracking-wider"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {skill.title}
        </motion.div>
      )}
    </motion.div>
  );
};
