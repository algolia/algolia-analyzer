const path = require('path');

module.exports = {
  root: true,
  extends: ['plugin:@algolia/satellite/recommended', 'prettier'],
  plugins: ['@algolia/satellite', '@typescript-eslint', 'prettier'],
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
        ignoreRestSiblings: true,
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
