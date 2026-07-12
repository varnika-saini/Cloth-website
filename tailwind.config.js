/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./pages/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Rose gold (primary)
        blush: {
          50: "#faf1f0",
          100: "#f3dcdb",
          200: "#e8c0bd",
          300: "#dba29d",
          400: "#cc8881",
          500: "#b76e79",
          600: "#a05863",
          700: "#80444f",
          800: "#5e323b",
          900: "#3d2026",
        },
        // Lagoon — premium teal secondary accent (added alongside rose-gold)
        lagoon: {
          50: "#edfbf8",
          100: "#d2f4ec",
          200: "#a7e8db",
          300: "#71d6c5",
          400: "#3dbcac",
          500: "#1aa091",
          600: "#0f8073",
          700: "#10665d",
          800: "#12514b",
          900: "#13433e",
        },
        // Warm champagne / bronze (accent)
        lavender: {
          50: "#faf5ec",
          100: "#f2e6cc",
          200: "#e8d3a4",
          300: "#dcbf7c",
          400: "#cca956",
          500: "#b68f3b",
          600: "#8e6f2a",
          700: "#6b521d",
          800: "#4a3812",
          900: "#2d2208",
        },
        // Cream surfaces
        beige: {
          50: "#fbf7f2",
          100: "#f6efe5",
          200: "#ede2cf",
          300: "#e0d1b3",
          400: "#c7b189",
          500: "#a6905f",
        },
        // Warm charcoal text
        ink: {
          50: "#f5f2ef",
          100: "#e7e2dc",
          900: "#2d2a32",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-playfair)", "Georgia", "serif"],
      },
      boxShadow: {
        soft: "0 10px 30px -12px rgba(183, 110, 121, 0.20)",
        glow: "0 0 0 1px rgba(255,255,255,0.4), 0 20px 40px -20px rgba(183,110,121,0.35)",
        lagoon: "0 14px 40px -12px rgba(15, 128, 115, 0.35)",
      },
      backgroundImage: {
        "gradient-blush":
          "linear-gradient(135deg, #f3dcdb 0%, #f6efe5 50%, #f2e6cc 100%)",
        "gradient-hero":
          "radial-gradient(1200px 600px at 10% 10%, #f3dcdb 0%, transparent 60%), radial-gradient(900px 500px at 90% 20%, #f2e6cc 0%, transparent 60%), linear-gradient(180deg, #fbf7f2 0%, #fbf7f2 100%)",
        "gradient-lagoon":
          "linear-gradient(135deg, #1aa091 0%, #10665d 100%)",
        shimmer:
          "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.55) 50%, rgba(255,255,255,0) 100%)",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-700px 0" },
          "100%": { backgroundPosition: "700px 0" },
        },
        float: {
          "0%,100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        shimmer: "shimmer 1.6s linear infinite",
        float: "float 6s ease-in-out infinite",
        marquee: "marquee 25s linear infinite",
        "fade-up": "fadeUp 0.5s ease-out both",
        "fade-in": "fadeIn 0.4s ease-out both",
      },
    },
  },
  plugins: [],
};
