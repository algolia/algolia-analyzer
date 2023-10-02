// eslint-disable-next-line import/extensions
const satellite = require('@algolia/satellite/cjs/styles/tailwind.config.js');

module.exports = {
  content: ['./src/**/*.html', './src/**/*.ts', './src/**/*.tsx'],
  theme: {
    ...satellite.theme,
    extends: {},
  },
  plugins: [],
};
