/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#d92654", // darker shade so white text stays readable
          light: "#f26a8d", // original theme pink, for decorative use
        },
      },
    },
  },
  plugins: ["@tailwindcss/forms"],
};
