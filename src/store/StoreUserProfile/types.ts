export type TUserAvatar = {
  size: 's' | 'xl' | 'l' | 'm'
  url: string
}

export interface IUserProfile {
  onlineId: string
  aboutMe: string
  avatars: TUserAvatar[]
  languages: string[]
  isPlus: boolean
  isOfficiallyVerified: boolean
  isMe: boolean
}

interface IUserTrophySummary {
  accountId: string
  trophyLevel: number
  progress: number
  tier: number
  earnedTrophies: {
    bronze: number
    silver: number
    gold: number
    platinum: number
  }
}

export interface IUser {
  profile: IUserProfile
  trophySummary: IUserTrophySummary
}
