import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        beige: {
          50: "#FAF7F2",
          100: "#F5F0E8",
          200: "#EBE4D6",
          300: "#DDD4C1",
        },
        burnt: {
          400: "#D4915A",
          500: "#C4733B",
          600: "#A85D2E",
          700: "#8C4C25",
        },
        ink: {
          800: "#2E2A25",
          900: "#1C1917",
        },
      },
      fontFamily: {
        display: ["Griel", "Georgia", "serif"],
        body: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
