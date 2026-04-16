/** @type {import('tailwindcss').Config} */
const { fontFamily } = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontFamily: {
        sans: ["var(--font-noto)", ...fontFamily.sans],
        lexend: ["'Lexend'", ...fontFamily.sans],
        // sans: ["var(--font-Inter)", ...fontFamily.sans],
      },
      boxShadow: {
        box: "0 0px 5px 0px rgba(0, 0, 0, 0.3)",
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-out",
        "slide-up": "slideUp 0.4s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        slideUp: {
          "0%": { opacity: 0, transform: "translateY(10px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
    },
    screens: {
      sm: { min: "0px", max: "480px" },
      md: { min: "481px", max: "768px" },
      "2md": { min: "769px", max: "820px" },
      lg: { min: "821px", max: "976px" },
      "2lg": { min: "977px", max: "1140px" },
      xl: { min: "1141px", max: "1190px" },
      "2xl": { min: "1191px", max: "1400px" },
      "3xl": { max: "1401px" },
      tsm: { min: "0px", max: "820px" },
      tmd: { min: "821px", max: "1140px" },
      tlg: { min: "1141px", max: "1300px" },
    },
    colors: {
      primary: {
        DEFAULT: "#342df2",
        v10: "#E6FFF4",
        v9: "#CDF0E1",
        success: "#16D86D",
        shadow: "#ccded6",
        hover: "#446C59",
        primaryPurple: "#322996",
      },
      secondary: {
        DEFAULT: "#313349",
        v10: "#E4E6F6",
        gray: "#868686",
      },
      heading: {
        DEFAULT: "#13151F",
        yellow: "#FFF2B8",
      },
      error: {
        DEFAULT: "#E7515A",
        shadow: "#f0d5d7",
        delete: "#FFEBEE",
        darkdelete: "#FF0000",
        border: "#FF6060",
      },
      success: {
        DEFAULT: "blue",
        shadow: "blue",
      },
      dark: {
        400: "#646567",
        500: "A5A6A8",
        600: "#B8B8B8",
        700: "#D8D8D8",
        800: "#EDEDED",
        950: "#F9F9F9",
      },
      header: {
        background: "#FFFF",
        text: "",
      },
      sidebar: {
        background: "#FFFF",
        text: "#000000",
      },
      main: {
        background: "#F4F7FE",
      },
      icon: {
        DEFAULT: "#962929",
        background: "#962929",
        border: "#962929",
      },
      label: {
        placeholder: "#a2a2a2",
      },

      white: "#FFFFFF",
      "txt-primary": "#646567",
      "txt-secondary": "#B2B3B5",
      ...colors,
    },
  },
  plugins: [],
};
