import { makeAutoObservable, runInAction } from 'mobx'

import { clientFetch } from 'src/utils'
import type { TUserTrophyTitlePagination } from 'src/types'

export class StoreUserTrophies {
  loading: boolean = false

  data: TUserTrophyTitlePagination | null = null

  constructor(initialData: Partial<StoreUserTrophies>) {
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

  trophies(withoutCompleted?: boolean) {
    if (withoutCompleted) {
      return this.data?.trophyTitles.filter((trophy) => trophy.progress !== 100) || []
    }

    return this.data?.trophyTitles || []
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
