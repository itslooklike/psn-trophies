import type { IPaginationResponse } from '../common'

type TPlatform = 'PS4' | 'PS3,PS4'

interface IDefinedTrophies {
  bronze: number
  silver: number
  gold: number
  platinum: number
}

interface ICompareUser {
  onlineId: string
  progress: number
  earnedTrophies: IDefinedTrophies
  lastUpdateDate: string
}

export interface IGame {
  npCommunicationId: string
  trophyTitleName: string
  trophyTitleDetail: string
  trophyTitleIconUrl: string
  trophyTitleSmallIconUrl: string
  trophyTitlePlatfrom: TPlatform
  hasTrophyGroups: boolean
  definedTrophies: IDefinedTrophies
  comparedUser: ICompareUser
}

export interface IUserTrophies extends IPaginationResponse<IGame> {}
