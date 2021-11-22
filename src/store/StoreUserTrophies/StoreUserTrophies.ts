import { makeAutoObservable, runInAction } from 'mobx'
import { clientFetch } from 'src/utils'
import { IUserTrophies } from './types'

export class StoreUserTrophies {
  data: IUserTrophies | null = null

  loading: boolean = false

  constructor() {
    makeAutoObservable(this)
  }

  async fetch() {
    this.loading = true

    const { data } = await clientFetch.get<IUserTrophies>(`/psn/trophyTitles`)

    runInAction(() => {
      this.data = data
      this.loading = false
    })
  }

  async fetchMore() {
    this.loading = true

    if (this.data) {
      const url = `/psn/trophyTitles?offset=${this.data.nextOffset!}`

      const { data } = await clientFetch.get<IUserTrophies>(url)

      runInAction(() => {
        this.data!.nextOffset = data.nextOffset
        this.data!.trophyTitles = this.data!.trophyTitles.concat(data.trophyTitles)
        this.loading = false
      })
    } else {
      const { data } = await clientFetch.get<IUserTrophies>(`/psn/trophyTitles`)

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

  get canLoadMore() {
    if (this.data) {
      return this.data.nextOffset
    }
    return false
  }
}
