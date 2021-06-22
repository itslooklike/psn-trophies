import { makeAutoObservable, runInAction } from 'mobx'
import { clientFetch } from '../../utils'
import { IUserTrophies } from './types'

export class StoreUserTrophies {
  data: IUserTrophies | null = null

  constructor() {
    makeAutoObservable(this)
  }

  async fetch() {
    const { data } = await clientFetch.get<IUserTrophies>(`/psn?type=trophyTitles`)

    runInAction(() => {
      this.data = data
    })
  }
}
