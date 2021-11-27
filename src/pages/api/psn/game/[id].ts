import Cookies from 'cookies'
import type { NextApiRequest, NextApiResponse } from 'next'

import { serverFetch } from 'src/server/serverFetch'
import { NAME_ACCOUNT_ID, psnApi } from 'src/utils/constants'
import type { TTrophyType, TTrophyRare, TTrophyGroupId } from 'src/types'

type TQuery = {
  id: string
}

type TGlobalTrophiesResponse = {
  trophySetVersion: string
  hasTrophyGroups: boolean
  trophies: {
    trophyId: number
    trophyHidden: false
    trophyType: TTrophyType
    trophyName: string
    trophyDetail: string
    trophyIconUrl: string
    trophyGroupId: TTrophyGroupId
  }[]
  totalItemCount: number
}

type TUserTrophiesResponse = {
  trophySetVersion: string
  hasTrophyGroups: boolean
  lastUpdatedDateTime: Date
  trophies: {
    trophyId: number
    trophyHidden: boolean
    earned: boolean
    earnedDateTime?: Date
    trophyType: TTrophyType
    trophyRare: TTrophyRare
    trophyEarnedRate: string
  }[]
  rarestTrophies: {
    trophyId: number
    trophyHidden: boolean
    earned: boolean
    earnedDateTime: Date
    trophyType: TTrophyType
    trophyRare: TTrophyRare
    trophyEarnedRate: string
  }[]
  totalItemCount: number
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

  const globalTrophiesData = globalTrophies.data
  const userTrophiesData = userTrophies.data

  const trophies = {
    ...userTrophiesData,
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
