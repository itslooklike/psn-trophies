const withPWA = require(`next-pwa`)
const runtimeCaching = require(`next-pwa/cache`)

module.exports = withPWA({
  pwa: {
    dest: `public`,
    disable: process.env.NODE_ENV === `development`,
    runtimeCaching,
    // fallbacks: {
    //   image: `/static/fallback.jpg`,
    // },
  },
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: `/api/psn/avatar/:path*`,
        destination: `http://static-resource.np.community.playstation.net/:path*`,
      },
    ]
  },
})
