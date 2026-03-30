import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: "#061427",
          800: "#0a1f3d",
          700: "#112d54",
          600: "#1a3d6b",
        },
        brand: {
          50: "#eaf7ed",
          100: "#d5f0db",
          200: "#bfe8c9",
          300: "#7dd694",
          400: "#40ba5e",
          500: "#2bb24c",
          600: "#228e3d",
          700: "#1a6e2f",
        },
        surface: {
          50: "#fafafa",
          100: "#f7f7f7",
          200: "#e6e6e6",
          300: "#d4d4d4",
        },
        ink: {
          400: "#9ca3af",
          600: "#4b5563",
          700: "#374151",
          800: "#1f2937",
          900: "#121212",
        },
      },
      fontFamily: {
        display: ["var(--font-merriweather)", "Georgia", "serif"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["SF Mono", "Consolas", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
