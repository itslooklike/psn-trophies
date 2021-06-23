import { makeAutoObservable, runInAction } from 'mobx'
import { clientFetch } from 'src/utils'
import { IGameTrophies } from './types'

export interface ISortOptions {
  sort?: '-rate' | '+rate' | 'default'
  filterHidden?: boolean
}

class StoreGameItem {
  data: IGameTrophies

  constructor(data: IGameTrophies) {
    this.data = data
    makeAutoObservable(this)
  }

  sort(options: ISortOptions = {}) {
    const { sort, filterHidden } = options

    let result = this.data.trophies

    if (filterHidden) {
      result = result.filter((trophy) => !trophy.comparedUser.earned)
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
