import { serverFetch } from 'src/server/serverFetch'
import type { NextApiRequest, NextApiResponse } from 'next'

const config = {
  baseURL: 'https://ru-tpy.np.community.playstation.net/trophy/v1/trophyTitles',
  params: {
    fields: '@default,trophyTitleSmallIconUrl',
    platform: 'PS3,PS4,PSVITA',
    limit: 12,
    offset: 0,
    comparedUser: 'trueKanta',
    npLanguage: 'ru',
  },
}

export default async function handler(_: NextApiRequest, res: NextApiResponse) {
  const { data } = await serverFetch(config)

  res.status(200).json(data)
}
