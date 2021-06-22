import axios from 'axios'
import redis from 'redis'
import { promisify } from 'util'

import type { NextApiRequest, NextApiResponse } from 'next'

const client = redis.createClient()
const redisGet = promisify(client.get).bind(client)

client.on('error', function (error) {
  console.log('💔 Redis Error')
  console.error(error)
})

let canRefresh = true

export const fetcher = axios.create({
  headers: { 'Accept-Language': 'ru-RU,ru;' },
})

const refreshToken = () => axios.get('http://localhost:3000/api/hello')

fetcher.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401 && canRefresh) {
      canRefresh = false

      return refreshToken().then(() => {
        return redisGet('token').then((token) => {
          error.config.headers['Authorization'] = `Bearer ${token}`
          return fetcher.request(error.config)
        })
      })
    }

    return Promise.reject(error)
  }
)

const urls = (id?: string) => ({
  profile: {
    baseURL: 'https://ru-prof.np.community.playstation.net/userProfile/v1/users/trueKanta/profile2',
    params: {
      fields:
        'onlineId,aboutMe,consoleAvailability,languagesUsed,avatarUrls,personalDetail,personalDetail(@default,profilePictureUrls),primaryOnlineStatus,trophySummary(level,progress,earnedTrophies),plus,isOfficiallyVerified,friendRelation,personalDetailSharing,presences(@default,platform),npId,blocking,following,currentOnlineId,displayableOldOnlineId,mutualFriendsCount,followerCount',
      profilePictureSizes: 's,m,l',
      avatarSizes: 's,m,l',
    },
  },
  trophyTitles: {
    baseURL: 'https://ru-tpy.np.community.playstation.net/trophy/v1/trophyTitles',
    params: {
      fields: '@default,trophyTitleSmallIconUrl',
      platform: 'PS3,PS4,PSVITA',
      limit: 12,
      offset: 0,
      comparedUser: 'trueKanta',
      npLanguage: 'ru',
    },
  },
  game: {
    baseURL: `https://ru-tpy.np.community.playstation.net/trophy/v1/trophyTitles/${id}/trophyGroups/default/trophies`,
    params: {
      fields: '@default,trophyRare,trophyEarnedRate,trophySmallIconUrl',
      visibleType: 1,
      npLanguage: 'ru',
      comparedUser: 'trueKanta',
    },
  },
})

type TQuery = {
  type: 'profile' | 'trophyTitles' | 'game'
  id: string | undefined
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { type, id } = req.query as TQuery
  const config = urls(id)[type]

  const token = await redisGet('token')

  const { data } = await fetcher({ ...config, headers: { Authorization: `Bearer ${token}` } })

  res.status(200).json(data)
}
