/** @type {import('tailwindcss').Config} */
const path = require('path');

module.exports = {
  darkMode: 'class',
  content: {
    files: [
      './app/**/*.{js,ts,jsx,tsx,mdx}',
      './pages/**/*.{js,ts,jsx,tsx,mdx}',
      './components/**/*.{js,ts,jsx,tsx,mdx}',
      './hooks/**/*.{js,ts,jsx,tsx,mdx}',
      './lib/**/*.{js,ts,jsx,tsx,mdx}',
      './libs/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    options: {
      safelist: [
        'bg-theme-primary',
        'bg-theme-primary-dark',
        'bg-theme-primary/90',
        'bg-theme-primary-light',
        'text-theme-primary',
        'text-theme-primary-dark',
        'text-theme-primary-light',
        'border-theme-primary',
        'ring-theme-primary',
      ],
      // Prevent Tailwind from scanning outside project directory
      defaultExtractor: (content) => {
        // Only extract from content, don't scan filesystem
        const matches = content.match(/[^<>"'`\s]*[^<>"'`\s:]/g) || [];
        return matches;
      },
    },
  },
  theme: {
    extend: {},
  },
  plugins: [],
};
