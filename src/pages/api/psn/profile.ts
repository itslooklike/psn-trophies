import Cookies from 'cookies'
import type { NextApiRequest, NextApiResponse } from 'next'

import { serverFetch } from 'src/server/serverFetch'
import { NAME_ACCOUNT_ID, psnApi } from 'src/utils/constants'
import type { TUserAvatar } from 'src/store/StoreUserProfile'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const cookies = new Cookies(req, res)

  const id = cookies.get(NAME_ACCOUNT_ID)

  let { data } = await serverFetch({
    baseURL: `${psnApi}/userProfile/v1/internal/users/${id}/profiles`,
  })

  data = {
    ...data,
    avatars: data.avatars.map((avatar: TUserAvatar) => ({
      ...avatar,
      url: avatar.url.replace(`http://static-resource.np.community.playstation.net`, `/api/psn/avatar`),
    })),
  }

  const trophySummary = await serverFetch({ baseURL: `${psnApi}/trophy/v1/users/${id}/trophySummary` })

  const user = {
    profile: data,
    trophySummary: trophySummary.data,
  }

  res.status(200).json(user)
}
