module.exports = {
  poweredByHeader: false,
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
}
