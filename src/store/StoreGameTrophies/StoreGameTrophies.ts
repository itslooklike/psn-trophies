import { makeAutoObservable, runInAction } from 'mobx'
import { clientFetch } from 'src/utils/clientFetch'
import type { TUserTrophiesResult } from 'src/types'

type TGroupsFilters = {
  hideDlc?: boolean
}

export type TTrophiesFilters = {
  hideOwned?: boolean
  showOwned?: boolean
  sorting?: `-rate` | `+rate`
}

class GameTrophy {
  constructor(public data: TUserTrophiesResult) {
    makeAutoObservable(this)
  }

  get title() {
    return this.data.trophyTitleName
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

  trophyGroups(filters: TGroupsFilters = {}) {
    let result = this.data.trophyGroups

    if (filters.hideDlc) {
      result = result.filter((trophyGroup) => trophyGroup.trophyGroupId === `default`)
    }

    return result
  }

  trophyGroupsById(id: string, filters: TTrophiesFilters = {}) {
    let result = this.data.trophies.filter((trophy) => trophy.trophyGroupId === id)

    if (filters.hideOwned) {
      result = result.filter((trophy) => !trophy.earned)
    }

    if (filters.showOwned) {
      result = result.filter((trophy) => trophy.earned)
    }

    if (filters.sorting) {
      result = result.sort((varA, varB) => {
        if (filters.sorting === `-rate`) {
          let result = +varA.trophyEarnedRate - +varB.trophyEarnedRate

          if (result === 0) {
            result =
              varB.trophyType === `platinum`
                ? 1
                : varB.trophyType === `gold`
                ? 1
                : varB.trophyType === `silver`
                ? 1
                : result
          }

          return result
        }

        let result = +varB.trophyEarnedRate - +varA.trophyEarnedRate

        if (result === 0) {
          result =
            varB.trophyType === `platinum`
              ? -1
              : varB.trophyType === `gold`
              ? -1
              : varB.trophyType === `silver`
              ? -1
              : result
        }

        return result
      })
    }

    return result
  }
}

export class StoreGameTrophies {
  loading = false

  data: Partial<{ [_: string]: GameTrophy }> = {}

  constructor(initialData?: Partial<StoreGameTrophies>) {
    makeAutoObservable(this)

    runInAction(() => {
      if (initialData?.data) {
        this.data = initialData.data
      }
    })
  }

  hydrate() {
    return {
      data: this.data,
    }
  }

  async fetch(id: string, options: { platform?: 'PS5' | 'PS4' } = {}) {
    this.loading = true

    let url = `/psn/game/${id}`

    if (options.platform === `PS5`) {
      url += `?platform=PS5`
    }

    const { data } = await clientFetch.get<TUserTrophiesResult>(url)

    runInAction(() => {
      this.data[id] = new GameTrophy(data)
      this.loading = false
    })
  }
}
