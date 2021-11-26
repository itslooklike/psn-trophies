import { makeAutoObservable, runInAction } from 'mobx'
import { clientFetch } from 'src/utils'
import { TTrophyGroups } from 'src/types'

class StoreSingleGameItem {
  constructor(public data: TTrophyGroups) {
    makeAutoObservable(this)
  }
}

export class StoreSingleGame {
  data: Partial<{ [key: string]: StoreSingleGameItem }> = {}
  loading = false

  constructor(initialData?: Partial<StoreSingleGame>) {
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

  async fetch(id: string) {
    runInAction(() => {
      this.loading = true
    })

    const { data } = await clientFetch.get<TTrophyGroups>(`/psn/trophyGroups/${id}`)

    runInAction(() => {
      this.loading = false
      this.data[id] = new StoreSingleGameItem(data)
    })
  }
}
