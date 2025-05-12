"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
  SheetHeader,
} from "@/components/ui/sheet";
import { Menu, Home } from "lucide-react";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/60">
      <div className="container mx-auto flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Logo and Name */}
          <Link
            href="/"
            className="flex items-center gap-2 transition-colors hover:opacity-80"
          >
            <span className="font-semibold text-lg hidden sm:inline-block font-['Epkaisho']">
              Edward Lee
            </span>
            <span className="font-semibold text-lg sm:hidden font-['Epkaisho']">
              E. Lee
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-4">
          <Button variant="ghost" asChild className="h-9 px-4 font-medium">
            <Link href="/" className="flex items-center gap-1.5">
              <Home className="h-4 w-4" />
              Home
            </Link>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="ghost" className="h-9 px-4 font-medium">
                Portfolio
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem className="cursor-pointer p-0">
                <Link
                  href="/portfolio/applications"
                  className="w-full px-2 py-1.5 block"
                >
                  Applications
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer p-0">
                <Link
                  href="/portfolio/illustrations"
                  className="w-full px-2 py-1.5 block"
                >
                  Illustrations
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer p-0">
                <Link
                  href="/portfolio/architecture"
                  className="w-full px-2 py-1.5 block"
                >
                  Architecture
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Link
            href="/contact"
            className="text-sm font-medium text-slate-50 hover:text-slate-300 transition-colors px-4 py-2"
          >
            Contact
          </Link>
        </nav>

        {/* Mobile Navigation */}
        {/* <div className="flex items-center gap-2 md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[350px]">
              <SheetHeader>
                <SheetTitle>Navigation Menu</SheetTitle>
                <SheetDescription>
                  Access Edward Lee&apos;s portfolio sections and contact
                  information.
                </SheetDescription>
              </SheetHeader>

              <div className="flex items-center gap-2 mt-4 mb-8">
                <div className="relative h-9 w-9 overflow-hidden rounded-full bg-gradient-to-br from-slate-700 to-slate-900">
                  <div className="flex h-full w-full items-center justify-center text-white font-semibold">
                    EL
                  </div>
                </div>
                <span className="font-semibold text-lg font-[\'Epkaisho\']">
                  Edward Lee
                </span>
              </div>

              <nav className="flex flex-col gap-5">
                <Link
                  href="/"
                  onClick={() => setIsOpen(false)}
                  className="px-3 py-2 text-base font-medium hover:bg-slate-800 rounded-md transition-colors flex items-center gap-2"
                >
                  <Home className="h-4 w-4" />
                  Home
                </Link>
                <div className="flex flex-col gap-3 py-5 border-t border-b border-slate-700">
                  <h3 className="text-sm font-medium text-slate-400 mt-5">
                    Portfolio
                  </h3>
                  <Link
                    href="/portfolio/applications"
                    onClick={() => setIsOpen(false)}
                    className="px-3 py-2 text-base hover:bg-slate-800 rounded-md transition-colors"
                  >
                    Applications
                  </Link>
                  <Link
                    href="/portfolio/illustrations"
                    onClick={() => setIsOpen(false)}
                    className="px-3 py-2 text-base hover:bg-slate-800 rounded-md transition-colors"
                  >
                    Illustrations
                  </Link>
                  <Link
                    href="/portfolio/architecture"
                    onClick={() => setIsOpen(false)}
                    className="px-3 py-2 text-base hover:bg-slate-800 rounded-md transition-colors"
                  >
                    Architecture
                  </Link>
                </div>
                <Link
                  href="/contact"
                  onClick={() => setIsOpen(false)}
                  className="px-3 py-2 text-base font-medium hover:bg-slate-800 rounded-md transition-colors"
                >
                  Contact
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div> */}
      </div>
    </header>
  );
}
