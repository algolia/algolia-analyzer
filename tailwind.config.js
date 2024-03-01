const sourceSatellite = require('@algolia/satellite/tailwind.config.js');

const { prefix, ...satellite } = sourceSatellite;

/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [satellite],
  content: ['./node_modules/@algolia/satellite/**/*.js', './src/**/*.{html,ts,tsx}'],
  theme: {
    ...satellite.theme,
    extends: {},
  },
  plugins: [],
};
