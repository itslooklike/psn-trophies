type TTrophyType = 'platinum' | 'gold' | 'silver' | 'bronze'

export interface ICompareUserEarned {
  onlineId: string
  earned: true
  earnedDate: string
}

interface ICompareUser {
  onlineId: string
  earned: false
}

export interface IGame {
  trophyId: number
  trophyHidden: boolean
  trophyType: TTrophyType
  trophyName: string
  trophyDetail: string
  trophyIconUrl: string
  trophySmallIconUrl: string
  trophyRare: 0 | 1 | 2 | 3 // Крайне редкий | Очень редкий | Редкий | Обычный
  trophyEarnedRate: string
  comparedUser: ICompareUser | ICompareUserEarned
}

export interface IGameTrophies {
  trophies: IGame[]
}
