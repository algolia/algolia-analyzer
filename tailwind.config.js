const satellite = require('@algolia/satellite/cjs/styles/tailwind.config.js');

/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [satellite],
  content: ['./src/**/*.html', './src/**/*.ts', './src/**/*.tsx'],
  theme: {
    extends: {},
  },
  plugins: [],
};
