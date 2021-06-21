import axios from 'axios'

let accessToken = process.env.NEXT_PUBLIC_ACCESS_TOKEN
let canRefresh = true

export const fetcher = axios.create({
  baseURL: 'https://ru-tpy.np.community.playstation.net/trophy/v1/trophyTitles',
  headers: {
    Authorization: `Bearer ${accessToken}`,
    'Accept-Language': 'ru-RU,ru;',
  },
})

const updateToken = () => {
  fetcher.defaults.headers['Authorization'] = `Bearer ${accessToken}`
  console.log('fetcher.defaults.headers', fetcher.defaults.headers)
}

const refreshToken = () => {
  return axios.get('/api/hello').then(({ data }) => {
    accessToken = data.accessToken
    updateToken()
  })
}

fetcher.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response.status === 401 && canRefresh) {
      canRefresh = false

      return refreshToken().then(() => {
        error.config.headers['Authorization'] = `Bearer ${accessToken}`
        error.config.baseURL = undefined
        return fetcher.request(error.config)
      })
    }

    return error
  }
)
