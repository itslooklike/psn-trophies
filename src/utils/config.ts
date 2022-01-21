export const apiUrl = `/api`
export const apiBaseUrl = `http://0.0.0.0:${process.env.PORT || `3005`}${apiUrl}`
export const refreshToken = process.env.REFRESH_TOKEN as string
export const redisUrl = process.env.CUSTOM_REDISTOGO_URL
export const isProd = process.env.NODE_ENV === `production`

// localStorage names
export const NAME_UI_HIDDEN = `ui_hidden_platinum_on_main`
export const NAME_UI_HIDDEN_EARNED = `ui_hidden_platinum_earned`
export const NAME_UI_SORT_BY_PROGRESS = `ui_sort_by_progress`
export const NAME_UI_SHOW_ONLY_PS4 = `ui_show_only_ps4`
export const NAME_TROPHY_HIDDEN = `ui_show_hidden_trophy`
export const NAME_TROPHY_DLC = `ui_show_dlc_trophy`
export const NAME_GAME_NP_PREFIX = `game_`
export const N_TROPHY_FILTER = `ui_trophy_filter`

// cookies names
export const NAME_ACCOUNT_ID = `accountId`

// others
export const psnApi = `https://m.np.playstation.net/api`

export const isServer = typeof window === `undefined`
export const isClient = !isServer

//
export const storageSlugs = {
  NPWR07032_00: `/ps4/games/mad_max`,
} as { [key: string]: string }
