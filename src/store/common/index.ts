export interface IPaginationResponse<T> {
  totalResults: number
  offset: number
  limit: number
  trophyTitles: T[]
}
