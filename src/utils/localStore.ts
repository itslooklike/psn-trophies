import { isClient } from 'src/utils/config'

export const localStore = (name: string) => {
  if (isClient) {
    const initial = window.localStorage.getItem(name)

    if (initial !== null) {
      return JSON.parse(initial)
    }
  }

  return false
}

localStore.setItem = (name: string, data: any) => {
  if (isClient) {
    window.localStorage.setItem(name, JSON.stringify(data))
    return true
  }

  return false
}

localStore.clear = () => {
  if (isClient) {
    window.localStorage.clear()
  }
}
