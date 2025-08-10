/** @type {import('tailwindcss').Config} */
const path = require('path');

module.exports = {
  darkMode: 'class',
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./hooks/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./libs/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  safelist: [
    'bg-theme-primary',
    'bg-theme-primary-dark',
    'bg-theme-primary/90', 
    'bg-theme-primary-light',
    'text-theme-primary',
    'text-theme-primary-dark',
    'text-theme-primary-light',
    'border-theme-primary',
    'ring-theme-primary'
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

