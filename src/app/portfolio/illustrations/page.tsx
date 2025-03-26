"use client";

import { Eye } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ImageModal } from "@/components/ImageModal";

// Define illustration type
type Illustration = {
  id: number;
  title: string;
  description: string;
  medium: string;
  year: string;
  src: string;
  aspectRatio: number; // height/width ratio
};

export default function IllustrationsPage() {
  const [columns, setColumns] = useState(3);
  const [selectedImage, setSelectedImage] = useState<Illustration | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Update columns based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setColumns(1);
      } else if (window.innerWidth < 1024) {
        setColumns(2);
      } else if (window.innerWidth < 1280) {
        setColumns(3);
      } else {
        setColumns(4);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Open modal with selected image
  const openModal = (illustration: Illustration) => {
    setSelectedImage(illustration);
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Actual illustrations data with real images from ArtCatalog
  const illustrations: Illustration[] = [
    {
      id: 1,
      title: "Wizard",
      description:
        "A mystical wizard character with intricate details and magical elements, showcasing fantasy character design skills.",
      medium: "Digital Painting",
      year: "2022",
      src: "/ArtCatalog/Wizard.jpg",
      aspectRatio: 1.2,
    },
    {
      id: 2,
      title: "Whale Vector",
      description:
        "A stylized vector illustration of a whale, using geometric shapes and a modern color palette.",
      medium: "Vector Illustration",
      year: "2021",
      src: "/ArtCatalog/WhaleVector.jpg",
      aspectRatio: 0.8,
    },
    {
      id: 3,
      title: "Whale Ship",
      description:
        "A surreal composition featuring a whale-shaped ship sailing through clouds, blending fantasy and steampunk elements.",
      medium: "Digital Painting",
      year: "2021",
      src: "/ArtCatalog/WhaleShip.jpg",
      aspectRatio: 1.5,
    },
    {
      id: 4,
      title: "Vol'jin Turnaround",
      description:
        "Character turnaround design for Vol'jin, showing multiple angles and details for animation or game development.",
      medium: "Digital Concept Art",
      year: "2020",
      src: "/ArtCatalog/VoljinTurnAround.jpg",
      aspectRatio: 0.7,
    },
    {
      id: 5,
      title: "View Master",
      description:
        "A nostalgic illustration of a View-Master toy, rendered with attention to detail and lighting.",
      medium: "Digital Illustration",
      year: "2021",
      src: "/ArtCatalog/ViewMaster.jpg",
      aspectRatio: 1.0,
    },
    {
      id: 6,
      title: "Tiffany",
      description:
        "Portrait illustration in an Art Nouveau style, inspired by Tiffany glass designs with ornate decorative elements.",
      medium: "Mixed Media",
      year: "2020",
      src: "/ArtCatalog/Tiffany.jpg",
      aspectRatio: 1.3,
    },
    {
      id: 7,
      title: "Silhouette",
      description:
        "Dramatic silhouette composition with contrasting light and shadow, creating a powerful visual narrative.",
      medium: "Digital Painting",
      year: "2021",
      src: "/ArtCatalog/Silhouette.jpg",
      aspectRatio: 0.75,
    },
    {
      id: 8,
      title: "Shirt Design",
      description:
        "Custom t-shirt design with intricate patterns and typography, ready for print production.",
      medium: "Vector Design",
      year: "2022",
      src: "/ArtCatalog/Shirt.jpg",
      aspectRatio: 1.4,
    },
    {
      id: 9,
      title: "Pipi Beverage Poster",
      description:
        "Vintage-inspired advertising poster for Pipi Beverage, featuring retro typography and illustration style.",
      medium: "Digital Illustration",
      year: "2021",
      src: "/ArtCatalog/PipiBeveragePoster.jpg",
      aspectRatio: 0.9,
    },
    {
      id: 10,
      title: "Over The Garden Wall",
      description:
        "Fan art inspired by the animated series 'Over The Garden Wall', capturing the show's unique atmosphere and characters.",
      medium: "Digital Painting",
      year: "2020",
      src: "/ArtCatalog/OTGW.jpg",
      aspectRatio: 1.1,
    },
    {
      id: 11,
      title: "Monstro Sculpture 3",
      description:
        "Third view of a detailed sculpture of Monstro, showcasing three-dimensional form and texture.",
      medium: "Sculpture Photography",
      year: "2019",
      src: "/ArtCatalog/MonstroSculpture3.jpg",
      aspectRatio: 0.6,
    },
    {
      id: 12,
      title: "Monstro Sculpture 2",
      description:
        "Second view of the Monstro sculpture, highlighting different angles and details of the piece.",
      medium: "Sculpture Photography",
      year: "2019",
      src: "/ArtCatalog/MonstroSculpture2.jpg",
      aspectRatio: 1.6,
    },
    {
      id: 13,
      title: "Monstro Sculpture",
      description:
        "Primary view of a handcrafted sculpture of Monstro from Pinocchio, showing craftsmanship and attention to detail.",
      medium: "Sculpture Photography",
      year: "2019",
      src: "/ArtCatalog/MonstroSculpture.jpg",
      aspectRatio: 1.0,
    },
    {
      id: 14,
      title: "Minjoo",
      description:
        "Portrait illustration with stylized features and expressive character design.",
      medium: "Digital Portrait",
      year: "2021",
      src: "/ArtCatalog/Minjoo.jpg",
      aspectRatio: 0.85,
    },
    {
      id: 15,
      title: "Lucifer Christ Capricorn",
      description:
        "Symbolic and allegorical illustration combining religious and astrological imagery in a detailed composition.",
      medium: "Digital Painting",
      year: "2020",
      src: "/ArtCatalog/LuciferChristCapricorn.jpg",
      aspectRatio: 1.5,
    },
    {
      id: 16,
      title: "Justice",
      description:
        "Conceptual illustration representing Justice, with symbolic elements and a modern artistic approach.",
      medium: "Digital Illustration",
      year: "2021",
      src: "/ArtCatalog/Justice.jpg",
      aspectRatio: 1.2,
    },
    {
      id: 17,
      title: "Hybrid Animal",
      description:
        "Creative illustration of a hybrid animal, combining features from different species in a seamless design.",
      medium: "Digital Concept Art",
      year: "2020",
      src: "/ArtCatalog/HybridAnimal.jpg",
      aspectRatio: 0.8,
    },
    {
      id: 18,
      title: "Hae 3",
      description:
        "Third in a series of character illustrations, showing different expressions and poses.",
      medium: "Digital Character Design",
      year: "2021",
      src: "/ArtCatalog/Hae3.jpg",
      aspectRatio: 1.3,
    },
    {
      id: 19,
      title: "Hae 2",
      description:
        "Second illustration in the Hae character series, with different styling and mood.",
      medium: "Digital Character Design",
      year: "2021",
      src: "/ArtCatalog/Hae2.jpg",
      aspectRatio: 0.9,
    },
    {
      id: 20,
      title: "Hae",
      description:
        "Original character design for Hae, showcasing personality through pose, expression, and design elements.",
      medium: "Digital Character Design",
      year: "2021",
      src: "/ArtCatalog/Hae.jpg",
      aspectRatio: 1.1,
    },
    {
      id: 21,
      title: "Geisha",
      description:
        "Traditional-style illustration of a geisha, with careful attention to cultural details and artistic elements.",
      medium: "Digital Painting",
      year: "2020",
      src: "/ArtCatalog/Geisha.jpg",
      aspectRatio: 1.4,
    },
    {
      id: 22,
      title: "Gary The Elephant",
      description:
        "Whimsical character design of Gary the Elephant, with a playful style and expressive features.",
      medium: "Digital Illustration",
      year: "2022",
      src: "/ArtCatalog/GaryTheElephant.jpg",
      aspectRatio: 0.7,
    },
    {
      id: 23,
      title: "Free The Wild",
      description:
        "Environmental awareness illustration advocating for wildlife conservation with powerful imagery.",
      medium: "Digital Painting",
      year: "2021",
      src: "/ArtCatalog/FreeTheWild.jpg",
      aspectRatio: 1.0,
    },
    {
      id: 24,
      title: "Demon Geisha",
      description:
        "Dark fantasy interpretation of a geisha with supernatural elements, blending traditional and horror themes.",
      medium: "Digital Painting",
      year: "2020",
      src: "/ArtCatalog/DemonGeisha.jpg",
      aspectRatio: 1.2,
    },
    {
      id: 25,
      title: "Debonair Tinker",
      description:
        "Character design of a steampunk-inspired tinker with elaborate costume and mechanical accessories.",
      medium: "Digital Concept Art",
      year: "2021",
      src: "/ArtCatalog/DebonairTinker.jpg",
      aspectRatio: 0.8,
    },
    {
      id: 26,
      title: "CCA Shirt",
      description:
        "T-shirt design created for California College of the Arts, featuring school-related imagery and typography.",
      medium: "Vector Design",
      year: "2019",
      src: "/ArtCatalog/CCAShirt.jpg",
      aspectRatio: 1.5,
    },
    {
      id: 27,
      title: "Breaking Bad",
      description:
        "Fan art inspired by the TV series Breaking Bad, capturing iconic characters and themes from the show.",
      medium: "Digital Illustration",
      year: "2020",
      src: "/ArtCatalog/BreakingBad.jpg",
      aspectRatio: 0.7,
    },
    {
      id: 28,
      title: "Break From Reality",
      description:
        "Surreal illustration depicting a break from reality, with dreamlike elements and psychological themes.",
      medium: "Digital Painting",
      year: "2021",
      src: "/ArtCatalog/BreakFromReality.jpg",
      aspectRatio: 1.0,
    },
    {
      id: 29,
      title: "Beat Rhino Card",
      description:
        "Character card design for Beat Rhino, suitable for game or collectible card applications.",
      medium: "Digital Design",
      year: "2020",
      src: "/ArtCatalog/BeatRhinoCard.jpg",
      aspectRatio: 1.3,
    },
    {
      id: 30,
      title: "Beat Rhino",
      description:
        "Character illustration of Beat Rhino, a music-themed anthropomorphic character with dynamic styling.",
      medium: "Digital Character Design",
      year: "2020",
      src: "/ArtCatalog/BeatRhino.jpg",
      aspectRatio: 0.75,
    },
    {
      id: 31,
      title: "Athena",
      description:
        "Mythological illustration of Athena, Greek goddess of wisdom and war, with classical and contemporary elements.",
      medium: "Digital Painting",
      year: "2021",
      src: "/ArtCatalog/Athena.jpg",
      aspectRatio: 1.4,
    },
    {
      id: 32,
      title: "Alice Glass",
      description:
        "Portrait illustration inspired by Alice Glass, with a distinctive style blending fashion and alternative aesthetics.",
      medium: "Digital Portrait",
      year: "2020",
      src: "/ArtCatalog/AliceGlass.jpg",
      aspectRatio: 0.9,
    },
    {
      id: 33,
      title: "Akira Ink",
      description:
        "Ink-style illustration inspired by the iconic anime film Akira, focusing on line work and composition.",
      medium: "Digital Ink Drawing",
      year: "2021",
      src: "/ArtCatalog/AkiraInk.jpg",
      aspectRatio: 1.1,
    },
    {
      id: 34,
      title: "Akira",
      description:
        "Full-color illustration inspired by the groundbreaking anime film Akira, capturing its distinctive visual style.",
      medium: "Digital Painting",
      year: "2021",
      src: "/ArtCatalog/Akira.jpg",
      aspectRatio: 1.5,
    },
  ];

  // Organize illustrations into columns for masonry layout
  const getColumns = () => {
    const columnArray = Array.from(
      { length: columns },
      () => [] as Illustration[]
    );

    // Sort by aspect ratio to distribute heights more evenly
    const sortedIllustrations = [...illustrations].sort(
      (a, b) => b.aspectRatio - a.aspectRatio
    );

    // Distribute illustrations across columns
    sortedIllustrations.forEach((illustration, index) => {
      const columnIndex = index % columns;
      columnArray[columnIndex].push(illustration);
    });

    return columnArray;
  };

  return (
    <div className="w-full mx-auto py-6 bg-slate-900">
      <div className="px-4 md:px-6 mb-8">
        <h2 className="text-2xl font-bold mb-2 text-white font-['Epkaisho']">
          DIGITAL ARTS
        </h2>
        <p className="text-slate-300 max-w-2xl">
          Browse through my illustration portfolio showcasing digital and
          traditional artwork across various styles and subjects.
        </p>
      </div>

      <div className="flex gap-3 md:gap-4 px-4 md:px-6">
        {getColumns().map((column, columnIndex) => (
          <div
            key={columnIndex}
            className="flex-1 flex flex-col gap-3 md:gap-4"
          >
            {column.map((illustration) => (
              <motion.div
                key={illustration.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay:
                    columnIndex * 0.1 + column.indexOf(illustration) * 0.05,
                }}
                className="group relative overflow-hidden rounded-xl shadow-md transition-all duration-300 hover:shadow-xl cursor-pointer"
                onClick={() => openModal(illustration)}
              >
                {/* Actual image */}
                <div className="relative aspect-auto">
                  <div
                    className="w-full h-0"
                    style={{
                      paddingBottom: `${illustration.aspectRatio * 100}%`,
                      backgroundImage: `url(${illustration.src})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  ></div>

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <h3 className="text-lg font-bold text-white mb-1 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      {illustration.title}
                    </h3>
                    <p className="text-xs text-white/70 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                      {illustration.medium} • {illustration.year}
                    </p>

                    {/* View button */}
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="p-2 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 transition-colors">
                        <Eye className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ))}
      </div>

      {/* Modal for full-page view */}
      {selectedImage && (
        <ImageModal
          isOpen={isModalOpen}
          onClose={closeModal}
          image={selectedImage}
        />
      )}
    </div>
  );
}
