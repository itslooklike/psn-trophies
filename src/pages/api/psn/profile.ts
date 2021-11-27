import Cookies from 'cookies'
import type { NextApiRequest, NextApiResponse } from 'next'

import { serverFetch } from 'src/server/serverFetch'
import { NAME_ACCOUNT_ID, psnApi } from 'src/utils/constants'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const cookies = new Cookies(req, res)

  const id = cookies.get(NAME_ACCOUNT_ID)

  const profile = await serverFetch({ baseURL: `${psnApi}/userProfile/v1/internal/users/${id}/profiles` })

  const trophySummary = await serverFetch({ baseURL: `${psnApi}/trophy/v1/users/${id}/trophySummary` })

  const user = {
    profile: profile.data,
    trophySummary: trophySummary.data,
  }

  res.status(200).json(user)
}
