/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        primary: "#50a9d0",
        secondary: "#FFEBCD",
        highLight: "#c52727",
        highLightHover: "#b30f0f",
        background: "#f9f9f9",
      },
    },
  },
  plugins: [],
};
