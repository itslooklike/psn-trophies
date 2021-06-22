import { serverFetch } from 'src/server/serverFetch'
import type { NextApiRequest, NextApiResponse } from 'next'

const config = {
  baseURL: 'https://ru-prof.np.community.playstation.net/userProfile/v1/users/trueKanta/profile2',
  params: {
    fields:
      'onlineId,aboutMe,consoleAvailability,languagesUsed,avatarUrls,personalDetail,personalDetail(@default,profilePictureUrls),primaryOnlineStatus,trophySummary(level,progress,earnedTrophies),plus,isOfficiallyVerified,friendRelation,personalDetailSharing,presences(@default,platform),npId,blocking,following,currentOnlineId,displayableOldOnlineId,mutualFriendsCount,followerCount',
    profilePictureSizes: 's,m,l',
    avatarSizes: 's,m,l',
  },
}

export default async function handler(_: NextApiRequest, res: NextApiResponse) {
  const { data } = await serverFetch(config)
  res.status(200).json(data)
}
