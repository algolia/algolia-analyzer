const path = require('path');

module.exports = {
  root: true,
  extends: ['react-app', 'algolia', 'algolia/react', 'algolia/typescript', 'prettier'],
  plugins: ['@algolia/satellite', 'prettier'],
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
      typescript: {},
    },
    satellite: {
      tailwindConfigPath: path.resolve(__dirname, './tailwind.config.js'),
    },
    react: {
      version: 'detect',
    },
  },
  rules: {
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      },
    ],
    'no-console': ['error', { allow: ['info'] }],
    'prettier/prettier': ['error', { printWidth: 100, singleQuote: true, endOfLine: 'auto' }],
    'react/react-in-jsx-scope': 'off',
  },
  overrides: [
    {
      files: ['*.js'],
      rules: {
        'import/no-commonjs': 'off',
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
  ],
};
