import { makeAutoObservable, runInAction } from 'mobx'
import { clientFetch } from 'src/utils'
import { IUserProfile } from './types'

export class StoreUserProfile {
  data: IUserProfile | null = null

  constructor() {
    makeAutoObservable(this)
  }

  async fetch() {
    const { data } = await clientFetch.get<IUserProfile>(`/psn/profile`)

    runInAction(() => {
      this.data = data
    })
  }
}
