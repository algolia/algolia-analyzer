const sourceSatellite = require('@algolia/satellite/cjs/styles/tailwind.config.js');

const { prefix, ...satellite } = sourceSatellite;

/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [satellite],
  content: ['./src/**/*.html', './src/**/*.ts', './src/**/*.tsx'],
  theme: {
    ...satellite.theme,
    extends: {},
  },
  plugins: [],
};
