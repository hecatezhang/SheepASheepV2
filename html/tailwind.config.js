/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: [
      {
        nord: {
          primary: "#88c0d0",
          secondary: "#81a1c1",
          accent: "#8fbcbb",
          neutral: "#eceff4",
          "neutral-content": "#eceff4",
          "base-100": "#2e3440",
          info: "#5e81ac",
          success: "#a3be8c",
          warning: "#ebcb8b",
          error: "#bf616A",
        },
      },
    ],
  },
  plugins: [require("daisyui")],
};
