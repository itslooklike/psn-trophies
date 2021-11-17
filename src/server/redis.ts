import redis from 'redis'
import { promisify } from 'util'

// const redisUrl = process.env.REDISTOGO_URL || ''
const redisUrl =
  process.env.NODE_ENV === 'production' ? 'redis://***REMOVED***@soapfish.redistogo.com:11809/' : ''

console.log('👾 redisUrl: ', redisUrl)

const client = redis.createClient(redisUrl)

export const redisGet = promisify(client.get).bind(client)
export const redisSet = promisify(client.set).bind(client)
export const redisExp = promisify(client.expire).bind(client)
export const redisTtl = promisify(client.ttl).bind(client)
