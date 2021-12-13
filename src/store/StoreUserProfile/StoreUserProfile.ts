import { makeAutoObservable, runInAction } from 'mobx'
import { clientFetch } from 'src/utils/clientFetch'
import { IUser } from './types'

export class StoreUserProfile {
  data: IUser | null = null

  constructor(initialData: Partial<StoreUserProfile>) {
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
    try {
      const { data } = await clientFetch.get<IUser>(`/psn/profile`)

      runInAction(() => {
        this.data = data
      })
    } catch (error) {
      return Promise.reject(error)
    }
  }
}
