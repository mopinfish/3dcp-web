// .eslintrc.js
module.exports = {
  root: true,
  extends: [
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react'],
  rules: {
    'react/display-name': 'off',
    'react/no-unknown-property': 'off',
    'react-hooks/exhaustive-deps': 'warn', // または 'off'
    '@next/next/no-img-element': 'off',
  },
}
