"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Code, Palette, Building } from "lucide-react";

import { SkillsShowcase } from "@/components/SkillsShowcase";
import { motion } from "framer-motion";
import { Hero } from "@/components/Hero";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-black">
      {/* Hero Component */}
      <Hero />

      {/* Featured Work Section */}
      <section className="w-full py-20 md:py-28 bg-black relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
          <div className="absolute -rotate-45 h-[1px] w-[200%] bg-gradient-to-r from-transparent via-blue-400 to-transparent top-1/4 -left-1/2"></div>
          <div className="absolute -rotate-45 h-[1px] w-[200%] bg-gradient-to-r from-transparent via-purple-400 to-transparent top-2/4 -left-1/2"></div>
          <div className="absolute -rotate-45 h-[1px] w-[200%] bg-gradient-to-r from-transparent via-amber-400 to-transparent top-3/4 -left-1/2"></div>
        </div>

        {/* Noise texture overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuNjUiIG51bU9jdGF2ZXM9IjMiIHN0aXRjaFRpbGVzPSJzdGl0Y2giIHJlc3VsdD0ibm9pc2UiLz48ZmVDb2xvck1hdHJpeCB0eXBlPSJtYXRyaXgiIHZhbHVlcz0iMSAwIDAgMCAwIDAgMSAwIDAgMCAwIDAgMSAwIDAgMCAwIDAgMC4wNSAwIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI25vaXNlKSIvPjwvc3ZnPg==')] opacity-20 mix-blend-overlay"></div>

        {/* Background glow effects */}
        <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-purple-500/10 blur-3xl"></div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <div className="inline-block rounded-none bg-blue-500/10 backdrop-blur-sm px-4 py-2 text-xs text-blue-300 border border-blue-500/20 transform -rotate-1 uppercase tracking-widest">
              Portfolio
            </div>

            <div className="flex flex-col md:flex-row items-start md:items-end justify-between">
              <h2 className="text-left mt-5">
                <span className=" text-4xl md:text-6xl font-black tracking-tight text-white mix-blend-difference font-['Epkaisho']">
                  FEATURED
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-amber-400">
                    WORK
                  </span>
                </span>
              </h2>

              <p className="max-w-[500px] text-slate-300 text-sm md:text-base mt-4 md:mt-0 tracking-wide">
                A selection of projects that showcase my approach to
                <span className="font-medium text-white">
                  {" "}
                  design, development, and creative problem-solving.
                </span>
              </p>
            </div>

            <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-slate-700 to-transparent mt-8"></div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mt-12">
            {/* Applications */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="md:col-span-4 group"
            >
              <div className="relative overflow-hidden backdrop-blur-md bg-slate-800/30 border border-slate-700/50 shadow-xl transform rotate-1 hover:rotate-0 transition-all duration-300 h-full">
                <div className="absolute -inset-1 bg-gradient-to-br from-blue-500/20 to-blue-700/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>

                <div className="relative p-8 flex flex-col h-full">
                  <div className="mb-6">
                    <div className="relative h-16 w-16 rounded-none bg-blue-900/30 flex items-center justify-center border border-blue-500/30 transform -rotate-3 group-hover:rotate-0 transition-all duration-300">
                      <Code className="h-8 w-8 text-blue-400" />
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-3 uppercase tracking-tight font-['Epkaisho']">
                    Applications
                  </h3>

                  <p className="text-slate-300 mb-6 text-sm tracking-wide">
                    Innovative software solutions and web applications built
                    with modern technologies.
                  </p>

                  <div className="mt-auto">
                    <Button
                      variant="ghost"
                      asChild
                      className="group text-blue-300 hover:text-blue-200 hover:bg-blue-500/10 rounded-none border border-blue-500/0 hover:border-blue-500/30 transition-all duration-300"
                    >
                      <Link
                        href="/portfolio/applications"
                        className="flex items-center gap-2 text-xs uppercase tracking-widest"
                      >
                        Explore
                        <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Illustrations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="md:col-span-4 group"
            >
              <div className="relative overflow-hidden backdrop-blur-md bg-slate-800/30 border border-slate-700/50 shadow-xl transform -rotate-1 hover:rotate-0 transition-all duration-300 h-full">
                <div className="absolute -inset-1 bg-gradient-to-br from-purple-500/20 to-purple-700/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>

                <div className="relative p-8 flex flex-col h-full">
                  <div className="mb-6">
                    <div className="relative h-16 w-16 rounded-none bg-purple-900/30 flex items-center justify-center border border-purple-500/30 transform rotate-3 group-hover:rotate-0 transition-all duration-300">
                      <Palette className="h-8 w-8 text-purple-400" />
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-3 uppercase tracking-tight font-['Epkaisho']">
                    Illustrations
                  </h3>

                  <p className="text-slate-300 mb-6 text-sm tracking-wide">
                    Creative digital and traditional illustrations across
                    various styles and subjects.
                  </p>

                  <div className="mt-auto">
                    <Button
                      variant="ghost"
                      asChild
                      className="group text-purple-300 hover:text-purple-200 hover:bg-purple-500/10 rounded-none border border-purple-500/0 hover:border-purple-500/30 transition-all duration-300"
                    >
                      <Link
                        href="/portfolio/illustrations"
                        className="flex items-center gap-2 text-xs uppercase tracking-widest"
                      >
                        Explore
                        <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Architecture */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="md:col-span-4 group"
            >
              <div className="relative overflow-hidden backdrop-blur-md bg-slate-800/30 border border-slate-700/50 shadow-xl transform rotate-1 hover:rotate-0 transition-all duration-300 h-full">
                <div className="absolute -inset-1 bg-gradient-to-br from-amber-500/20 to-amber-700/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>

                <div className="relative p-8 flex flex-col h-full">
                  <div className="mb-6">
                    <div className="relative h-16 w-16 rounded-none bg-amber-900/30 flex items-center justify-center border border-amber-500/30 transform -rotate-3 group-hover:rotate-0 transition-all duration-300">
                      <Building className="h-8 w-8 text-amber-400" />
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-3 uppercase tracking-tight font-['Epkaisho']">
                    Architecture
                  </h3>

                  <p className="text-slate-300 mb-6 text-sm tracking-wide">
                    Innovative architectural designs and concepts that blend
                    form and function.
                  </p>

                  <div className="mt-auto">
                    <Button
                      variant="ghost"
                      asChild
                      className="group text-amber-300 hover:text-amber-200 hover:bg-amber-500/10 rounded-none border border-amber-500/0 hover:border-amber-500/30 transition-all duration-300"
                    >
                      <Link
                        href="/portfolio/architecture"
                        className="flex items-center gap-2 text-xs uppercase tracking-widest"
                      >
                        Explore
                        <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Skills Showcase Section */}
      <SkillsShowcase />

      {/* About Section */}
      <section className="w-full py-20 md:py-28 bg-black relative overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-1/4 right-0 w-72 h-72 rounded-full bg-blue-500/10 blur-3xl"></div>
        <div className="absolute bottom-1/4 left-0 w-96 h-96 rounded-full bg-purple-500/5 blur-3xl"></div>
        {/* Add more visual interest with diagonal lines */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
          <div className="absolute -rotate-45 h-[1px] w-[200%] bg-gradient-to-r from-transparent via-blue-400 to-transparent top-1/4 -left-1/2"></div>
          <div className="absolute -rotate-45 h-[1px] w-[200%] bg-gradient-to-r from-transparent via-purple-400 to-transparent top-2/4 -left-1/2"></div>
          <div className="absolute -rotate-45 h-[1px] w-[200%] bg-gradient-to-r from-transparent via-amber-400 to-transparent top-3/4 -left-1/2"></div>
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-block rounded-lg bg-blue-500/10 backdrop-blur-sm px-4 py-2 text-sm text-blue-300 border border-blue-500/20 transform -rotate-1">
                WHO I AM
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white mix-blend-difference">
                <span className="text-2xl block mb-1 font-light tracking-widest font-['Epkaisho']">
                  NOT YOUR TYPICAL
                </span>
                <span className="font-black italic font-['Epkaisho']">
                  CREATIVE
                </span>
              </h2>
              <div className="space-y-5 text-slate-300">
                <p className="text-xl font-light leading-relaxed">
                  I&apos;m Edward Lee. Co-founder at Muffin Technologies.
                  <span className="font-medium text-white">
                    {" "}
                    I don&apos;t fit in boxes.
                  </span>
                </p>

                <p className="text-sm tracking-wide">
                  Started with a pencil. Ended up with code. Somewhere in
                  between, I fell for architecture. Now I build digital spaces
                  that make sense. No fluff, no nonsense.
                </p>

                <p className="text-base border-l-2 border-blue-400 pl-4 italic">
                  &ldquo;I make things that work beautifully, not just beautiful
                  things that work.&rdquo;
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 text-xs uppercase tracking-widest">
                  <div className="backdrop-blur-sm bg-slate-800/30 p-4 rounded-lg border border-slate-700/50 transform rotate-1 hover:rotate-0 transition-transform">
                    <span className="block text-blue-400 font-bold mb-2">
                      EDUCATION
                    </span>
                    <span className="text-slate-300">
                      Pratt Institute + California College of the Arts
                    </span>
                  </div>

                  <div className="backdrop-blur-sm bg-slate-800/30 p-4 rounded-lg border border-slate-700/50 transform -rotate-1 hover:rotate-0 transition-transform">
                    <span className="block text-purple-400 font-bold mb-2">
                      TECH STACK
                    </span>
                    <span className="text-slate-300">
                      React Native, NestJS, UI/UX
                    </span>
                  </div>

                  <div className="backdrop-blur-sm bg-slate-800/30 p-4 rounded-lg border border-slate-700/50 transform rotate-1 hover:rotate-0 transition-transform">
                    <span className="block text-amber-400 font-bold mb-2">
                      TOOLS
                    </span>
                    <span className="text-slate-300">
                      Adobe Suite + Dev Tools
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border border-white/20 transition-all duration-300 rounded-none transform -rotate-1 hover:rotate-0 hover:translate-y-[-2px]"
                >
                  <Link href="/contact" className="px-6 py-2.5">
                    GET IN TOUCH
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  asChild
                  size="lg"
                  className="border-purple-500/50 text-purple-300 hover:bg-purple-500/10 transition-all duration-300 rounded-none transform rotate-1 hover:rotate-0 hover:translate-y-[-2px]"
                >
                  <Link href="/portfolio/applications" className="px-6 py-2.5">
                    SEE MY WORK
                  </Link>
                </Button>
              </div>
            </div>
            <div className="relative mx-auto aspect-square max-w-md overflow-hidden rounded-none bg-slate-800/50 backdrop-blur-md border border-slate-700/50 shadow-xl transform rotate-3 hover:rotate-0 transition-all duration-500">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative h-56 w-56 overflow-hidden rounded-none bg-slate-700/70 backdrop-blur-sm border border-slate-600/50 shadow-lg transform -rotate-6 hover:rotate-0 transition-all duration-500">
                  <div className="flex h-full w-full items-center justify-center text-slate-300">
                    <span className="text-lg font-mono">Profile Image</span>
                  </div>
                </div>
                <div className="absolute -bottom-6 -right-6 h-40 w-40 rounded-full bg-gradient-to-br from-blue-400/20 to-blue-600/20 blur-2xl"></div>
                <div className="absolute -top-6 -left-6 h-40 w-40 rounded-full bg-gradient-to-br from-purple-400/20 to-purple-600/20 blur-2xl"></div>
              </div>
              {/* Add glitch effect overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-transparent opacity-50 mix-blend-overlay"></div>
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImEiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgcGF0dGVyblRyYW5zZm9ybT0icm90YXRlKDQ1KSI+PHBhdGggZD0iTTAgMGgyMHYyMEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0tMTAgMTBsMjAtMjBNMTAgMzBsMjAtMjBNLTEwIDMwbDIwLTIwIiBzdHJva2U9IiNmZmYiIHN0cm9rZS1vcGFjaXR5PSIuMDUiIHN0cm9rZS13aWR0aD0iLjUiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjYSkiLz48L3N2Zz4=')]"></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
