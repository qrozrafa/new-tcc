module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json'],
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint', 'prettier'],
  extends: ['eslint:recommended', 'next', 'plugin:@typescript-eslint/recommended', 'prettier', 'plugin:storybook/recommended', 'plugin:storybook/recommended'],
  ignorePatterns: ['.eslintrc.js', 'next.config.js'],
  rules: {
    'prettier/prettier': 'warn',
    '@next/next/no-img-element': 'off',
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off'
  }
};