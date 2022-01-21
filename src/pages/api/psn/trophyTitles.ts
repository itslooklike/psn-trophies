import Cookies from 'cookies'
import type { NextApiRequest, NextApiResponse } from 'next'

import { serverFetch } from 'src/server/serverFetch'
import { NAME_ACCOUNT_ID, psnApi } from 'src/utils/config'
import type { TUserTrophyTitlePagination } from 'src/types'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const cookies = new Cookies(req, res)

  const id = cookies.get(NAME_ACCOUNT_ID)

  const config = (offset: number = 0) => ({
    baseURL: `${psnApi}/trophy/v1/users/${id}/trophyTitles`,
    params: { limit: 12, offset },
  })

  const { offset } = req.query

  const { data } = (await serverFetch(config(offset ? +offset : undefined))) as {
    data: TUserTrophyTitlePagination
  }

  res.status(200).json(data)
}
