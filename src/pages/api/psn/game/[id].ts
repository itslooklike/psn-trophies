import Cookies from 'cookies'
import type { NextApiRequest, NextApiResponse } from 'next'

import { serverFetch } from 'src/server/serverFetch'
import { NAME_ACCOUNT_ID, psnApi } from 'src/utils/constants'
import type {
  TUserTrophiesResponse,
  TGlobalTrophiesResponse,
  TUserTrophiesResult,
  TTrophyGroups,
} from 'src/types'

type TQuery = {
  id: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query as TQuery
  const cookies = new Cookies(req, res)
  const account_id = cookies.get(NAME_ACCOUNT_ID)

  const globalTrophies = await serverFetch.get<TGlobalTrophiesResponse>(
    `${psnApi}/trophy/v1/npCommunicationIds/${id}/trophyGroups/all/trophies?npServiceName=trophy`
  )

  const userTrophies = await serverFetch.get<TUserTrophiesResponse>(
    `${psnApi}/trophy/v1/users/${account_id}/npCommunicationIds/${id}/trophyGroups/all/trophies?npServiceName=trophy`
  )

  const trophyGroups = await serverFetch.get<TTrophyGroups>(
    `${psnApi}/trophy/v1/npCommunicationIds/${id}/trophyGroups?npServiceName=trophy`
  )

  const globalTrophiesData = globalTrophies.data
  const userTrophiesData = userTrophies.data
  const trophyGroupsData = trophyGroups.data

  const trophies: TUserTrophiesResult = {
    ...userTrophiesData,
    ...trophyGroupsData,
    trophies: userTrophiesData.trophies.map((userTrophy, idx) => {
      const { trophyName, trophyDetail, trophyIconUrl, trophyGroupId } = globalTrophiesData.trophies[idx]

      return {
        ...userTrophy,
        trophyName,
        trophyDetail,
        trophyIconUrl,
        trophyGroupId,
      }
    }),
  }

  res.status(200).json(trophies)
}
