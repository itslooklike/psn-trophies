import { makeAutoObservable, runInAction } from 'mobx'
import { fetcher, delay } from '../../utils'
import { IUserTrophies } from './types'
import { mock1 } from './mocks'

export class StoreUserTrophies {
  data: IUserTrophies | null = null

  constructor() {
    makeAutoObservable(this)
  }

  async fetch() {
    const { data } = await fetcher.get<IUserTrophies>(``, {
      params: {
        fields: '@default,trophyTitleSmallIconUrl',
        platform: 'PS3,PS4,PSVITA',
        limit: 12,
        offset: 0,
        comparedUser: 'trueKanta',
        npLanguage: 'ru',
      },
    })

    // await delay()
    // const data = mock1

    runInAction(() => {
      this.data = data
    })
  }
}
