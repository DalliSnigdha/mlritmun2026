import type { Config } from "tailwindcss";

/**
 * MLRITMUN design tokens.
 * Palette: deep navy grounds, white typography, restrained ivory accents.
 */
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        blue: {
          950: "#050B1E", // page ground
          900: "#0A1530",
          850: "#0E1D3E",
          800: "#13274D",
          700: "#1B3563",
          600: "#244676",
        },
        ivory: {
          400: "#F7F1E1",
          500: "#E7D9B8",
          600: "#CBB98C",
          700: "#A8976B",
        },
        parchment: "#F4F1EA",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "Times New Roman", "serif"],
        sans: ["var(--font-sans)", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
      },
      letterSpacing: {
        widest2: "0.28em",
        widest3: "0.42em",
      },
      maxWidth: {
        content: "1200px",
      },
      backgroundImage: {
        "ivory-line":
          "linear-gradient(90deg, rgba(231,217,184,0) 0%, rgba(231,217,184,0.7) 50%, rgba(231,217,184,0) 100%)",
        "ivory-text":
          "linear-gradient(180deg, #F7F1E1 0%, #E7D9B8 55%, #A8976B 100%)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(18px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "spin-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        drift: {
          "0%,100%": { transform: "translate3d(0,0,0)" },
          "50%": { transform: "translate3d(0,-12px,0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        twinkle: {
          "0%, 100%": { opacity: "0.35" },
          "50%": { opacity: "1" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s cubic-bezier(0.16,1,0.3,1) both",
        "spin-slow": "spin-slow 90s linear infinite",
        "spin-slower": "spin-slow 160s linear infinite",
        drift: "drift 9s ease-in-out infinite",
        shimmer: "shimmer 6s linear infinite",
        twinkle: "twinkle 3.2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
