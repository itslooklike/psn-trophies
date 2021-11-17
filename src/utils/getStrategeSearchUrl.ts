import { nameRepl } from './nameRepl'

export const getStrategeSearchUrl = (name: string) =>
  `https://www.stratege.ru/site_search#args:ajax=1&queryfr=${nameRepl(name)}`
