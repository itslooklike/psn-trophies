import Cookies from 'cookies'
import type { NextApiRequest, NextApiResponse } from 'next'

import { serverFetch } from 'src/server/serverFetch'
import { NAME_ACCOUNT_ID, psnApi } from 'src/utils/config'
import { fmtAva } from 'src/utils/fmt'
import type { TUserAvatar } from 'src/store/StoreUserProfile'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const cookies = new Cookies(req, res)

  const id = cookies.get(NAME_ACCOUNT_ID)

  try {
    let { data } = await serverFetch({
      url: `${psnApi}/userProfile/v1/internal/users/${id}/profiles`,
    })

    data = {
      ...data,
      avatars: data.avatars.map((avatar: TUserAvatar) => ({ ...avatar, url: fmtAva(avatar.url) })),
    }

    const trophySummary = await serverFetch({ url: `${psnApi}/trophy/v1/users/${id}/trophySummary` })

    const user = {
      profile: data,
      trophySummary: trophySummary.data,
    }

    res.status(200).json(user)
  } catch (error: any) {
    if (error.response.status === 400) {
      return res.status(400).json(error.response.data)
    }

    throw new Error(error)
  }
}
