module.exports = {
  root: true,
  env: {
    es2021: true,
    jest: true,
  },
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react', 'react-hooks', 'jest'],
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:jest/recommended',
    'prettier',
  ],
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    'react/react-in-jsx-scope': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
  },
  overrides: [
    {
      files: ['*.config.js', 'babel.config.js', '.eslintrc.cjs'],
      env: {
        node: true,
      },
    },
  ],
  ignorePatterns: ['node_modules/', 'coverage/', 'dist/'],
};
