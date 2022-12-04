import redis from 'redis-mock'
import { promisify } from 'util'

const client = redis.createClient()

export const redisGet = promisify(client.get).bind(client)
export const redisSet = promisify(client.set).bind(client)
export const redisExp = promisify(client.expire).bind(client)
export const redisTtl = promisify(client.ttl).bind(client)

const TOKEN_NAME = `token`
export const tokenGet = () => redisGet(TOKEN_NAME)
export const tokenSet = (token: string) => redisSet(TOKEN_NAME, token)

const prefix = process.env.CONFIG_BUILD_ID ? `[${process.env.CONFIG_BUILD_ID}]` : ``
const SECONDS = 60 * 10
export const saveData = async (url: string, data: string) => {
  const key = prefix + url
  await redisSet(key, data)
  await redisExp(key, SECONDS)
  console.log(`>> save to cache`, key)
}

export const loadData = (url: string) => redisGet(prefix + url)
