"use client";

import { Button } from "@/components/ui/button";
import { MapPin, Calendar, ExternalLink } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { ImageModal } from "@/components/ImageModal";

// Define architecture project type
type ArchProject = {
  id: number;
  title: string;
  description: string;
  location: string;
  year: string;
  style: string;
  src: string;
};

export default function ArchitecturePage() {
  const [selectedProject, setSelectedProject] = useState<ArchProject | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Open modal with selected project
  const openModal = (project: ArchProject) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Architecture projects data
  const projects: ArchProject[] = [
    {
      id: 1,
      title: "Modern Lakeside Retreat",
      description:
        "A contemporary lakeside home featuring floor-to-ceiling windows that maximize natural light and provide panoramic views of the surrounding landscape. The design emphasizes a seamless indoor-outdoor connection with sustainable materials.",
      location: "Lake Tahoe, CA",
      year: "2022",
      style: "Contemporary",
      src: "/ArchCatalog/1.jpg",
    },
    {
      id: 2,
      title: "Urban Minimalist Residence",
      description:
        "This urban dwelling embraces minimalist principles with clean lines and a monochromatic palette. The compact footprint maximizes space efficiency while creating an open, airy atmosphere through strategic spatial planning.",
      location: "San Francisco, CA",
      year: "2021",
      style: "Minimalist",
      src: "/ArchCatalog/2.jpg",
    },
    {
      id: 3,
      title: "Coastal Modern Villa",
      description:
        "Perched on a coastal cliff, this villa blends modern architectural elements with the natural surroundings. The design incorporates sustainable features including solar panels, rainwater harvesting, and passive cooling systems.",
      location: "Malibu, CA",
      year: "2020",
      style: "Coastal Modern",
      src: "/ArchCatalog/3.jpg",
    },
    {
      id: 4,
      title: "Mid-Century Revival",
      description:
        "A thoughtful renovation of a classic mid-century home, preserving original architectural details while updating systems and spaces for contemporary living. The project maintains the home's historical integrity while enhancing functionality.",
      location: "Palm Springs, CA",
      year: "2021",
      style: "Mid-Century Modern",
      src: "/ArchCatalog/4.jpg",
    },
    {
      id: 5,
      title: "Mountain Modern Chalet",
      description:
        "This mountain retreat combines traditional chalet elements with modern design sensibilities. Heavy timber construction and a pitched roof meet sleek finishes and contemporary spatial arrangements, creating a warm yet sophisticated atmosphere.",
      location: "Aspen, CO",
      year: "2022",
      style: "Mountain Modern",
      src: "/ArchCatalog/5.jpg",
    },
    {
      id: 6,
      title: "Desert Pavilion House",
      description:
        "Designed to respond to the harsh desert climate, this residence features thick walls for thermal mass, strategic overhangs for shade, and a courtyard layout that creates comfortable microclimate zones throughout the property.",
      location: "Scottsdale, AZ",
      year: "2020",
      style: "Desert Contemporary",
      src: "/ArchCatalog/6.jpg",
    },
    {
      id: 7,
      title: "Floating Canopy Residence",
      description:
        "This innovative design features a floating roof canopy that provides shade while allowing natural ventilation. The home's transparent walls blur the boundary between interior and exterior spaces, creating a harmonious relationship with nature.",
      location: "Portland, OR",
      year: "2021",
      style: "Organic Modern",
      src: "/ArchCatalog/7.jpg",
    },
    {
      id: 8,
      title: "Urban Courtyard House",
      description:
        "This urban infill project maximizes a narrow lot by organizing spaces around a central courtyard. The design provides privacy from neighboring buildings while bringing natural light and ventilation to all living spaces.",
      location: "Chicago, IL",
      year: "2022",
      style: "Contemporary",
      src: "/ArchCatalog/8.jpg",
    },
    {
      id: 9,
      title: "Glass Treehouse Retreat",
      description:
        "Nestled among mature trees, this residence appears to float within the forest canopy. Extensive glazing creates a transparent envelope that minimizes the boundary between architecture and nature, while thoughtful privacy screens maintain comfort.",
      location: "Seattle, WA",
      year: "2020",
      style: "Organic Modern",
      src: "/ArchCatalog/9.jpg",
    },
    {
      id: 10,
      title: "Sculptural Concrete Home",
      description:
        "This bold residence explores the plastic qualities of concrete, featuring curved walls and dramatic cantilevers. The monolithic exterior contrasts with warm, tactile interior finishes to create a balanced sensory experience.",
      location: "Los Angeles, CA",
      year: "2021",
      style: "Brutalist Modern",
      src: "/ArchCatalog/10.jpg",
    },
  ];

  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="w-full mx-auto py-6 bg-slate-900 min-h-screen">
      <div className="px-4 md:px-6 mb-8">
        <h2 className="text-2xl font-bold mb-2 text-white">
          Architectural Design
        </h2>
        <p className="text-slate-300 max-w-2xl">
          Explore my portfolio of residential architectural designs, showcasing
          a range of styles and approaches to creating thoughtful living spaces.
        </p>
      </div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 md:px-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {projects.map((project) => (
          <motion.div
            key={project.id}
            variants={itemVariants}
            className="group relative flex flex-col overflow-hidden rounded-xl shadow-lg bg-slate-800/30 backdrop-blur-md border border-slate-700/50 hover:shadow-xl transition-all duration-300"
          >
            {/* Project image */}
            <div
              className="relative h-64 overflow-hidden"
              onClick={() => openModal(project)}
            >
              <div
                className="w-full h-full transition-transform duration-500 group-hover:scale-105"
                style={{
                  backgroundImage: `url(${project.src})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white"
                >
                  View Details
                  <ExternalLink className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>

            {/* Project info */}
            <div className="flex flex-col flex-grow p-5 space-y-3">
              <h3 className="text-xl font-bold text-white">{project.title}</h3>
              <p className="text-slate-300 text-sm line-clamp-3">
                {project.description}
              </p>
              <div className="mt-auto pt-4 flex flex-col gap-2 text-xs text-slate-400">
                <div className="flex items-center">
                  <MapPin className="h-3.5 w-3.5 mr-2 text-blue-400" />
                  {project.location}
                </div>
                <div className="flex items-center">
                  <Calendar className="h-3.5 w-3.5 mr-2 text-blue-400" />
                  {project.year}
                </div>
                <div className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-blue-400 mr-2"></div>
                  {project.style}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Modal for full-page view */}
      {selectedProject && (
        <ImageModal
          isOpen={isModalOpen}
          onClose={closeModal}
          image={{
            src: selectedProject.src,
            title: selectedProject.title,
            description: selectedProject.description,
            medium: selectedProject.style,
            year: selectedProject.year,
          }}
        />
      )}
    </div>
  );
}
