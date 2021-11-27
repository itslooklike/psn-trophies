import type { TTrophyType, TTrophyRare, TTrophyGroupId } from 'src/types'

type GameCommon = {
  trophyId: number
  trophyHidden: boolean
  trophyType: TTrophyType
}

type GameUser = GameCommon & {
  earned: boolean
  earnedDateTime?: string
  trophyRare: TTrophyRare
  trophyEarnedRate: string
}

export type GameGlobal = GameCommon & {
  trophyName: string
  trophyDetail: string
  trophyIconUrl: string
  trophyGroupId: TTrophyGroupId
}

type UserCommon = {
  trophySetVersion: string
  hasTrophyGroups: boolean
  totalItemCount: number
}

type UserTrophies = UserCommon & {
  lastUpdatedDateTime: string
  trophies: GameUser[]
  rarestTrophies: GameUser[]
}

type GlobalTrophies = UserCommon & {
  trophies: GameGlobal[]
}

export type TGameTrophies = GlobalTrophies & UserTrophies
