/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      height: {
        mobileHeader: "50px",
        desktopHeader: "100px",
        mobileFullScreen: "calc(100vh - 50px)",
        desktopFullScreen: "calc(100vh - 100px)",
      },
      padding: {
        mobileHeader: "50px",
        desktopHeader: "100px",
      },
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
