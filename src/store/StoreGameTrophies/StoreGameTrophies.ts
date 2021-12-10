import { makeAutoObservable, runInAction } from 'mobx'
import { clientFetch } from 'src/utils/clientFetch'
import type { TUserTrophiesResult } from 'src/types'

class GameTrophy {
  constructor(public data: TUserTrophiesResult) {
    makeAutoObservable(this)
  }

  get total() {
    return this.data.trophies.length
  }

  get completed() {
    return this.data.trophies.filter((trophy) => trophy.earned).length
  }

  get withoutDLC() {
    return this.data.trophyGroups.filter((trophyGroup) => trophyGroup.trophyGroupId === `default`)
  }

  get dlcAmount() {
    return this.data.trophies.filter((trophy) => trophy.trophyGroupId !== `default`).length
  }

  trophyGroups(filters: { hideDlc?: boolean } = {}) {
    let result = this.data.trophyGroups

    if (filters.hideDlc) {
      result = result.filter((trophyGroup) => trophyGroup.trophyGroupId === `default`)
    }

    return result
  }

  trophyGroupsById(id: string) {
    return this.data.trophies.filter((trophy) => trophy.trophyGroupId === id)
  }
}

export class StoreGameTrophies {
  loading = false

  data: Partial<{ [_: string]: GameTrophy }> = {}

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
      this.data[id] = new GameTrophy(data)
      this.loading = false
    })
  }
}
