import axios from 'axios'
import { apiUrl } from './config'

export const clientFetch = axios.create({
  baseURL: apiUrl,
})
