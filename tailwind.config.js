/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        glass: "rgba(255, 255, 255, 0.1)",
      },
      colors: {
        primary: {
          DEFAULT: "#D7686D",
          light: "#8f0910",
        },
      },
    },
  },
  plugins: [],
};
