type TTrophyType = 'platinum' | 'gold' | 'silver' | 'bronze'

interface ICompareUser {
  onlineId: string
  earned: boolean
  earnedDate?: string
}

interface IGame {
  trophyId: number
  trophyHidden: boolean
  trophyType: TTrophyType
  trophyName: string
  trophyDetail: string
  trophyIconUrl: string
  trophySmallIconUrl: string
  trophyRare: 0 | 1 | 2 | 3 // Крайне редкий | Очень редкий | Редкий | Обычный
  trophyEarnedRate: string
  comparedUser: ICompareUser
}

export interface IGameTrophies {
  trophies: IGame[]
}
