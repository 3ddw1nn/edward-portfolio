"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowUpRight, Send, Mail, Github, Linkedin, Twitter } from "lucide-react";
import { motion } from "framer-motion";

import { Hero } from "@/components/sections/Hero";
import { SkillsShowcase } from "@/components/sections/SkillsShowcase";



const disciplines = [
  {
    num: "01",
    title: "Engineering",
    desc: "Full-stack web & mobile products",
    href: "/portfolio/applications",
  },
  {
    num: "02",
    title: "Art & Illustration",
    desc: "Digital painting, concept art & design",
    href: "/portfolio/illustrations",
  },
  {
    num: "03",
    title: "Architecture",
    desc: "Residential concepts & spatial studies",
    href: "/portfolio/architecture",
  },
];

function DisciplinesSection() {
  return (
    <section id="work" className="relative z-10 w-full bg-black text-white overflow-hidden scroll-mt-0">
      <div className="container mx-auto px-4 md:px-6">
        {disciplines.map((d, i) => (
          <motion.div
            key={d.num}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
          >
            <Link
              href={d.href}
              className="group flex items-center justify-between gap-4 py-8 md:py-10 border-b border-white/10 hover:border-white/30 transition-colors duration-300"
            >
              <div className="flex items-baseline gap-6 md:gap-10 min-w-0">
                <span className="font-brutal text-xs tracking-[0.2em] text-white/30 shrink-0">
                  {d.num}
                </span>
                <span
                  className="font-hero text-white uppercase leading-none tracking-tight group-hover:text-white/85 transition-colors duration-300"
                  style={{ fontSize: "clamp(2.5rem, 7vw, 6rem)" }}
                >
                  {d.title}
                </span>
              </div>
              <div className="flex items-center gap-6 md:gap-10 shrink-0">
                <span className="hidden md:block font-brutal text-xs tracking-[0.15em] uppercase text-white/35 group-hover:text-white/60 transition-colors duration-300">
                  {d.desc}
                </span>
                <ArrowUpRight className="h-5 w-5 md:h-6 md:w-6 text-white/30 group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function FeaturedWorkSection() {
  return (
    <section className="relative z-10 w-full bg-[#0a0a0a] text-white overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 py-20 md:py-28">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="font-display italic text-base md:text-lg text-white/55 tracking-wide mb-4"
        >
          Featured Project
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.05 }}
        >
          <div className="h-px mb-12 max-w-xs bg-white/25" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 border border-white/10">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[480px] bg-zinc-900 overflow-hidden order-1 lg:order-2"
          >
            <Image
              src="/images/muffin-screenshot.png"
              alt="Muffin App"
              fill
              className="object-contain object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/40 to-transparent lg:from-transparent lg:to-[#0a0a0a]/20" />
          </motion.div>

          {/* Copy */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col justify-center p-8 md:p-12 border-t lg:border-t-0 lg:border-r border-white/10 order-2 lg:order-1"
          >
            <h2 className="font-brutal font-semibold text-4xl md:text-5xl mt-2 text-white tracking-tight mb-6">
              Muffin App
            </h2>
            <p className="font-sans text-white/65 leading-relaxed mb-8 max-w-md">
              A food discovery app for LA & OC that recommends meals based on your taste
              preferences — not star ratings. Built with React Native, NestJS, and OpenAI
              across 800+ flavor profiles.
            </p>
            <div className="flex flex-wrap gap-2 mb-10">
              {["React Native", "NestJS", "PostgreSQL", "OpenAI", "Elasticsearch"].map((t) => (
                <span
                  key={t}
                  className="font-brutal text-[10px] tracking-[0.1em] uppercase text-white/45 border border-white/15 px-2.5 py-1"
                >
                  {t}
                </span>
              ))}
            </div>
            <Link
              href="/portfolio/applications"
              className="inline-flex items-center gap-2 font-brutal text-xs tracking-[0.2em] uppercase text-white border-b border-white/30 pb-1 hover:border-white transition-colors duration-200 self-start"
            >
              View all projects <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function ProfileSection() {
  const details = [
    { label: "Focus", value: "Full-stack product development, UI, and systems" },
    {
      label: "Now",
      value: "Open to full-time and contract engineering roles",
      emphasis: true,
    },
    {
      label: "Education",
      value: "Pratt Institute · California College of the Arts",
    },
    { label: "Based in", value: "Los Angeles, CA" },
  ];

  return (
    <section
      id="about"
      className="relative w-full py-20 md:py-28 overflow-hidden scroll-mt-0 bg-black"
    >
      <div className="absolute inset-0 bg-black pointer-events-none" aria-hidden />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-14"
        >
          <p className="font-display italic text-base md:text-lg text-white/55 tracking-wide">About</p>
          <h2 className="font-brutal font-semibold text-4xl md:text-5xl mt-2 text-white tracking-tight">Profile</h2>
          <div className="h-px mt-6 max-w-xs bg-white/25" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-6 rounded-sm border border-white/15 bg-black/40 p-6 md:p-8 backdrop-blur-sm"
          >
            <p className="font-sans text-lg md:text-xl leading-relaxed text-white">
              I&apos;m Edward Lee — engineer, artist, and designer.{" "}
              <span className="text-white/70">I like work that sits at the intersection of craft and clarity.</span>
            </p>
            <p className="font-sans text-white/70 leading-relaxed">
              I started with drawing and architecture, then went deep on code and product. Recent
              roles include contract engineering at Knoxlabs and founding-team work at Muffin;
              details are in the experience section above.
            </p>
            <div className="border-l-[3px] border-white/30 pl-4 py-0.5">
              <p className="font-sans text-base md:text-lg italic text-white/90 leading-relaxed">
                &ldquo;I make things that work beautifully, not just beautiful things that
                work.&rdquo;
              </p>
            </div>
            <div className="flex flex-wrap gap-3 pt-2">
              <a
                href="/Edward_Lee_Software_Engineer_Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="font-brutal text-xs tracking-[0.2em] font-medium px-6 py-3 border border-white/50 text-white hover:bg-white hover:text-black transition-colors duration-200 uppercase"
              >
                View Resume
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <dl className="space-y-0 border border-white/15 rounded-sm overflow-hidden divide-y divide-white/10 bg-black/40 backdrop-blur-sm">
              {details.map(({ label, value, emphasis }) => (
                <div key={label} className="px-5 py-4 sm:grid sm:grid-cols-3 sm:gap-4 md:py-5">
                  <dt className="font-brutal text-xs sm:col-span-1 mb-1 sm:mb-0 font-semibold text-white/60 uppercase tracking-widest">
                    {label}
                  </dt>
                  <dd
                    className={`font-sans text-base md:text-[1.05rem] sm:col-span-2 leading-relaxed ${emphasis ? "font-semibold text-white" : "text-white/85"}`}
                  >
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setIsSubmitted(false), 5000);
    }, 1500);
  };

  const inputBase =
    "w-full bg-white/10 border border-white/25 px-3 py-3 font-brutal text-sm tracking-wide text-white placeholder:text-white/50 focus:outline-none focus:bg-white/15 focus:border-white/60 transition-colors duration-200";

  const socialLinks = [
    { icon: Linkedin, href: "https://www.linkedin.com/in/edventuretech/", label: "LinkedIn" },
    { icon: Github, href: "https://github.com/3ddw1nn", label: "GitHub" },
    { icon: Twitter, href: "https://x.com/edventuretech", label: "Twitter" },
  ];

  return (
    <section
      id="contact"
      className="relative w-full py-20 md:py-28 overflow-hidden scroll-mt-0 [background-image:url('/images/hero-background.jpg')] bg-cover [background-position:center_85%] md:[background-position:center_100%]"
    >
      <div className="absolute inset-0 bg-black/65 pointer-events-none" aria-hidden />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-14"
        >
          <p className="font-display italic text-base md:text-lg text-white/55 tracking-wide">Contact</p>
          <h2 className="font-brutal font-semibold text-4xl md:text-5xl mt-2 text-white tracking-tight">Get in touch</h2>
          <div className="h-px mt-6 max-w-xs bg-white/25" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-20">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-3 order-2 lg:order-1"
          >
            {isSubmitted && (
              <div className="border border-white/20 bg-white/5 px-5 py-4 mb-8 font-brutal text-sm tracking-wide flex items-center gap-2">
                <span className="inline-block h-1.5 w-1.5 bg-white rounded-full shrink-0" />
                Thanks — I&apos;ll get back to you soon.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label className="font-brutal text-[10px] tracking-[0.2em] uppercase text-white/70 block mb-3">Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Your name" className={inputBase} />
              </div>
              <div>
                <label className="font-brutal text-[10px] tracking-[0.2em] uppercase text-white/70 block mb-3">Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="your@email.com" className={inputBase} />
              </div>
              <div>
                <label className="font-brutal text-[10px] tracking-[0.2em] uppercase text-white/70 block mb-3">Subject</label>
                <input type="text" name="subject" value={formData.subject} onChange={handleChange} required placeholder="What's this regarding?" className={inputBase} />
              </div>
              <div>
                <label className="font-brutal text-[10px] tracking-[0.2em] uppercase text-white/70 block mb-3">Message</label>
                <textarea name="message" value={formData.message} onChange={handleChange} required rows={6} placeholder="Tell me about your project..." className={`${inputBase} resize-none`} />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 font-brutal text-xs tracking-[0.2em] uppercase px-7 py-3.5 bg-white text-black hover:bg-white/90 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Sending…" : <><span>Send</span><Send className="h-3.5 w-3.5" /></>}
              </button>
            </form>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2 space-y-6 order-1 lg:order-2"
          >
            <div className="border border-white/15 bg-black/40 backdrop-blur-sm p-6 space-y-4">
              <div className="font-brutal text-[10px] tracking-[0.2em] uppercase text-white/50">Email</div>
              <a href="mailto:ehleedev@gmail.com" className="flex items-center gap-3 group">
                <Mail className="h-4 w-4 text-white/40 group-hover:text-white transition-colors" />
                <span className="font-brutal text-sm tracking-wide text-white/80 group-hover:text-white transition-colors">ehleedev@gmail.com</span>
              </a>
            </div>

            <div className="border border-white/15 bg-black/40 backdrop-blur-sm p-6 space-y-4">
              <div className="font-brutal text-[10px] tracking-[0.2em] uppercase text-white/50">Social</div>
              <div className="space-y-3">
                {socialLinks.map(({ icon: Icon, href, label }) => (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 group">
                    <Icon className="h-4 w-4 text-white/40 group-hover:text-white transition-colors" />
                    <span className="font-brutal text-sm tracking-wide text-white/80 group-hover:text-white transition-colors">{label}</span>
                  </a>
                ))}
              </div>
            </div>

            <div className="border border-white/15 bg-black/40 backdrop-blur-sm p-6">
              <div className="font-brutal text-[10px] tracking-[0.2em] uppercase text-white/50 mb-3">Availability</div>
              <div className="flex items-center gap-2.5">
                <span className="inline-block h-1.5 w-1.5 bg-white rounded-full animate-pulse" />
                <span className="font-brutal text-sm tracking-wide text-white font-semibold">Open to new roles</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />

      {/* Sections above hero fixed layers */}
      <div className="relative z-[20] isolate">
        <DisciplinesSection />
        <FeaturedWorkSection />
      </div>

      <div className="relative z-[20] isolate bg-black text-white">
        <SkillsShowcase />

        <ProfileSection />
      </div>

      <div className="relative z-[20] isolate">
        <ContactSection />
      </div>
    </div>
  );
}
