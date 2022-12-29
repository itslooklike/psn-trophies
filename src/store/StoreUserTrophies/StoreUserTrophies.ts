import { makeAutoObservable, runInAction } from 'mobx'

import { clientFetch } from 'src/utils/clientFetch'
import type { TUserTrophyTitlePagination } from 'src/types'

type TFilters = {
  progress?: boolean
  platinumEarned?: boolean
  sortByProgress?: boolean
  platformFilter?: 'PS3' | 'PS4' | 'PS5'
}

export class StoreUserTrophies {
  loading: boolean = false

  data: TUserTrophyTitlePagination | null = null

  constructor(initialData: Partial<StoreUserTrophies>) {
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

  async fetch() {
    this.loading = true

    const { data } = await clientFetch.get<TUserTrophyTitlePagination>(`/psn/trophyTitles`)

    runInAction(() => {
      this.data = data
      this.loading = false
    })
  }

  async fetchMore() {
    this.loading = true

    if (this.data) {
      const url = `/psn/trophyTitles?offset=${this.data.nextOffset!}`

      const { data } = await clientFetch.get<TUserTrophyTitlePagination>(url)

      // FIXME: убрать "!"
      runInAction(() => {
        this.data!.nextOffset = data.nextOffset
        this.data!.trophyTitles = this.data!.trophyTitles.concat(data.trophyTitles)
        this.loading = false
      })
    } else {
      const { data } = await clientFetch.get<TUserTrophyTitlePagination>(`/psn/trophyTitles`)

      runInAction(() => {
        this.data = data
        this.loading = false
      })
    }
  }

  trophies({ progress, platinumEarned, sortByProgress, platformFilter }: TFilters) {
    let result = this.data?.trophyTitles || []

    if (progress) {
      result = result.filter((trophy) => trophy.progress !== 100)
    }

    if (platinumEarned) {
      result = result.filter(
        (trophy) => !(trophy.earnedTrophies.platinum > 0 && trophy.definedTrophies.platinum === trophy.earnedTrophies.platinum)
      )
    }

    if (sortByProgress) {
      result = result.sort((varA, varB) => varB.progress - varA.progress)
    }

    if (platformFilter) {
      result = result.filter((trophy) => trophy.trophyTitlePlatform.includes(platformFilter))
    }

    return result
  }

  findById(id: string) {
    return this.data?.trophyTitles.find(({ npCommunicationId }) => npCommunicationId === id)
  }

  get canLoadMore() {
    if (this.data) {
      return this.data.nextOffset
    }
    return false
  }
}
