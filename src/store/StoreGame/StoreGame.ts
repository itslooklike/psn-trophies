import { makeAutoObservable, runInAction } from 'mobx'
import { clientFetch } from 'src/utils'
import { GameTrophies } from './types'

export interface ISortOptions {
  sort?: '-rate' | '+rate' | 'default'
  filter?: 'hideOwned' | 'showOwned' | 'default'
}

class StoreGameItem {
  data: GameTrophies

  constructor(data: GameTrophies) {
    this.data = data
    makeAutoObservable(this)
  }

  sort(options: ISortOptions = {}) {
    const { sort, filter } = options

    let result = this.data.trophies

    if (filter === 'hideOwned') {
      // @ts-ignore
      result = result.filter((trophy) => !trophy.earned)
    } else if (filter === 'showOwned') {
      // @ts-ignore
      result = result
        // @ts-ignore
        .filter((trophy) => trophy.earned)
        .sort((a, b) => {
          // @ts-ignore
          const timeA = new Date(a.earnedDateTime).getTime()
          // @ts-ignore
          const timeB = new Date(b.earnedDateTime).getTime()

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

  get total() {
    return this.data.trophies.length
  }

  get completed() {
    // @ts-ignore
    return this.data.trophies.filter((trophy) => trophy.earned).length
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
    const { data } = await clientFetch.get<GameTrophies>(`/psn/game/${id}`)

    runInAction(() => {
      this.data[id] = new StoreGameItem(data)
    })
  }
}
