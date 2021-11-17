import { makeAutoObservable, runInAction } from 'mobx'
import { clientFetch } from 'src/utils'
import { IUser } from './types'

export class StoreUserProfile {
  data: IUser | null = null

  constructor() {
    makeAutoObservable(this)
  }

  async fetch() {
    const { data } = await clientFetch.get<IUser>(`/psn/profile`)

    runInAction(() => {
      this.data = data
    })
  }
}
