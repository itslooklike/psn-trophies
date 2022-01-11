import { makeAutoObservable, runInAction } from 'mobx'
import { clientFetch } from 'src/utils/clientFetch'
import type { TScrapListResponse } from 'src/pages/api/scrap-list'
import type { TUserTrophyWithAdd, TStrategeGameTips } from 'src/types'

class StrategeGameItem {
  loading = false
  error = false
  data: null | TStrategeGameTips = null

  constructor() {
    makeAutoObservable(this)
  }

  matchedTips(trophy: TUserTrophyWithAdd) {
    return (
      this.data?.items.find(({ description, titleRu, titleEng }) => {
        // INFO: у stratege переведены не все тайтлы, нужно сравнивать как eng `так` и `ru`
        const compareByName = titleRu === trophy.trophyName || titleEng === trophy.trophyName

        // INFO: у stratege все дескрипшены с точкой на конце
        const compareByDescription = description === trophy.trophyDetail + `.`

        return compareByName || compareByDescription
      })?.tips || []
    )
  }
}

type TFetchOptions = { withError?: boolean } & ({ name: string } | { slug: string })

export class StoreStrategeTips {
  loadingList = false

  error = false

  data: Partial<{ [_: string]: StrategeGameItem }> = {}

  constructor(initialData: Partial<StoreStrategeTips>) {
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

  async fetchList(name: string, page?: string | number) {
    runInAction(() => {
      this.loadingList = true
    })

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
    runInAction(() => {
      if (!this.data[id]) {
        this.data[id] = new StrategeGameItem()
      }

      this.data[id]!.loading = true
    })

    try {
      let url = `/scrap?id=${id}`

      if (options && `name` in options) {
        url += `&name=${options.name}`
      }

      if (options && `slug` in options) {
        url += `&slug=${options.slug}`
      }

      const { data } = await clientFetch.get<TStrategeGameTips>(url)

      runInAction(() => {
        this.data[id]!.data = data
        this.data[id]!.loading = false
        this.data[id]!.error = false
      })
    } catch (error) {
      runInAction(() => {
        this.data[id]!.loading = false
        this.data[id]!.error = true
      })

      if (options && options.withError) {
        throw error
      }
    }
  }

  tips(id: string, trophy: TUserTrophyWithAdd) {
    const result = this.data[id]?.matchedTips(trophy) || []
    return result
  }
}
