module.exports = {
  extends: [`next`, `next/core-web-vitals`],
  parser: `@typescript-eslint/parser`,
  plugins: [`@typescript-eslint`],
  rules: {
    '@next/next/no-img-element': 0,
    '@typescript-eslint/no-shadow': `error`,
    '@typescript-eslint/no-unused-vars': [`warn`, { argsIgnorePattern: `^_`, varsIgnorePattern: `^_` }],
    '@typescript-eslint/quotes': [`error`, `backtick`],
    'id-length': [`error`, { min: 2, properties: `never`, exceptions: [`_`] }],
    'no-shadow': `off`,
    'react-hooks/exhaustive-deps': `off`,
    'react/jsx-curly-brace-presence': [2, { props: `always`, children: `never` }],
    curly: [`error`, `all`],
  },
}
