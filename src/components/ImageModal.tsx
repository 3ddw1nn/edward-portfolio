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
  // Close modal when Escape key is pressed
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      // Prevent scrolling when modal is open
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 md:p-8"
          onClick={onClose}
        >
          {/* Close button */}
          <button
            className="absolute top-4 right-4 z-50 p-2 rounded-full bg-slate-800/50 text-white hover:bg-slate-700/50 transition-colors"
            onClick={onClose}
          >
            <X className="h-6 w-6" />
            <span className="sr-only">Close</span>
          </button>

          {/* Modal content */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative max-w-6xl w-full h-full flex flex-col md:flex-row items-center gap-6 md:gap-12"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image container */}
            <div className="relative w-full md:w-3/4 h-[60vh] md:h-[80vh] overflow-hidden">
              <div
                className="w-full h-full"
                style={{
                  backgroundImage: `url(${image.src})`,
                  backgroundSize: "contain",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              ></div>
            </div>

            {/* Info panel */}
            <div className="w-full md:w-1/4 text-white space-y-6 backdrop-blur-md bg-slate-800/30 p-6 rounded-lg border border-slate-700/50">
              <div>
                <h2 className="text-2xl font-bold mb-2">{image.title}</h2>
                <div className="h-1 w-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
              </div>

              <p className="text-slate-300">{image.description}</p>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Medium</span>
                  <span className="text-slate-200">{image.medium}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Year</span>
                  <span className="text-slate-200">{image.year}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
