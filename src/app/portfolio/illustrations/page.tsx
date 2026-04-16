"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { illustrations } from "@/data/illustrations";
import { ImageModal } from "@/components/shared/ImageModal";
import type { Illustration } from "@/types";

export default function IllustrationsPage() {
  const [columns, setColumns] = useState(3);
  const [selectedImage, setSelectedImage] = useState<Illustration | null>(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setColumns(1);
      else if (window.innerWidth < 1024) setColumns(2);
      else if (window.innerWidth < 1280) setColumns(3);
      else setColumns(4);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getColumns = () => {
    const cols = Array.from({ length: columns }, () => [] as Illustration[]);
    const sorted = [...illustrations].sort((a, b) => b.aspectRatio - a.aspectRatio);
    sorted.forEach((item, i) => cols[i % columns].push(item));
    return cols;
  };

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
            <p className="font-display italic text-base md:text-lg text-white/55 tracking-wide">
              Illustrations
            </p>
            <h1 className="font-brutal font-semibold text-5xl md:text-7xl mt-2 text-white tracking-tight leading-none">
              Digital art
            </h1>
            <div className="h-px mt-6 max-w-xs bg-white/25" />
            <p className="font-sans text-white/55 leading-relaxed max-w-md mt-6">
              34 pieces spanning digital painting, concept art, vector design, and sculpture
              photography — 2019 to 2022.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Masonry grid */}
      <div className="relative z-10 container mx-auto px-4 md:px-6 py-12">
        <div className="flex gap-3 md:gap-4">
          {getColumns().map((col, colIdx) => (
            <div key={colIdx} className="flex-1 flex flex-col gap-3 md:gap-4">
              {col.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: colIdx * 0.05 + i * 0.04 }}
                  onClick={() => setSelectedImage(item)}
                  className="relative overflow-hidden border border-white/10 cursor-pointer group hover:border-white/30 transition-colors duration-300"
                  style={{ paddingBottom: `${item.aspectRatio * 100}%` }}
                >
                  <Image
                    src={item.src}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <span className="font-brutal font-semibold text-sm text-white">{item.title}</span>
                    <span className="font-brutal text-[10px] tracking-[0.15em] uppercase text-white/55 mt-1">
                      {item.medium} · {item.year}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {selectedImage && (
        <ImageModal
          isOpen={!!selectedImage}
          onClose={() => setSelectedImage(null)}
          image={selectedImage}
        />
      )}
    </div>
  );
}
