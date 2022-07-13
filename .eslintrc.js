module.exports = {
  extends: [`next`, `next/core-web-vitals`],
  parser: `@typescript-eslint/parser`,
  plugins: [`@typescript-eslint`],
  rules: {
    curly: [`error`, `all`],
    'id-length': [`error`, { min: 2, properties: `never`, exceptions: [`_`] }],
    'react/jsx-curly-brace-presence': [2, { props: `always`, children: `never` }],
    '@typescript-eslint/quotes': [`error`, `backtick`],
    '@typescript-eslint/no-unused-vars': [`warn`, { argsIgnorePattern: `^_`, varsIgnorePattern: `^_` }],
    '@next/next/no-img-element': 0,
    'no-shadow': `off`,
    '@typescript-eslint/no-shadow': `error`,
  },
}
