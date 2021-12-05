export const fmtName = (name: string) =>
  name
    .replace(`Ⅱ`, `II`)
    .replace(/[^\w0-9' ]/g, ` `)
    .trim()
    .replace(/  /g, ` `)

export const fmtAva = (name: string) =>
  name.replace(`http://static-resource.np.community.playstation.net`, `/api/psn/avatar`)

export const fmtSearchUrl = (name: string) =>
  `https://www.stratege.ru/site_search#args:ajax=1&queryfr=${fmtName(name)}`

export const fmtDate = (date: string) =>
  new Intl.DateTimeFormat(`ru`, {
    timeZone: `Europe/Moscow`,
    year: `numeric`,
    month: `2-digit`,
    day: `2-digit`,
    hour: `2-digit`,
    minute: `2-digit`,
    second: `2-digit`,
    hour12: false,
  }).format(new Date(date))

export const fmtStrategeUrl = (slug: string) => `https://www.stratege.ru${slug}/trophies`
