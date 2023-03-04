import axios, { type AxiosError } from 'axios'

export const errorHandler = (error: Error | AxiosError, name: string) => {
  if (axios.isAxiosError(error)) {
    console.log(`⛔️ >> START ERROR LOG:`, name)
    console.log(`⛔️ >> code:`, error.code)

    if (error.config) {
      const { headers, method, url, data: configData } = error.config
      console.log(`⛔️ >> error.config:`, { headers, method, url, data: configData })

      const { status, statusText, data: responseData } = error.response!
      console.log(`⛔️ >> error.response:`, { status, statusText, data: responseData })
      console.log(`⛔️ >> ---`)
    }
  } else {
    console.log(`⛔️ >> `, error)
  }
}
