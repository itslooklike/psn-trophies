import Cookies from 'cookies'
import type { NextApiRequest, NextApiResponse } from 'next'

import { serverFetch } from 'src/server/serverFetch'
import { NAME_ACCOUNT_ID, psnApi } from 'src/utils/constants'

type TQuery = {
  id: string
}

type TTrophyGroups = {
  trophyGroups: {
    trophyGroupId: string
    trophyGroupName: string
    trophyGroupDetail: string
  }[]
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query as TQuery
  const cookies = new Cookies(req, res)
  const account_id = cookies.get(NAME_ACCOUNT_ID)

  if (false) {
    try {
      const { data } = await serverFetch.get<TTrophyGroups>(
        `${psnApi}/trophy/v1/npCommunicationIds/${id}/trophyGroups?npServiceName=trophy`
      )

      const groups = data.trophyGroups.map(({ trophyGroupId }) => trophyGroupId)

      console.log(`groups >>`, groups)
    } catch (error) {
      console.log(`error >>`, error)
    }
  }

  const userTrophies = await serverFetch(
    `${psnApi}/trophy/v1/users/${account_id}/npCommunicationIds/${id}/trophyGroups/all/trophies?npServiceName=trophy`
  )

  const globalTrophies = await serverFetch(
    `${psnApi}/trophy/v1/npCommunicationIds/${id}/trophyGroups/all/trophies?npServiceName=trophy`
  )

  const globalTrophiesData = (await globalTrophies).data
  const userTrophiesData = (await userTrophies).data

  const trophies = {
    ...globalTrophiesData,
    ...userTrophiesData,
    // @ts-ignore
    trophies: globalTrophiesData.trophies.map((item, idx) => Object.assign({}, item, userTrophiesData.trophies[idx])),
  }

  res.status(200).json(trophies)
}
