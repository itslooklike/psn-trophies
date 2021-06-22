import axios from 'axios'
import { makeAutoObservable, runInAction } from 'mobx'
import { IUserTrophies } from './types'
// import { mock1 } from './mocks'

export class StoreUserTrophies {
  data: IUserTrophies | null = null

  constructor() {
    makeAutoObservable(this)
  }

  async fetch() {
    const { data } = await axios.get<IUserTrophies>(`/api/psn?type=trophyTitles`)

    runInAction(() => {
      this.data = data
    })
  }
}
