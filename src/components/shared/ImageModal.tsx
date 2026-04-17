"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type ImageModalProps = {
  isOpen: boolean;
  onClose: () => void;
  image: {
    src: string;
    title: string;
    description: string;
    medium: string;
    year: string;
  };
};

export function ImageModal({ isOpen, onClose, image }: ImageModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 md:p-8"
          onClick={onClose}
        >
          <button
            className="absolute top-4 right-4 z-50 p-2 rounded-md border border-white/15 text-white/50 hover:text-white hover:border-white/40 transition-colors duration-200"
            onClick={onClose}
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            className="relative max-w-6xl w-full h-full flex flex-col md:flex-row items-center gap-6 md:gap-10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image */}
            <div className="relative w-full md:w-3/4 h-[60vh] md:h-[80vh] overflow-hidden rounded-lg border border-white/10 bg-zinc-900">
              <div
                className="w-full h-full"
                style={{
                  backgroundImage: `url(${image.src})`,
                  backgroundSize: "contain",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              />
            </div>

            {/* Info panel */}
            <div className="w-full md:w-1/4 bg-black border border-white/10 rounded-lg p-6 space-y-5 font-sans text-white">
              <div>
                <h2 className="font-brutal font-semibold text-xl text-white mb-3">{image.title}</h2>
                <div className="h-px w-8 bg-white/30" />
              </div>
              <p className="font-sans text-white/55 leading-relaxed text-sm">{image.description}</p>
              <div className="space-y-3 pt-3 border-t border-white/10">
                <div className="flex justify-between gap-4">
                  <span className="font-brutal text-[10px] tracking-[0.2em] uppercase text-white/40">Medium</span>
                  <span className="font-sans text-sm text-white/70 text-right max-w-[60%]">{image.medium}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="font-brutal text-[10px] tracking-[0.2em] uppercase text-white/40">Year</span>
                  <span className="font-sans text-sm text-white/70">{image.year}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
