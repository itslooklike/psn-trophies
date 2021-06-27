import axios from 'axios'
import redis from 'redis'
import { promisify } from 'util'
import { apiBaseUrl } from 'src/utils/config'

const client = redis.createClient()
const redisGet = promisify(client.get).bind(client)
const redisSet = promisify(client.set).bind(client)
const redisExp = promisify(client.expire).bind(client)
const redisTtl = promisify(client.ttl).bind(client)

const CACHE_HEADER_NAME = 'X_FROM_CACHE'
const AUTH_HEADER_NAME = 'Authorization'

export const serverFetch = axios.create({ headers: { 'Accept-Language': 'ru-RU,ru;' } })

const refreshToken = () => axios.get(`${apiBaseUrl}/refresh`)

serverFetch.interceptors.request.use(async (config) => {
  let str = ''

  for (var key in config.params) {
    if (str != '') {
      str += '&'
    }
    str += key + '=' + encodeURIComponent(config.params[key])
  }

  if (config.baseURL) {
    const data = await redisGet(config.baseURL + str)

    if (data) {
      const ttl = await redisTtl(config.baseURL + str)

      config.adapter = function (config) {
        return new Promise((resolve) => {
          const res = {
            data: JSON.parse(data),
            status: 200,
            statusText: 'OK',
            headers: {},
            config,
            request: {},
          }

          res.config.headers[CACHE_HEADER_NAME] = ttl

          console.log('🧵 from cache')
          return resolve(res)
        })
      }

      return config
    }
  }

  const token = await redisGet('token')
  console.log('token from interceptor', token)
  config.headers[AUTH_HEADER_NAME] = `Bearer ${token}`

  return config
})

serverFetch.interceptors.response.use(
  async (response) => {
    const { baseURL, headers } = response.config

    let str = ''

    for (var key in response.config.params) {
      if (str != '') {
        str += '&'
      }
      str += key + '=' + encodeURIComponent(response.config.params[key])
    }

    if (baseURL && !headers[CACHE_HEADER_NAME]) {
      await redisSet(baseURL + str, JSON.stringify(response.data))
      await redisExp(baseURL + str, 60 * 60)
      console.log('⚠️  save to cache', baseURL + str)
    }

    return response
  },
  async (error) => {
    if (error.response.status === 401) {
      if (error.config.__retry) {
        console.log('😡 ОШИБКА при рефреше токена (нужен новый NPSSO?)')
      } else {
        console.log('🤖 обновляем токен')
        error.config.__retry = true

        await refreshToken()
        const token = await redisGet('token')
        error.config.headers[AUTH_HEADER_NAME] = `Bearer ${token}`
        return serverFetch.request(error.config)
      }
    }

    return Promise.reject(error)
  }
)
