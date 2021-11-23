import axios, { AxiosRequestConfig } from 'axios'

import { redisGet, redisTtl, redisSet, redisExp } from 'src/server/redis'
import { apiBaseUrl } from 'src/utils/config'

const CACHE_HEADER_NAME = `X_FROM_CACHE`
const AUTH_HEADER_NAME = `Authorization`

export const serverFetch = axios.create({
  headers: {
    'User-Agent': `PlayStation/21090100 CFNetwork/1126 Darwin/19.5.0`,
    'Accept-Language': `ru-RU`,
    'Content-Type': `application/x-www-form-urlencoded`,
  },
})

const refreshToken = () => axios.get(`${apiBaseUrl}/psn/refresh`)

const getUrlFromConfig = (config: AxiosRequestConfig) => {
  let str = ``

  for (const key in config.params) {
    if (str != ``) {
      str += `&`
    }
    str += key + `=` + encodeURIComponent(config.params[key])
  }

  // FIXME: если указать урл без `baseURL` но с параметрами - то будет плохо
  const href = config.baseURL || config.url

  const url = href + (config.url ? `` : str)

  return url
}

serverFetch.interceptors.request.use(async (config) => {
  const url = getUrlFromConfig(config)

  if (url && !(config.headers![`XXX-CACHE-CONTROL`] === `no-cache`)) {
    const data = await redisGet(url)

    if (data) {
      const ttl = await redisTtl(url)

      config.adapter = function (config) {
        return new Promise((resolve) => {
          const res = {
            data: JSON.parse(data),
            status: 200,
            statusText: `OK`,
            headers: {},
            config,
            request: {},
          }

          res.config.headers![CACHE_HEADER_NAME] = ttl.toString()

          console.log(`🧵 from cache: `, url)

          return resolve(res)
        })
      }

      return config
    }
  }

  const token = await redisGet(`token`)
  // console.log('token from interceptor', token)
  config.headers![AUTH_HEADER_NAME] = `Bearer ${token}`

  return config
})

serverFetch.interceptors.response.use(
  async (response) => {
    const url = getUrlFromConfig(response.config)

    if (url && !response.config.headers![CACHE_HEADER_NAME]) {
      await redisSet(url, JSON.stringify(response.data))
      await redisExp(url, 60 * 60)
      console.log(`⚠️  save to cache`, url)
    }

    return response
  },
  async (error) => {
    if (error.response.status === 401 || error.response.status === 403) {
      if (error.config.__retry) {
        console.log(`😡 ОШИБКА при обновлении токена (нужен новый NPSSO?)`)
      } else {
        console.log(`👀 обновляем токен`)
        error.config.__retry = true
        await refreshToken()
        const token = await redisGet(`token`)
        error.config.headers[AUTH_HEADER_NAME] = `Bearer ${token}`
        return serverFetch.request(error.config)
      }
    }

    return Promise.reject(error)
  }
)
