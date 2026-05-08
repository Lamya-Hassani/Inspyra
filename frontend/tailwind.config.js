/** @type {import('tailwindcss').Config} */
export default {
  content:["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#B0ADD0",
        surface: "#A48CEF",
        primary: "#274D00",
        secondary: "#6D58C7",
        accent: "#92B061",
        purple: {
          50: '#f5f4fd',
          100: '#ece9fb',
          200: '#d9d3f7',
          300: '#c6bdf3',
          400: '#A48CEF', // Light Purple
          500: '#6D58C7', // Deep Purple
          600: '#624fb3',
          700: '#524295',
          800: '#413577',
          900: '#352b61',
        },
        emerald: {
          50: '#f2f7ed',
          100: '#e5eeda',
          200: '#cbe1b5',
          300: '#b1d490',
          400: '#92B061', // Light Green
          500: '#274D00', // Dark Forest
          600: '#234500',
          700: '#1d3900',
          800: '#172e00',
          900: '#132500',
        },
        lime: {
          50: '#f7f7fa',
          100: '#eeeeef',
          200: '#dadbe5',
          300: '#c6c7db',
          400: '#B0ADD0', // Periwinkle
          500: '#92B061', // Light Green
          600: '#839e57',
          700: '#627641',
          800: '#414f2c',
          900: '#212816',
        },
        forest: "#274D00",
      },
      fontFamily: {
        sans:['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins:[],
}