import { serverFetch } from 'src/server/serverFetch'
import type { NextApiRequest, NextApiResponse } from 'next'

const config = (offset: number = 0) => ({
  baseURL: 'https://ru-tpy.np.community.playstation.net/trophy/v1/trophyTitles',
  params: {
    fields: '@default,trophyTitleSmallIconUrl',
    platform: 'PS3,PS4,PSVITA',
    limit: 12,
    offset,
    comparedUser: 'trueKanta',
    npLanguage: 'ru',
  },
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { offset } = req.query
  const { data } = await serverFetch(config(offset ? +offset : undefined))

  res.status(200).json(data)
}
