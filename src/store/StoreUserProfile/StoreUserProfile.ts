import axios from 'axios'
import { makeAutoObservable, runInAction } from 'mobx'
import { IUserProfile } from './types'
// import { mock1 } from './mocks'

export class StoreUserProfile {
  data: IUserProfile | null = null

  constructor() {
    makeAutoObservable(this)
  }

  async fetch() {
    const { data } = await axios.get<IUserProfile>(`/api/psn?type=profile`)

    runInAction(() => {
      this.data = data
    })
  }
}
