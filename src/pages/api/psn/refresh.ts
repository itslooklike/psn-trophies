import axios, { type AxiosError } from 'axios'
import url from 'url'
import type { NextApiRequest, NextApiResponse } from 'next'
import { tokenSet } from 'src/server/redis'
import { refreshToken, psnApi } from 'src/utils/config'
import { errorHandler } from 'src/utils/errorHandler'

// TODO: найти нужное место для этого (`next.config.js` - не подходит, нужно в рантайме, а не в процессе сборки)
if (!refreshToken) {
  throw new Error(`🍅 NO REFRESH_TOKEN passed! Check '.env.local'`)
}

const config = {
  headers: {
    Authorization: `Basic MDk1MTUxNTktNzIzNy00MzcwLTliNDAtMzgwNmU2N2MwODkxOnVjUGprYTV0bnRCMktxc1A=`,
    'User-Agent': `PlayStation/21090100 CFNetwork/1126 Darwin/19.5.0`,
    'Accept-Language': `en-US`,
    // 'Content-Type': `application/x-www-form-urlencoded`,
  },
}

const urlencoded = new url.URLSearchParams()
urlencoded.append(`refresh_token`, refreshToken)
urlencoded.append(`grant_type`, `refresh_token`)
urlencoded.append(`scope`, `psn:mobile.v2.core psn:clientapp`)
urlencoded.append(`token_format`, `jwt`)

// Request failed with status code 400
// error.response.data
// type TExpiredError = {
//   error: 'invalid_grant'
//   error_description: 'Invalid refresh token'
//   error_code: 4159
//   error_uri: 'https://auth.api.sonyentertainmentnetwork.com/openapi/docs'
// }

type TResponse = {
  access_token: string
  token_type: `bearer`
  expires_in: number
  scope: `psn:clientapp psn:mobile.v1`
  id_token: string
  refresh_token_expires_in: number
}

export default async function handler(_: NextApiRequest, res: NextApiResponse) {
  try {
    const { data } = await axios.post<TResponse>(`${psnApi}/authz/v3/oauth/token`, urlencoded.toString(), config)

    await tokenSet(data.access_token)

    res.status(200).send(`ok`)
  } catch (err) {
    const error = err as Error | AxiosError

    if (axios.isAxiosError(error)) {
      if (error.response?.data.error_description === `Invalid refresh token`) {
        // отправляют тут эту инфу, чтобы клиент редиректнул
        // Зачем? почему я не редирекчу с сервера?
        res.status(400).json({ message: `invalid_grant` })
        return
      }

      if (error.response?.status === 403) {
        // не получилось рефрешнуть токен??
        // TODO: кидать нотифаер?
      }
    }

    errorHandler(error, `/refresh error`)

    throw error
  }
}
