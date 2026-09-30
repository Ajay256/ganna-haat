import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cane: {
          50: "#f3f9eb",
          100: "#e4f1d4",
          200: "#cce4af",
          300: "#add180",
          400: "#8ebc56",
          500: "#6d9f37", // Primary sugarcane green
          600: "#558029",
          700: "#426422",
          800: "#36511f",
          900: "#2f451d",
          950: "#17270c",
        },
        jaggery: {
          50: "#fdf8ee",
          100: "#faeed5",
          200: "#f4daa9",
          300: "#ecc074",
          400: "#e3a241",
          500: "#d28421", // Warm gur / jaggery gold
          600: "#b76719",
          700: "#924c18",
          800: "#783e1a",
          900: "#643419",
        },
      },
    },
  },
  plugins: [],
};

export default config;
