import axios from 'axios'
import redis from 'redis'
import { promisify } from 'util'
import { apiBaseUrl } from 'src/utils/config'

const client = redis.createClient()
const redisGet = promisify(client.get).bind(client)

let canRefresh = true

export const serverFetch = axios.create({
  headers: { 'Accept-Language': 'ru-RU,ru;' },
})

const refreshToken = () => axios.get(`${apiBaseUrl}/hello`)

serverFetch.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401 && canRefresh) {
      canRefresh = false

      return refreshToken().then(() => {
        return redisGet('token').then((token) => {
          error.config.headers['Authorization'] = `Bearer ${token}`
          return serverFetch.request(error.config)
        })
      })
    }

    return Promise.reject(error)
  }
)
