"use client";

import { ExternalLink, Code, Layers, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Image from "next/image";

// Define application project type
type AppProject = {
  id: number;
  title: string;
  description: string;
  longDescription: string;
  technologies: string[];
  features: string[];
  url: string;
  imageUrl: string;
  category: "web" | "mobile" | "ai";
  hasCustomImage: boolean;
  customImageComponent?: boolean;
};

export default function ApplicationsPage() {
  // Application projects data
  const projects: AppProject[] = [
    {
      id: 1,
      title: "Muffin App",
      description:
        "A food discovery app that recommends meals based on taste preferences.",
      longDescription:
        "Muffin is a food discovery app that helps users find their next perfect meal in Los Angeles & Orange County. Instead of relying on star ratings and endless review scrolling, Muffin recommends food nearby that others love based on your specific taste preferences. The app features a simple swipe interface, over 800 unique flavor profiles, and focuses on the food first rather than the restaurant. It's designed for foodies of all flavors to discover new favorites without the hassle of research.",
      technologies: [
        "React Native",
        "Expo",
        "TypeScript",
        "NestJS",
        "React Query",
        "PostgreSQL",
        "Digital Ocean",
        "Cloudinary",
        "Elasticsearch",
        "OpenAI",
        "Prisma",
        "Apple App Store",
      ],
      features: [
        "Personalized food recommendations based on taste preferences",
        "Location-based suggestions for nearby restaurants",
        "Swipe interface to discover new dishes",
        "Community-driven food recommendations",
        "Over 800 unique flavor profiles to match with users",
      ],
      url: "https://muffinapp.io",
      imageUrl: "bg-gradient-to-br from-orange-400 to-pink-600",
      category: "mobile",
      hasCustomImage: false,
      customImageComponent: true,
    },
    {
      id: 2,
      title: "Story Discount",
      description:
        "A platform connecting businesses with customers through storytelling and discounts.",
      longDescription:
        "Story Discount is an innovative platform that allows businesses to share their unique stories with customers through QR codes. When customers scan these codes, they learn about the business's journey, values, and mission. After engaging with the story, customers receive a discount on their next visit, creating a win-win situation where businesses build deeper connections with their audience while incentivizing repeat visits. The platform features a sleek interface with a beautiful purple-to-blue gradient design that enhances the storytelling experience.",
      technologies: [
        "Wasp",
        "Next.js",
        "React",
        "TypeScript",
        "Auth0",
        "Google Auth",
        "Stripe",
        "PostgreSQL",
        "Prisma",
        "Tailwind CSS",
        "QR Code Generation",
      ],
      features: [
        "Custom QR code generation for businesses",
        "Engaging storytelling interface for customers",
        "Automated discount delivery after story completion",
        "Business analytics dashboard",
        "Mobile-optimized experience for on-the-go scanning",
        "Modern UI with beautiful gradient backgrounds",
      ],
      url: "https://storydiscount.com",
      imageUrl: "bg-gradient-to-br from-blue-500 to-purple-600",
      category: "web",
      hasCustomImage: false,
      customImageComponent: true,
    },
    {
      id: 3,
      title: "Lexcalibur AI",
      description:
        "An AI platform that identifies business opportunities from new legislation.",
      longDescription:
        "Lexcalibur AI is an innovative platform that helps entrepreneurs and businesses identify new opportunities whenever laws are passed. The service monitors legislative changes across federal and state levels, then uses AI to generate potential business ideas based on these new regulations. With Lexcalibur, users can stay ahead of the market and be first-to-market with solutions that address newly created needs or opportunities.",
      technologies: [
        "Next.js",
        "TypeScript",
        "React Query",
        "Pinecone",
        "PostgreSQL",
        "Prisma",
        "Apify",
        "NestJS",
        "Tailwind CSS",
        "OpenAI API",
      ],
      features: [
        "AI-powered business idea generation based on new laws",
        "Potential rating system for business opportunities",
        "Personalized recommendations based on user interests",
        "Real-time monitoring of federal and state legislation",
        "Email and text notifications for urgent updates",
      ],
      url: "https://lexcalibur.ai",
      imageUrl: "bg-gradient-to-br from-emerald-400 to-cyan-600",
      category: "ai",
      hasCustomImage: false,
      customImageComponent: true,
    },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <div className="w-full mx-auto py-6 bg-slate-900 min-h-screen relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-20 right-[10%] w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-[5%] w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"></div>
      <div className="absolute top-[40%] left-[20%] w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>

      <div className="relative z-10">
        <div className="px-4 md:px-6 mb-12">
          <h2 className="text-3xl font-bold mb-3 text-white">Introduction</h2>
          <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4"></div>
          <p className="text-slate-300 max-w-2xl">
            I learned to code before AI tools existed, which means I know
            what&apos;s happening under the hood. I can leverage AI to work
            faster, but I&apos;m not dependent on it. The difference shows in
            the quality of the final product. Stop hiring non-coders to code
            with AI. Hire coders who know how to use AI effectively.
          </p>
        </div>

        <motion.div
          className="space-y-32 px-4 md:px-6 mb-20"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              variants={itemVariants}
              className="relative"
            >
              {/* Project number */}
              <div className="absolute -left-4 -top-12 text-8xl font-bold text-white/5">
                {String(index + 1).padStart(2, "0")}
              </div>

              {/* Project card */}
              <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 relative z-10">
                {/* Project image/preview */}
                <div className="w-full lg:w-1/2 h-[300px] md:h-[400px] rounded-xl overflow-hidden bg-slate-800/30 backdrop-blur-md border border-slate-700/50 shadow-lg group">
                  {project.customImageComponent && project.id === 1 ? (
                    <div className="w-full h-full relative overflow-hidden">
                      <div className="absolute inset-0 bg-white group-hover:scale-105 transition-transform duration-700">
                        {/* This is where we render the Muffin App screenshot */}
                        <div
                          className="w-full h-full bg-cover bg-center"
                          style={{
                            backgroundImage: `url('/images/muffin-screenshot.png')`,
                            backgroundSize: "cover",
                            backgroundPosition: "top center",
                          }}
                        ></div>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/30 backdrop-blur-[2px] flex items-center justify-center">
                        <div className="text-center p-6 max-w-md">
                          <div className="text-3xl font-bold text-white mb-3">
                            {project.title}
                          </div>
                          <p className="text-white/80 mb-6">
                            {project.description}
                          </p>
                          <Button
                            className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-md"
                            onClick={() => window.open(project.url, "_blank")}
                          >
                            Visit Website
                            <ExternalLink className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : project.customImageComponent && project.id === 2 ? (
                    <div className="w-full h-full relative overflow-hidden">
                      <div className="absolute inset-0 bg-white group-hover:scale-105 transition-transform duration-700">
                        {/* This is where we render the Story Discount screenshot */}
                        <div
                          className="w-full h-full bg-cover bg-center"
                          style={{
                            backgroundImage: `url('/images/story-discount-screenshot.png')`,
                            backgroundSize: "cover",
                            backgroundPosition: "top center",
                          }}
                        ></div>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/30 backdrop-blur-[2px] flex items-center justify-center">
                        <div className="text-center p-6 max-w-md">
                          <div className="text-3xl font-bold text-white mb-3">
                            {project.title}
                          </div>
                          <p className="text-white/80 mb-6">
                            {project.description}
                          </p>
                          <Button
                            className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-md"
                            onClick={() => window.open(project.url, "_blank")}
                          >
                            Visit Website
                            <ExternalLink className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : project.customImageComponent && project.id === 3 ? (
                    <div className="w-full h-full relative overflow-hidden">
                      <div className="absolute inset-0 bg-black group-hover:scale-105 transition-transform duration-700">
                        {/* This is where we render the Lexcalibur AI screenshot */}
                        <div
                          className="w-full h-full bg-cover bg-center"
                          style={{
                            backgroundImage: `url('/images/lexcalibur-screenshot.png')`,
                            backgroundSize: "cover",
                            backgroundPosition: "top center",
                          }}
                        ></div>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20 backdrop-blur-[2px] flex items-center justify-center">
                        <div className="text-center p-6 max-w-md">
                          <div className="text-3xl font-bold text-white mb-3">
                            {project.title}
                          </div>
                          <p className="text-white/80 mb-6">
                            {project.description}
                          </p>
                          <Button
                            className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-md"
                            onClick={() => window.open(project.url, "_blank")}
                          >
                            Visit Website
                            <ExternalLink className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : project.hasCustomImage ? (
                    <div className="w-full h-full relative">
                      <Image
                        src={`/images/applications/${project.title
                          .toLowerCase()
                          .replace(/\s+/g, "-")}.jpg`}
                        alt={project.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
                        <div className="text-center p-6 max-w-md">
                          <div className="text-3xl font-bold text-white mb-3">
                            {project.title}
                          </div>
                          <p className="text-white/80 mb-6">
                            {project.description}
                          </p>
                          <Button
                            className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-md"
                            onClick={() => window.open(project.url, "_blank")}
                          >
                            Visit Website
                            <ExternalLink className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div
                      className={`w-full h-full flex items-center justify-center ${project.imageUrl} group-hover:scale-105 transition-transform duration-700`}
                    >
                      <div className="text-center p-6 backdrop-blur-sm bg-black/20 rounded-xl max-w-md">
                        <div className="text-3xl font-bold text-white mb-3">
                          {project.title}
                        </div>
                        <p className="text-white/80 mb-6">
                          {project.description}
                        </p>
                        <Button
                          className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-md"
                          onClick={() => window.open(project.url, "_blank")}
                        >
                          Visit Website
                          <ExternalLink className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Project details */}
                <div className="w-full lg:w-1/2 space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-3 flex items-center">
                      {project.title}
                      <span className="ml-3 px-2 py-1 text-xs rounded-full bg-slate-700/50 text-slate-300">
                        {project.category === "mobile"
                          ? "Mobile App"
                          : project.category === "ai"
                          ? "AI Platform"
                          : "Web App"}
                      </span>
                    </h3>
                    <p className="text-slate-300">{project.longDescription}</p>
                  </div>

                  {/* Technologies */}
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
                      <Code className="mr-2 h-5 w-5 text-blue-400" />
                      Technologies
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-slate-800/50 text-slate-300 text-sm rounded-full border border-slate-700/50 hover:bg-slate-700/50 transition-colors"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Features */}
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
                      <Layers className="mr-2 h-5 w-5 text-blue-400" />
                      Key Features
                    </h4>
                    <ul className="space-y-2">
                      {project.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <div className="h-2 w-2 rounded-full bg-blue-500 mt-2 mr-3"></div>
                          <span className="text-slate-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Visit button */}
                  <div className="pt-4">
                    <Button
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => window.open(project.url, "_blank")}
                    >
                      <Globe className="mr-2 h-5 w-5" />
                      Visit {project.title}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Divider */}
              {project.id !== projects.length && (
                <div className="w-full max-w-md mx-auto mt-16 border-t border-slate-800"></div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
