/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: "#111317",
        surface: "#1A1D24",
        card: "#242833",
        field: {
          primary: "#1A1C20",
          placeholder: "#A98A7D"
        },
        primary: {
          DEFAULT: "#FF6B00",
          hover: "#FF8A33",
        },
        secondary: "#FFD166",
        text: {
          primary: "#FFFFFF",
          body: "#E2E2E8",
          secondary: "#B8BDC7",
        },
        success: "#22C55E",
        warning: "#F59E0B",
        danger: "#EF4444",
      },
      fontFamily: {
        inter: ["Inter"]
      }
    }
  },
  plugins: []
}
