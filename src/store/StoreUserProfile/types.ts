interface IUserProfile {
  onlineId: string
  aboutMe: string
  avatars: [
    {
      size: 's'
      url: string
    },
    {
      size: 'xl'
      url: string
    },
    {
      size: 'l'
      url: string
    },
    {
      size: 'm'
      url: string
    }
  ]
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
