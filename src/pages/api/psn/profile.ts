import Cookies from 'cookies'
import type { NextApiRequest, NextApiResponse } from 'next'

import { serverFetch } from 'src/server/serverFetch'
import { NAME_ACCOUNT_ID, psnApi } from 'src/utils/constants'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const cookies = new Cookies(req, res)
  const id = cookies.get(NAME_ACCOUNT_ID)

  const profile = serverFetch({ baseURL: `${psnApi}/userProfile/v1/internal/users/${id}/profiles` })

  const trophySummary = serverFetch({ baseURL: `${psnApi}/trophy/v1/users/${id}/trophySummary` })

  const user = {
    profile: (await profile).data,
    trophySummary: (await trophySummary).data,
  }

  res.status(200).json(user)
}
