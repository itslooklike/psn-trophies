export interface IPaginationResponse<T> {
  totalItemCount: number
  nextOffset?: number
  previousOffset?: number
  trophyTitles: T[]
}

export interface IDefinedTrophies {
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
