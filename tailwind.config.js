/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#588B76",
          light: "#588B76",
        },
        secondary: {
          DEFAULT: "#FFA001",
          light: "#FFA001",
          100: '#FF9001',
        },
        black: {
          DEFAULT: "#1E1E2D",
          100: "#1E1E2D",
          200: "#232533",

        }
      },
    },
  },
  plugins: [],
}

