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
