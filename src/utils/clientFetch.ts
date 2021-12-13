import Router from 'next/router'
import axios from 'axios'
import { apiUrl } from './config'

export const clientFetch = axios.create({
  baseURL: apiUrl,
})

clientFetch.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.data.message === `invalid_grant`) {
      Router.push(`/server-token-expired`)
      return
    }

    return Promise.reject(error)
  }
)
