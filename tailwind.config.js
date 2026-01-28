/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'imboni-black': '#0b1320',
        'imboni-accent': '#3f7cff',
      },
      fontFamily: {
        'display': ['"MoonStarsKai"', '"PingFang SC"', 'sans-serif'],
        'serif': ['"MoonStarsKai"', '"PingFang SC"', 'serif'],
      }
    },
  },
  plugins: [],
}
