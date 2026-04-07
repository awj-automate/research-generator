import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#EFF8F5",
          100: "#D1EDDF",
          200: "#A3DBC0",
          300: "#6FC89E",
          400: "#44B47F",
          500: "#2D9D6F",
          600: "#237A57",
          700: "#1A5C41",
        },
        surface: {
          50: "#F8FAFC",
          100: "#F1F5F9",
          200: "#E2E8F0",
          300: "#CBD5E1",
        },
        ink: {
          400: "#94A3B8",
          600: "#475569",
          700: "#334155",
          800: "#1E293B",
          900: "#0F172A",
        },
      },
      fontFamily: {
        sans: ["var(--font-manrope)", "system-ui", "sans-serif"],
        mono: ["SF Mono", "Consolas", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
