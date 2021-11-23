import { makeAutoObservable, runInAction } from 'mobx'
import { clientFetch } from 'src/utils'
import { GameTrophies } from './types'

export interface ISortOptions {
  sort?: `-rate` | `+rate` | `default`
  filter?: `hideOwned` | `showOwned` | `default`
}

class StoreGameItem {
  constructor(public data: GameTrophies) {
    makeAutoObservable(this)
  }

  sort(options: ISortOptions = {}) {
    const { sort, filter } = options

    let result = this.data.trophies

    if (filter === `hideOwned`) {
      // @ts-ignore
      result = result.filter((trophy) => !trophy.earned)
    } else if (filter === `showOwned`) {
      // @ts-ignore
      result = result
        // @ts-ignore
        .filter((trophy) => trophy.earned)
        .sort((varA, varB) => {
          // @ts-ignore
          const timeA = new Date(varA.earnedDateTime).getTime()
          // @ts-ignore
          const timeB = new Date(varB.earnedDateTime).getTime()

          return timeB - timeA
        })
    }

    if (sort === `-rate`) {
      result = [...result].sort((varA, varB) => +varA.trophyEarnedRate - +varB.trophyEarnedRate)
    } else if (sort === `+rate`) {
      result = [...result].sort((varA, varB) => +varB.trophyEarnedRate - +varA.trophyEarnedRate)
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

  constructor(initialData?: Partial<StoreGame>) {
    makeAutoObservable(this)

    if (initialData?.data) {
      this.data = initialData.data
    }
  }

  hydrate() {
    return {
      data: this.data,
    }
  }

  async fetch(id: string) {
    const { data } = await clientFetch.get<GameTrophies>(`/psn/game/${id}`)

    runInAction(() => {
      this.data[id] = new StoreGameItem(data)
    })
  }
}
