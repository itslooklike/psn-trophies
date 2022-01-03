const withPWA = require(`next-pwa`)
const runtimeCaching = require(`next-pwa/cache`)

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const myCache = {
  urlPattern: ({ url }) => {
    if (url.pathname.startsWith(`/api/psn/trophyTitles`)) return true
    if (url.pathname.startsWith(`/api/psn/profile`)) return true
    if (url.pathname.startsWith(`/api/psn/game`)) return true
    if (url.pathname.startsWith(`/api/scrap`)) return true
    return false
  },
  // handler: `CacheFirst`,
  handler: `StaleWhileRevalidate`,
  options: {
    cacheName: `my-app-psn-apis`,
    expiration: {
      maxEntries: 10,
      maxAgeSeconds: 2 * 24 * 60 * 60, // 2 days
    },
  },
}

const config = [
  myCache, // что-то с ним бажит
  ...runtimeCaching,
]

module.exports = withPWA({
  pwa: {
    dest: `public`,
    // disable: process.env.NODE_ENV === `development`,
    runtimeCaching: config,

    register: false,
    skipWaiting: false,
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
