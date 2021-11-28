import { makeAutoObservable, runInAction } from 'mobx'
import { clientFetch } from 'src/utils'
import type { TUserTrophiesResult } from 'src/types'

export interface ISortOptions {
  sort?: `-rate` | `+rate` | `default`
  filter?: `hideOwned` | `showOwned` | `default`
}

class StoreGameItem {
  constructor(public data: TUserTrophiesResult) {
    makeAutoObservable(this)
  }

  sort(options: ISortOptions = {}) {
    const { sort, filter } = options

    let result = this.data.trophies

    if (filter === `hideOwned`) {
      result = result.filter((trophy) => !trophy.earned)
    } else if (filter === `showOwned`) {
      result = result
        .filter((trophy) => trophy.earned)
        .sort((varA, varB) => {
          const timeA = new Date(varA.earnedDateTime!).getTime()
          const timeB = new Date(varB.earnedDateTime!).getTime()
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
    return this.data.trophies.filter((trophy) => trophy.earned).length
  }
}

export class StoreGameTrophies {
  loading = false
  data: Partial<{ [_: string]: StoreGameItem }> = {}

  constructor(initialData?: Partial<StoreGameTrophies>) {
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
    this.loading = true
    const { data } = await clientFetch.get<TUserTrophiesResult>(`/psn/game/${id}`)

    runInAction(() => {
      this.data[id] = new StoreGameItem(data)
      this.loading = false
    })
  }
}
