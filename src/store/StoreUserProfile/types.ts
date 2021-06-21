import type { IDefinedTrophies } from '../common'

interface IAvatar {
  size: 's' | 'm' | 'l'
  avatarUrl: string
}

interface ITrophySummary {
  level: number
  progress: number
  earnedTrophies: IDefinedTrophies
}

export interface IUserProfile {
  profile: {
    onlineId: string
    npId: string
    avatarUrls: IAvatar[]
    plus: 0 | 1
    aboutMe: string
    languagesUsed: ['ru', 'en']
    trophySummary: ITrophySummary
    isOfficiallyVerified: boolean
    personalDetailSharing: 'no'
    friendRelation: 'no'
    blocking: boolean
    mutualFriendsCount: number
    following: boolean
    followerCount: number
  }
}
