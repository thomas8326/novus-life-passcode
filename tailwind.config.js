/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        primary: "#bab7a3",
        secondary: "#f0e7d8",
        highLight: "#e6c364",
        highLightHover: "#b30f0f",
        background: "#fcfbf0",
      },
    },
  },
  plugins: [],
};
