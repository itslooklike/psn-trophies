const withPWA = require(`next-pwa`)
const runtimeCaching = require(`next-pwa/cache`)

module.exports = withPWA({
  pwa: {
    dest: `public`,
    runtimeCaching,
    fallbacks: {
      image: `/static/fallback.jpg`,
    },
  },
  reactStrictMode: true,
})
