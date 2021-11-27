export type TTrophyType = `platinum` | `gold` | `silver` | `bronze`

export type TTrophyRare = 0 | 1 | 2 | 3 // Крайне редкий | Очень редкий | Редкий | Обычный

export type TTrophyGroupId = `default` | `001` | `002` | `003`

export type TPlatform = `PS4` | `PS3,PS4`

export interface IPaginationResponse<T> {
  totalItemCount: number
  nextOffset?: number
  previousOffset?: number
  trophyTitles: T[]
}

export type TDefinedTrophies = {
  bronze: number
  silver: number
  gold: number
  platinum: number
}

export type TTrophyGroup = {
  trophyGroupId: string
  trophyGroupName: string
  trophyGroupDetail: string
}

export type TTrophyGroups = {
  trophyTitleName: string
  trophyGroups: TTrophyGroup[]
}

export type TUserTrophyTitle = {
  npServiceName: 'trophy'
  npCommunicationId: string
  trophySetVersion: string
  trophyTitleName: string
  trophyTitleDetail: string
  trophyTitleIconUrl: string
  trophyTitlePlatform: 'PS4'
  hasTrophyGroups: boolean
  definedTrophies: TDefinedTrophies
  progress: number
  earnedTrophies: TDefinedTrophies
  hiddenFlag: boolean
  lastUpdatedDateTime: Date
}

export interface TUserTrophyTitlePagination extends IPaginationResponse<TUserTrophyTitle> {}
