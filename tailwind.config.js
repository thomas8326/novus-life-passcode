/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        primary: "#e9ddd1",
        highLight: "#d4b0a5",
        highLightHover: "#d5a495",
        background: "#f0ede5",
      },
    },
  },
  plugins: [],
};
