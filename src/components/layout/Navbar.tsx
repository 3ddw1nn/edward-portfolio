"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
const navLinks = [
  { label: "Work", href: "/#work" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/#contact" },
];

const navShadow =
  "drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)] drop-shadow-[0_0_12px_rgba(0,0,0,0.45)]";

export function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 min-h-[3.75rem] md:min-h-16 transition-colors duration-300 ${
          menuOpen ? "bg-black/92 backdrop-blur-md" : "bg-transparent"
        }`}
      >
        <div className="container mx-auto min-h-[3.75rem] md:min-h-16 px-4 md:px-6 flex items-center justify-between py-2">
          <Link
            href="/"
            className={`font-brutal tracking-wide transition-colors text-base md:text-lg text-white hover:text-white/90 ${navShadow}`}
          >
            Edward Lee
          </Link>

          <nav className="hidden md:flex items-center gap-9 lg:gap-10">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`font-brutal text-sm tracking-[0.2em] uppercase transition-colors duration-200 relative group ${navShadow} ${
                    isActive ? "text-white" : "text-white/70 hover:text-white"
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute -bottom-1 left-0 h-0.5 bg-white transition-all duration-300 ${
                      isActive ? "w-full opacity-90" : "w-0 group-hover:w-full opacity-60"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          <button
            className={`md:hidden p-2 -mr-2 rounded-md transition-colors text-white hover:bg-white/10 ${navShadow}`}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-40 flex flex-col pt-[3.75rem] md:pt-16 bg-black text-white">
          <div className="absolute inset-0 pointer-events-none opacity-30 bg-white/5" aria-hidden />
          <nav className="flex flex-col justify-center flex-1 container mx-auto gap-8 relative z-10">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-brutal text-2xl sm:text-3xl tracking-[0.15em] uppercase transition-colors duration-200 border-b pb-6 text-white border-white/15 hover:text-white/70"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-8">
              <p className="font-brutal text-[10px] tracking-[0.2em] uppercase text-white/40">ehleedev@gmail.com</p>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
