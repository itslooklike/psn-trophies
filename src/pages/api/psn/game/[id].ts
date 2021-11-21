import Cookies from 'cookies'
import type { NextApiRequest, NextApiResponse } from 'next'

import { serverFetch } from 'src/server/serverFetch'
import { NAME_ACCOUNT_ID, psnApi } from 'src/utils/constants'

type TQuery = {
  id: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query as TQuery
  const cookies = new Cookies(req, res)
  const account_id = cookies.get(NAME_ACCOUNT_ID)

  const userTrophies = await serverFetch(
    `${psnApi}/trophy/v1/users/${account_id}/npCommunicationIds/${id}/trophyGroups/default/trophies?npServiceName=trophy`
  )
  const globalTrophies = await serverFetch(
    `${psnApi}/trophy/v1/npCommunicationIds/${id}/trophyGroups/default/trophies?npServiceName=trophy`
  )

  const globalTrophiesData = (await globalTrophies).data
  const userTrophiesData = (await userTrophies).data

  const trophies = {
    ...globalTrophiesData,
    ...userTrophiesData,
    // @ts-ignore
    trophies: globalTrophiesData.trophies.map((item, i) => Object.assign({}, item, userTrophiesData.trophies[i])),
  }

  res.status(200).json(trophies)
}
