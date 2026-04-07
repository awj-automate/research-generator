import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ds: {
          bg: "#E4E4E7",
          surface: "#F4F4F5",
          card: "#FFFFFF",
          border: "rgba(0,0,0,0.15)",
          primary: "#4D8BFE",
          "primary-light": "#7EB0FF",
          "primary-dark": "#3366FF",
          heading: "#09090B",
          text: "#3F3F46",
          muted: "#71717A",
          subtle: "#A1A1AA",
        },
      },
      fontFamily: {
        sans: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
        mono: ["SF Mono", "Consolas", "monospace"],
      },
      borderRadius: {
        card: "24px",
        button: "100px",
      },
    },
  },
  plugins: [],
};

export default config;
