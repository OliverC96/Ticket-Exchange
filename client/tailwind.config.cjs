/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        blue: {
          xlight: "#E0F4FF",
          light: "#669bbc",
          med: "#004367",
          dark: "#003049",
          xdark: "#002438",
          xxdark: "#001B29"
        },
        cream: "#fdf0d5",
        red: {
          light: "#c1121f",
          dark: "#c1121f"
        },
        grey: "#3E485B"
      },
      fontFamily: {
        title: ["Comfortaa", "sans-serif"]
      }
    }
  },
  plugins: [require("@tailwindcss/forms")],
};
