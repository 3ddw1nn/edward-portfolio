/** @type {import('tailwindcss').Config} */
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        paper: {
          DEFAULT: "#e9e3d8",
          warm: "#f3eee6",
          deep: "#ddd6ca",
        },
        ink: {
          DEFAULT: "#0f0e0c",
          muted: "#3a3633",
          faint: "#5c5650",
        },
        /* Legacy aliases → paper & ink (existing class names keep working) */
        void: "#e9e3d8",
        surface: "#f3eee6",
        surface2: "#ddd6ca",
        lime: "#0f0e0c",
        elcyan: "#2a2622",
        dim: "#3a3633",
      },
      borderRadius: {
        lg: "0",
        md: "0",
        sm: "0",
        DEFAULT: "0",
      },
      fontFamily: {
        sans: ["var(--font-body)", "Georgia", "Times New Roman", "serif"],
        display: [
          "var(--font-display)",
          "Georgia",
          "Times New Roman",
          "serif",
        ],
        mono: ["var(--font-body)", "Georgia", "serif"],
        brutal: ["var(--font-brutal)", "system-ui", "sans-serif"],
        hero: ["var(--font-hero)", "system-ui", "sans-serif"],
      },
      keyframes: {
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "expand-width": {
          from: { width: "0" },
          to: { width: "100%" },
        },
      },
      animation: {
        blink: "blink 1s step-end infinite",
        "slide-up": "slide-up 0.6s ease forwards",
        "expand-width": "expand-width 0.8s ease forwards 0.5s",
      },
    },
  },
  plugins: [],
};
