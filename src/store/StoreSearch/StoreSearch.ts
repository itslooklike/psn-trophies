import { clientFetch } from 'src/utils'

export class StoreSearch {
  async fetch(name: string) {
    const { data } = await clientFetch.get(`/psn/search?name=${encodeURIComponent(name)}`)
    return data
  }
}
