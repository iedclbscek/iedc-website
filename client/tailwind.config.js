/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#F5F5DC",
          light: "#FAFAED",
          dark: "#E5E5CC",
        },
        accent: {
          DEFAULT: "#FF6B6B",
          light: "#FF8A8A",
          dark: "#E55A5A",
        },
        background: {
          DEFAULT: "#FAFAFA",
          alt: "#F0F0F0",
        },
        "text-dark": "#2E2E2E",
        "text-light": "#6E6E6E",
        cta: {
          DEFAULT: "#A8D5BA",
          light: "#BADECC",
          dark: "#8BC0A0",
          hover: "#98C5AA",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "slide-up": "slideUp 0.8s ease-out forwards",
        "pulse-slow": "pulse 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
