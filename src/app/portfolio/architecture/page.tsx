"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { MapPin, Calendar, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { archProjects } from "@/data/architecture";
import { ImageModal } from "@/components/shared/ImageModal";
import type { ArchProject } from "@/types";

export default function ArchitecturePage() {
  const [selected, setSelected] = useState<ArchProject | null>(null);

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
              Architecture
            </p>
            <h1 className="font-brutal font-semibold text-5xl md:text-7xl mt-2 text-white tracking-tight leading-none">
              Residential design
            </h1>
            <div className="h-px mt-6 max-w-xs bg-white/25" />
            <p className="font-sans text-white/55 leading-relaxed max-w-md mt-6">
              10 residential design concepts across the US — where form meets function and space
              tells a story.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Grid */}
      <div className="relative z-10 container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10">
          {archProjects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              onClick={() => setSelected(project)}
              className="relative aspect-[4/3] overflow-hidden cursor-pointer group bg-zinc-900"
            >
              <Image
                src={project.src}
                alt={project.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                <span className="font-brutal text-[10px] tracking-[0.2em] uppercase text-white/55 mb-1">
                  {project.style}
                </span>
                <h3 className="font-brutal font-semibold text-lg text-white mb-3">{project.title}</h3>
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1 font-brutal text-[10px] tracking-[0.1em] uppercase text-white/50">
                    <MapPin className="h-3 w-3 shrink-0" /> {project.location}
                  </span>
                  <span className="flex items-center gap-1 font-brutal text-[10px] tracking-[0.1em] uppercase text-white/50">
                    <Calendar className="h-3 w-3 shrink-0" /> {project.year}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {selected && (
        <ImageModal
          isOpen={!!selected}
          onClose={() => setSelected(null)}
          image={{
            src: selected.src,
            title: selected.title,
            description: selected.description,
            medium: selected.style,
            year: selected.year,
          }}
        />
      )}
    </div>
  );
}
