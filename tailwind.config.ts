import { type Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "slate-750": "#293548",
        "slate-650": "#3D4B5F",
        "slate-250": "#D7DFE9",
        "slate-150": "#EAEFF5",
      },
      keyframes: {
        fade: {
          "0%": { opacity: "0", scale: "0.9" },
          "100%": { opacity: "1", scale: "1" },
        },
      },
      animation: {
        fade: "fade 0.2s ease-in-out",
      },
    },
  },
  plugins: [],
} satisfies Config;
