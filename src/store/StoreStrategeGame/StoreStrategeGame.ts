import { makeAutoObservable, runInAction } from 'mobx'
import { clientFetch } from 'src/utils'
import type { TStrategeGame } from './types'

import type { TScrapListResponse } from 'src/pages/api/scrap-list'

class StrategeGameItem {
  loading = false
  error = false
  data: null | TStrategeGame[] = null

  constructor() {
    makeAutoObservable(this)
  }
}

interface IStrategeGameTrophiesStore {
  [_: string]: StrategeGameItem
}

type TFetchOptions = { withError?: boolean } & ({ name: string } | { slug: string })

export class StoreStrategeGame {
  loadingList = false

  error = false

  data: IStrategeGameTrophiesStore = {}

  constructor() {
    makeAutoObservable(this)
  }

  async fetchList(name: string, page?: string | number) {
    this.loadingList = true

    let url = `/scrap-list?name=${name}`

    if (page) {
      url += `&page=${page}`
    }

    try {
      const { data } = await clientFetch.get<TScrapListResponse>(url)

      runInAction(() => {
        this.loadingList = false
      })

      return data
    } catch (error) {
      runInAction(() => {
        this.loadingList = false
      })

      throw error
    }
  }

  async fetch(id: string, options?: TFetchOptions) {
    if (!this.data[id]) {
      this.data[id] = new StrategeGameItem()
    }

    this.data[id].loading = true

    try {
      let url = `/scrap?id=${id}`

      if (options && `name` in options) {
        url += `&name=${options.name}`
      }

      if (options && `slug` in options) {
        url += `&slug=${options.slug}`
      }

      const { data } = await clientFetch.get<TStrategeGame[]>(url)

      runInAction(() => {
        this.data[id].data = data
        this.data[id].loading = false
        this.data[id].error = false
      })
    } catch (error) {
      runInAction(() => {
        this.data[id].loading = false
        this.data[id].error = true
      })

      if (options && options.withError) {
        throw error
      }
    }
  }
}
