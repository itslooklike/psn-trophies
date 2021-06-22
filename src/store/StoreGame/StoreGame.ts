import axios from 'axios'
import { makeAutoObservable, runInAction } from 'mobx'
import { IGameTrophies } from './types'

interface IGameTrophiesStore {
  [_: string]: IGameTrophies
}

export interface ISortOptions {
  sort?: '-rate' | '+rate' | 'default'
  filterHidden?: boolean
}

export class StoreGame {
  data: IGameTrophiesStore = {}

  constructor() {
    makeAutoObservable(this)
  }

  async fetch(id: string) {
    const { data } = await axios.get<IGameTrophies>(`/api/psn?id=${id}&type=game`)

    runInAction(() => {
      this.data[id] = data
    })
  }

  sort(id: string, options: ISortOptions = {}) {
    const { sort, filterHidden } = options

    let result = this.data[id]?.trophies

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
