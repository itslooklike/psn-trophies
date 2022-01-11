import redis from 'redis'
import { promisify } from 'util'

const isProd = process.env.NODE_ENV === `production`

// const redisUrl = process.env.REDISTOGO_URL || ``
// const redisUrl = `redis://***REMOVED***@soapfish.redistogo.com:11809/`
const redisUrl = isProd ? `redis://***REMOVED***@soapfish.redistogo.com:11809/` : ``

// console.log(`👾 redisUrl: `, redisUrl)

const client = redis.createClient(redisUrl)

export const redisGet = promisify(client.get).bind(client)
export const redisSet = promisify(client.set).bind(client)
export const redisExp = promisify(client.expire).bind(client)
export const redisTtl = promisify(client.ttl).bind(client)

const TOKEN_NAME = `token`
export const tokenGet = () => redisGet(TOKEN_NAME)
export const tokenSet = (token: string) => redisSet(TOKEN_NAME, token)

const prefix = process.env.VERCEL_GIT_COMMIT_SHA ? `[${process.env.VERCEL_GIT_COMMIT_SHA}]` : ``
const SECONDS = 60 * 10
export const saveData = async (url: string, data: string) => {
  const key = prefix + url
  await redisSet(key, data)
  await redisExp(key, SECONDS)
  console.log(`>> save to cache`, key)
}

export const loadData = (url: string) => redisGet(prefix + url)
