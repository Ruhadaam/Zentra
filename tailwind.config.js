/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}","./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        dark: '#0B1215',
        'dark-gray': '#1A2528',
        'light-blue': '#A8DADC',
      },
      fontFamily: {
        oswald: ['Oswald-Light'],
        'oswald-extralight': ['Oswald-ExtraLight'],
        ancizar: ['Ancizar-Serif'],
      },
    },
  },
  plugins: [],
};
