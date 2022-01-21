import Cookies from 'cookies'
import type { NextApiRequest, NextApiResponse } from 'next'

import { serverFetch } from 'src/server/serverFetch'
import { NAME_ACCOUNT_ID, psnApi } from 'src/utils/config'
import type {
  TUserTrophiesResponse,
  TGlobalTrophiesResponse,
  TUserTrophiesResult,
  TTrophyGroups,
} from 'src/types'

type TQuery = {
  id: string
  platform?: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id, platform } = req.query as TQuery
  const cookies = new Cookies(req, res)
  const account_id = cookies.get(NAME_ACCOUNT_ID)

  let url3 = `${psnApi}/trophy/v1/npCommunicationIds/${id}/trophyGroups`
  let url1 = `${psnApi}/trophy/v1/npCommunicationIds/${id}/trophyGroups/all/trophies`
  let url2 = `${psnApi}/trophy/v1/users/${account_id}/npCommunicationIds/${id}/trophyGroups/all/trophies`

  if (platform !== `PS5`) {
    url1 += `?npServiceName=trophy`
    url2 += `?npServiceName=trophy`
    url3 += `?npServiceName=trophy`
  }

  const [globalTrophies, userTrophies, trophyGroups] = await Promise.all([
    serverFetch.get<TGlobalTrophiesResponse>(url1),
    serverFetch.get<TUserTrophiesResponse>(url2),
    serverFetch.get<TTrophyGroups>(url3),
  ])

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
