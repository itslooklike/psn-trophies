import { makeAutoObservable, runInAction } from 'mobx'
import { clientFetch } from 'src/utils'
import { IGameTrophies, ICompareUserEarned } from './types'

export interface ISortOptions {
  sort?: '-rate' | '+rate' | 'default'
  filter?: 'hideOwned' | 'showOwned' | 'default'
}

class StoreGameItem {
  data: IGameTrophies

  constructor(data: IGameTrophies) {
    this.data = data
    makeAutoObservable(this)
  }

  sort(options: ISortOptions = {}) {
    const { sort, filter } = options

    let result = this.data.trophies

    if (filter === 'hideOwned') {
      result = result.filter((trophy) => !trophy.comparedUser.earned)
    } else if (filter === 'showOwned') {
      result = result
        .filter((trophy) => trophy.comparedUser.earned)
        .sort((a, b) => {
          const timeA = new Date((a.comparedUser as ICompareUserEarned).earnedDate).getTime()
          const timeB = new Date((b.comparedUser as ICompareUserEarned).earnedDate).getTime()

          return timeB - timeA
        })
    }

    if (sort === '-rate') {
      result = [...result].sort((a, b) => +a.trophyEarnedRate - +b.trophyEarnedRate)
    } else if (sort === '+rate') {
      result = [...result].sort((a, b) => +b.trophyEarnedRate - +a.trophyEarnedRate)
    }

    return result
  }
}

interface IGameTrophiesStore {
  [_: string]: StoreGameItem
}

export class StoreGame {
  data: IGameTrophiesStore = {}

  constructor() {
    makeAutoObservable(this)
  }

  async fetch(id: string) {
    const { data } = await clientFetch.get<IGameTrophies>(`/psn/game/${id}`)

    runInAction(() => {
      this.data[id] = new StoreGameItem(data)
    })
  }
}
