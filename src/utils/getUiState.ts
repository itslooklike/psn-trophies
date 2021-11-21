import { isClient } from 'src/utils/env'

export const getUiState = (name: string) => {
  if (isClient) {
    const initial = localStorage.getItem(name)

    if (initial !== null) {
      return JSON.parse(initial) as boolean
    }
  }

  return false
}
