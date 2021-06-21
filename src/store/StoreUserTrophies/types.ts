import type { IPaginationResponse, IDefinedTrophies } from '../common'

type TPlatform = 'PS4' | 'PS3,PS4'

interface ICompareUser {
  onlineId: string
  progress: number
  earnedTrophies: IDefinedTrophies
  lastUpdateDate: string
}

export interface IUserGame {
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

export interface IUserTrophies extends IPaginationResponse<IUserGame> {}
