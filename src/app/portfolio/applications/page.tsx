"use client";

import { ExternalLink, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { projects } from "@/data/projects";

const categoryLabel: Record<string, string> = {
  mobile: "Mobile app",
  web: "Web app",
  ai: "AI platform",
};

export default function ApplicationsPage() {
  return (
    <div className="w-full min-h-screen bg-black text-white font-sans">

      {/* Header */}
      <div className="relative z-10 pt-32 pb-16 border-b border-white/10">
        <div className="container mx-auto px-4 md:px-6">
          <Link
            href="/#work"
            className="inline-flex items-center gap-2 font-brutal text-[10px] tracking-[0.2em] uppercase text-white/40 hover:text-white transition-colors duration-200 mb-10 group"
          >
            <ArrowLeft className="h-3 w-3 group-hover:-translate-x-1 transition-transform duration-200" />
            Back to work
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="font-sans text-base md:text-lg text-white/55 tracking-wide">
              Applications
            </p>
            <h1 className="font-brutal font-semibold text-5xl md:text-7xl mt-2 text-white tracking-tight leading-none">
              Apps
            </h1>
            <div className="h-px mt-6 max-w-xs bg-white/25" />
            <p className="font-sans text-white/55 leading-relaxed max-w-xl mt-6">
              I learned to code before AI tools existed — which means I know what&apos;s happening
              under the hood. I can leverage AI to work faster, but I&apos;m not dependent on it.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Projects */}
      <div className="relative z-10">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
            className="border-b border-white/10"
          >
            <div className="container mx-auto px-4 md:px-6 py-16 md:py-24">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">

                {/* Copy */}
                <div className="space-y-7 order-2 lg:order-1 flex flex-col justify-center">
                  <div className="flex items-center gap-2 self-start">
                    <span className="inline-block font-brutal text-[10px] tracking-[0.2em] uppercase text-white/45 border border-white/15 rounded-sm px-2.5 py-1">
                      {categoryLabel[project.category]}
                    </span>
                    <span className="inline-block font-brutal text-[10px] tracking-[0.2em] uppercase text-white/45 border border-white/15 rounded-sm px-2.5 py-1">
                      {project.year}
                    </span>
                  </div>

                  <div>
                    <h2 className="font-brutal font-semibold text-3xl md:text-4xl text-white tracking-tight mb-3">
                      {project.title}
                    </h2>
                    <p className="font-sans text-white/60 leading-relaxed">{project.longDescription}</p>
                  </div>

                  <div>
                    <span className="font-brutal text-[10px] tracking-[0.2em] uppercase text-white/40 block mb-3">
                      Tech stack
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="font-brutal text-[10px] tracking-[0.1em] uppercase text-white/45 border border-white/15 rounded-sm px-2.5 py-1"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="font-brutal text-[10px] tracking-[0.2em] uppercase text-white/40 block mb-3">
                      Highlights
                    </span>
                    <ul className="space-y-2">
                      {project.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2 font-sans text-white/65 leading-relaxed">
                          <span className="mt-2 w-1 h-1 rounded-full bg-white/40 shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 font-brutal text-xs tracking-[0.2em] uppercase px-6 py-3 rounded-md bg-white text-black hover:bg-transparent hover:text-white border border-white transition-colors duration-200 self-start"
                  >
                    Visit site <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>

                {/* Image */}
                <div className="order-1 lg:order-2">
                  <div className="relative aspect-[4/3] border border-white/10 rounded-lg overflow-hidden group bg-zinc-900">
                    <Image
                      src={project.screenshotUrl}
                      alt={project.title}
                      fill
                      className={`object-cover group-hover:scale-105 transition-transform duration-700 ${
                        project.title === "Knoxlabs VR Partner Portal" ||
                        project.title === "Content Farmer"
                          ? "object-left-top"
                          : "object-top"
                      }`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
