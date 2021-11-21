import axios from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'
import { redisSet, redisExp } from 'src/server/redis'

const refreshToken = '***REMOVED***'

const config = {
  headers: {
    Authorization: `Basic YWM4ZDE2MWEtZDk2Ni00NzI4LWIwZWEtZmZlYzIyZjY5ZWRjOkRFaXhFcVhYQ2RYZHdqMHY=`,
    'User-Agent': `PlayStation/21090100 CFNetwork/1126 Darwin/19.5.0`,
    'Accept-Language': `en-US`,
    'Content-Type': `application/x-www-form-urlencoded`,
  },
}

const params = new URLSearchParams()
params.append('refresh_token', refreshToken)
params.append('grant_type', 'refresh_token')
params.append('scope', 'psn:mobile.v1 psn:clientapp')
params.append('token_format', 'jwt')

type TResponse = {
  access_token: string
  token_type: 'bearer'
  expires_in: number
  scope: 'psn:clientapp psn:mobile.v1'
  id_token: string
  refresh_token_expires_in: number
}

export default async function handler(_: NextApiRequest, res: NextApiResponse) {
  try {
    const { data } = await axios.post<TResponse>(
      'https://m.np.playstation.net/api/authz/v3/oauth/token',
      params,
      config
    )

    await redisSet('token', data.access_token)
    await redisExp('token', 60 * 60)

    res.status(200).send('ok')
  } catch (error: any) {
    console.log('error', error)
    throw new Error(error)
  }
}
