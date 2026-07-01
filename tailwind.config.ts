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
        // Metallic champagne gold.
        gold: {
          DEFAULT: "#c8a45c",
          50: "#fbf8f0",
          100: "#f4ecd8",
          200: "#e9d7ad",
          300: "#dcbd7c",
          400: "#d1a85c",
          500: "#c8a45c",
          600: "#ad8542",
          700: "#8a6736",
          800: "#5f4828",
          900: "#3c2e1b",
        },
        // Warm paper background for an editorial feel.
        cream: {
          DEFAULT: "#f7f4ee",
          50: "#fdfcfa",
          100: "#f7f4ee",
          200: "#efe9df",
          300: "#e3dacb",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
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
        "gold-sweep": {
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
        "gold-sweep": "gold-sweep 6s linear infinite",
        float: "float 5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
