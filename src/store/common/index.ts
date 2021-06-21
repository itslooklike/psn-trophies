export interface IPaginationResponse<T> {
  totalResults: number
  offset: number
  limit: number
  trophyTitles: T[]
}

export interface IDefinedTrophies {
  bronze: number
  silver: number
  gold: number
  platinum: number
}
