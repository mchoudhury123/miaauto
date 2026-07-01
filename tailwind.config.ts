import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Deep, warm near-black for a cinematic luxury base.
        ink: {
          DEFAULT: "#0b0b0d",
          50: "#f6f6f7",
          100: "#e9e9ec",
          200: "#cbccd1",
          300: "#a0a2ab",
          400: "#6f7280",
          500: "#4d4f5b",
          600: "#363842",
          700: "#26272f",
          800: "#17181d",
          900: "#0e0e11",
          950: "#070708",
        },
        // Premium emerald green — the brand accent.
        green: {
          DEFAULT: "#1f8a4f",
          50: "#edf7f0",
          100: "#d2ecda",
          200: "#a6d8b9",
          300: "#71bd8f",
          400: "#3fa268",
          500: "#1f8a4f",
          600: "#177040",
          700: "#155a35",
          800: "#12432a",
          900: "#0d2d1d",
          950: "#071a10",
        },
        // Clean, near-white background for a light, easy-to-read layout.
        cream: {
          DEFAULT: "#fbfcfb",
          50: "#ffffff",
          100: "#f4f6f4",
          200: "#e8ebe8",
          300: "#d7dcd7",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
        wordmark: ["var(--font-wordmark)", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        luxe: "0.28em",
      },
      boxShadow: {
        luxe: "0 30px 60px -20px rgba(11,11,13,0.35)",
        "luxe-sm": "0 18px 40px -18px rgba(11,11,13,0.30)",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-fast": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        shimmer: { "100%": { transform: "translateX(100%)" } },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        kenburns: {
          "0%": { transform: "scale(1.05) translate(0,0)" },
          "100%": { transform: "scale(1.18) translate(-1.5%,-1.5%)" },
        },
        "green-sweep": {
          "0%": { backgroundPosition: "200% center" },
          "100%": { backgroundPosition: "-200% center" },
        },
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.7s cubic-bezier(0.22,1,0.36,1) both",
        "fade-in-fast": "fade-in-fast 0.4s ease-out both",
        shimmer: "shimmer 1.5s infinite",
        marquee: "marquee 38s linear infinite",
        kenburns: "kenburns 18s ease-out alternate infinite",
        "green-sweep": "green-sweep 6s linear infinite",
        float: "float 5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
