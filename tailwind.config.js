/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#B08D3C", // champagne gold, deep enough for white text on buttons
          light: "#E6C98B", // light champagne, for decorative use
        },
      },
    },
  },
  plugins: ["@tailwindcss/forms"],
};
