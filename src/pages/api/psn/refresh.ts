import axios from 'axios'
import querystring from 'querystring'

import { redisSet } from 'src/server/redis'
import type { NextApiRequest, NextApiResponse } from 'next'

let refreshToken = process.env.REFRESH_TOKEN

const config = {
  headers: {
    Authorization: `Basic YWM4ZDE2MWEtZDk2Ni00NzI4LWIwZWEtZmZlYzIyZjY5ZWRjOkRFaXhFcVhYQ2RYZHdqMHY=`,
    'User-Agent': `PlayStation/21090100 CFNetwork/1126 Darwin/19.5.0`,
    'Accept-Language': `en-US`,
    'Content-Type': `application/x-www-form-urlencoded`,
  },
}

const payload = {
  refresh_token: refreshToken,
  grant_type: 'refresh_token',
  scope: 'psn:mobile.v1 psn:clientapp',
  token_format: 'jwt',
}

type TResponse = {
  access_token: string
  token_type: 'bearer'
  expires_in: number
  scope: 'psn:clientapp psn:mobile.v1'
  id_token: string
  refresh_token_expires_in: number
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { data } = await axios.post<TResponse>(
      'https://m.np.playstation.net/api/authz/v3/oauth/token',
      querystring.stringify(payload),
      config
    )

    await redisSet('token', data.access_token)

    // console.log('new token: ', data.access_token)

    res.status(200).send('ok')
  } catch (error: any) {
    console.log('error', error)
    throw new Error(error)
  }
}
