import { makeAutoObservable, runInAction } from 'mobx'
import { clientFetch } from 'src/utils'
import { IUserTrophies } from './types'

export class StoreUserTrophies {
  data: IUserTrophies | null = null

  constructor() {
    makeAutoObservable(this)
  }

  async fetch() {
    const { data } = await clientFetch.get<IUserTrophies>(`/psn/trophyTitles`)

    runInAction(() => {
      this.data = data
    })
  }

  async fetchMore() {
    if (this.data) {
      const { data } = await clientFetch.get<IUserTrophies>(
        `/psn/trophyTitles?offset=${this.data.offset + 12}`
      )

      runInAction(() => {
        this.data!.offset = data.offset
        this.data!.trophyTitles = this.data!.trophyTitles.concat(data.trophyTitles)
      })
    } else {
      const { data } = await clientFetch.get<IUserTrophies>(`/psn/trophyTitles`)

      runInAction(() => {
        this.data = data
      })
    }
  }

  get canLoadMore() {
    if (this.data) {
      return this.data.limit + this.data.offset <= this.data.totalResults
    }
    return false
  }
}
