import type { NextApiRequest, NextApiResponse } from 'next'

import { serverFetch } from 'src/server/serverFetch'
import { psnApi } from 'src/utils/constants'
import type { TTrophyGroups } from 'src/types'

type TQuery = {
  id: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query as TQuery

  const { data } = await serverFetch.get<TTrophyGroups>(
    `${psnApi}/trophy/v1/npCommunicationIds/${id}/trophyGroups?npServiceName=trophy`
  )

  res.status(200).json(data)
}
