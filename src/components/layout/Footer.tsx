import Link from "next/link";
import { Github, Linkedin, Twitter, Instagram } from "lucide-react";

const socialLinks = [
  { icon: Github, href: "https://github.com/3ddw1nn", label: "GitHub" },
  { icon: Linkedin, href: "https://www.linkedin.com/in/edventuretech/", label: "LinkedIn" },
  { icon: Twitter, href: "https://x.com/edventuretech", label: "Twitter" },
  { icon: Instagram, href: "https://instagram.com/edwardlee", label: "Instagram" },
];

export function Footer() {
  return (
    <footer className="w-full border-t border-white/10 bg-black font-sans text-white">
      <div className="container mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-5">
        <span className="font-brutal text-[10px] tracking-[0.2em] uppercase text-white/40">
          Edward Lee © {new Date().getFullYear()}
        </span>

        <div className="flex items-center gap-5">
          {socialLinks.map(({ icon: Icon, href, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="text-white/40 hover:text-white transition-colors duration-200"
            >
              <Icon className="h-4 w-4" />
            </a>
          ))}
        </div>

        <Link
          href="mailto:ehleedev@gmail.com"
          className="font-brutal text-[10px] tracking-[0.2em] uppercase text-white/40 hover:text-white transition-colors duration-200"
        >
          ehleedev@gmail.com
        </Link>
      </div>
    </footer>
  );
}
