module.exports = {
  extends: [`next`, `next/core-web-vitals`],
  rules: {
    quotes: [`error`, `backtick`],
    'id-length': [`error`, { min: 2, properties: `never`, exceptions: [`_`] }],
    'react/jsx-curly-brace-presence': [2, { props: `always`, children: `never` }],
    '@next/next/no-img-element': 0,
  },
}
