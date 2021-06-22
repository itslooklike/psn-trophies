import { serverFetch } from 'src/server/serverFetch'

import type { NextApiRequest, NextApiResponse } from 'next'

const config = (id: string) => ({
  baseURL: `https://ru-tpy.np.community.playstation.net/trophy/v1/trophyTitles/${id}/trophyGroups/default/trophies`,
  params: {
    fields: '@default,trophyRare,trophyEarnedRate,trophySmallIconUrl',
    visibleType: 1,
    npLanguage: 'ru',
    comparedUser: 'trueKanta',
  },
})

type TQuery = {
  id: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query as TQuery
  const { data } = await serverFetch(config(id))
  res.status(200).json(data)
}
