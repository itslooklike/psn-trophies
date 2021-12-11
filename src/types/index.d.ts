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

type TGlobalTrophyAdd = {
  trophyName: string
  trophyDetail: string
  trophyIconUrl: string
  trophyGroupId: TTrophyGroupId
}

export type TGlobalTrophy = {
  trophyId: number
  trophyHidden: false
  trophyType: TTrophyType
} & TGlobalTrophyAdd

export type TGlobalTrophiesResponse = {
  trophySetVersion: string
  hasTrophyGroups: boolean
  trophies: TGlobalTrophy[]
  totalItemCount: number
}

export type TUserTrophy = {
  trophyId: number
  trophyHidden: boolean
  earned: boolean
  earnedDateTime?: string
  trophyType: TTrophyType
  trophyRare: TTrophyRare
  trophyEarnedRate: string
}

export type TUserTrophiesResponse = {
  trophySetVersion: string
  hasTrophyGroups: boolean
  lastUpdatedDateTime: Date
  trophies: TUserTrophy[]
  rarestTrophies: TUserTrophy[]
  totalItemCount: number
}

export type TUserTrophyWithAdd = TUserTrophy & TGlobalTrophyAdd

export type TUserTrophiesResult = {
  trophySetVersion: string
  hasTrophyGroups: boolean
  lastUpdatedDateTime: Date
  trophies: TUserTrophyWithAdd[]
  rarestTrophies: TUserTrophy[]
  totalItemCount: number
} & TTrophyGroups

export type TTip = {
  text: string
  rating: string
}

export type TStrategeGame = {
  titleFull: string
  titleEng: string
  titleRu: string
  description: string
  tips: TTip[]
}

export type TStrategeMerge = {
  title: string
  altTitle: string
  url: string
  slug: string
  img: string
}
