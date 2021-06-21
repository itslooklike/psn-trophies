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

const updateToken = (token: string) => {
  accessToken = token
  fetcher.defaults.headers['Authorization'] = `Bearer ${accessToken}`
}

const refreshToken = () =>
  axios.get('/api/hello').then(({ data }) => {
    updateToken(data.accessToken)
  })

fetcher.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401 && canRefresh) {
      canRefresh = false

      return refreshToken().then(() => {
        error.config.headers['Authorization'] = `Bearer ${accessToken}`
        return fetcher.request(error.config)
      })
    }

    return error
  }
)
