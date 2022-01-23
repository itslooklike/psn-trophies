const withPWA = require(`next-pwa`)
const runtimeCaching = require(`next-pwa/cache`)

if (!process.env.REFRESH_TOKEN) {
  throw new Error(`🍅 NO REFRESH_TOKEN passed! Check '.env.local'`)
}

// FIXME: move to pure js
// import { httpPsnAvatarV1, httpPsnAvatarV2 } from 'src/utils/config'

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
  poweredByHeader: false,
  pwa: {
    dest: `public`,
    disable: process.env.NODE_ENV === `development`,
    runtimeCaching: config,

    register: false,
    skipWaiting: false,
  },
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: `/api/psn/avatar1/:path*`,
        destination: `http://static-resource.np.community.playstation.net/:path*`,
      },
      {
        source: `/api/psn/avatar2/:path*`,
        destination: `http://psn-rsc.prod.dl.playstation.net/psn-rsc/avatar/:path*`,
      },
    ]
  },
  webpack: (config, { webpack, buildId }) => {
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.CONFIG_BUILD_ID': JSON.stringify(buildId),
      })
    )
    return config
  },
})
