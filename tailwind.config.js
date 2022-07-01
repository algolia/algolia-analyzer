const satellite = require('@algolia/satellite/cjs/styles/tailwind.config');

module.exports = {
  content: ['./src/**/*.html', './src/**/*.ts', './src/**/*.tsx'],
  theme: {
    ...satellite.theme,
    extends: {
      transitionProperty: {
        width: 'width',
      },
    },
  },
  plugins: [],
};
