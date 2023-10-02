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
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['./tsconfig.json'],
    tsconfigRootDir: __dirname,
  },
  rules: {
    '@typescript-eslint/indent': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      },
    ],
    '@typescript-eslint/naming-convention': [
      'error',
      {
        format: ['PascalCase'],
        selector: 'interface',
      },
    ],
    '@typescript-eslint/switch-exhaustiveness-check': 'error',
    'default-case': 'off',
    'no-console': ['error', { allow: ['info'] }],
    'prettier/prettier': ['error', {}, { usePrettierrc: true }],
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
