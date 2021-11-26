import { createClient } from 'redis'

// const redisUrl = process.env.REDISTOGO_URL || ''
const redisUrl =
  process.env.NODE_ENV === `production`
    ? `redis://redistogo:***REMOVED***@soapfish.redistogo.com:11809/`
    : ``

console.log(`👾 redisUrl: `, redisUrl)

const client = createClient({
  legacyMode: true,
  url: redisUrl,
})

client.connect()

export const redisGet = client.v4.get
export const redisSet = client.v4.set
export const redisExp = client.v4.expire
export const redisTtl = client.v4.ttl
