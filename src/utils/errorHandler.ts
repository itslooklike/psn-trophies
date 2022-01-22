import { AxiosError } from 'axios'

export const errorHandler = (error: AxiosError, name: string) => {
  console.log(`⛔️ >> START ERROR LOG:`, name)
  console.log(`⛔️ >> code:`, error.code)

  const { headers, method, url, data: configData } = error.config
  console.log(`⛔️ >> error.config:`, { headers, method, url, data: configData })

  const { status, statusText, data: responseData } = error.response!
  console.log(`⛔️ >> error.response:`, { status, statusText, data: responseData })
  console.log(`⛔️ >> ---`)
}
