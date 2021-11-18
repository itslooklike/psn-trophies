import type { IPaginationResponse, IDefinedTrophies } from '../common'

type TPlatform = 'PS4' | 'PS3,PS4'

export interface IUserGame {
  npCommunicationId: string
  trophyTitleName: string
  trophyTitleDetail: string
  trophyTitleIconUrl: string
  trophyTitleSmallIconUrl: string
  trophyTitlePlatfrom: TPlatform
  hasTrophyGroups: boolean
  definedTrophies: IDefinedTrophies
  progress: number
  earnedTrophies: IDefinedTrophies
  hiddenFlag: boolean
  lastUpdatedDateTime: string
  trophyTitlePlatform: string
}

export interface IUserTrophies extends IPaginationResponse<IUserGame> {}
