import { makeAutoObservable, runInAction } from 'mobx'
import { fetcher, delay } from '../../utils'
import { IGameTrophies } from './types'
import { mock1 } from './mocks'

interface IGameTrophiesStore {
  [_: string]: IGameTrophies
}

export interface ISortOptions {
  sort?: '-rate' | '+rate'
  filterHidden?: boolean
}

export class StoreGame {
  data: IGameTrophiesStore = {}

  constructor() {
    makeAutoObservable(this)
  }

  async fetch(id: string) {
    const { data } = await fetcher.get<IGameTrophies>(`/${id}/trophyGroups/default/trophies`, {
      params: {
        fields: '@default,trophyRare,trophyEarnedRate,trophySmallIconUrl',
        visibleType: 1,
        npLanguage: 'ru',
        comparedUser: 'trueKanta',
      },
    })

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
      result = result
        .map((trophy) => trophy)
        .sort((a, b) => +a.trophyEarnedRate - +b.trophyEarnedRate)
    } else if (sort === '+rate') {
      result = result
        .map((trophy) => trophy)
        .sort((a, b) => +b.trophyEarnedRate - +a.trophyEarnedRate)
    }

    return result
  }
}
