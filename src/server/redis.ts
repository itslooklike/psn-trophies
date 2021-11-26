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
