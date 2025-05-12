import Link from "next/link";
import { Github, Linkedin, Twitter, Instagram } from "lucide-react";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="w-full border-t py-8 md:py-10 bg-slate-50 dark:bg-black">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="relative h-8 w-8 overflow-hidden rounded-full bg-white">
                <Image
                  src="/images/HeaderLogo.png"
                  alt="Edward Lee Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="font-semibold font-['Epkaisho']">
                Edward Lee
              </span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md">
              Creative professional specializing in applications, illustrations,
              and architecture. Available for freelance projects and
              collaborations.
            </p>
            <div className="flex gap-4 mt-4">
              <a
                href="https://github.com/3ddw1nn"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors"
              >
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </a>
              <a
                href="https://www.linkedin.com/in/edventuretech/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors"
              >
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </a>
              <a
                href="https://x.com/edventuretech"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors"
              >
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a>
              <Link
                href="https://instagram.com/edwardlee"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors"
              >
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-sm mb-3 text-slate-800 dark:text-slate-200">
              Portfolio
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/portfolio/applications"
                  className="text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors"
                >
                  Applications
                </Link>
              </li>
              <li>
                <Link
                  href="/portfolio/illustrations"
                  className="text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors"
                >
                  Illustrations
                </Link>
              </li>
              <li>
                <Link
                  href="/portfolio/architecture"
                  className="text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors"
                >
                  Architecture
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-sm mb-3 text-slate-800 dark:text-slate-200">
              Contact
            </h3>
            <ul className="space-y-2">
              <li className="text-sm text-slate-600 dark:text-slate-400">
                ehleedev@gmail.com
              </li>
              <li className="mt-3">
                <Link
                  href="/contact"
                  className="text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors"
                >
                  Contact Form
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-center text-slate-600 dark:text-slate-400 md:text-left">
            © {new Date().getFullYear()} Edward Lee. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs text-slate-600 dark:text-slate-400">
            <Link href="#" className="hover:underline">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:underline">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
