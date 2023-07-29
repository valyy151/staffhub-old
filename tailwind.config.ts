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
    },
  },
  plugins: [],
} satisfies Config;
