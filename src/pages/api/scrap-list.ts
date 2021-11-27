import axios from 'axios'
import scrapeIt from 'scrape-it'
import type { NextApiRequest, NextApiResponse } from 'next'

import type { TStrategeMerge } from 'src/store/StoreStrategeTips/types'
import { nameRepl } from 'src/utils/nameRepl'

const scheme = {
  items: {
    listItem: `.ss_search_bx_list_table tr`,
    data: {
      title: `.ss_search_bx_list_title a`,
      altTitle: `.ss_search_bx_list_atitle`,
      url: {
        selector: `.ss_search_bx_list_title a`,
        attr: `href`,
      },
      slug: {
        selector: `.ss_search_bx_list_title a`,
        attr: `href`,
        convert: (url?: string) => url?.split(`/`)[3],
      },
      img: {
        selector: `.ss_search_bx_list_img`,
        attr: `src`,
        convert: (val?: string) => `https://www.stratege.ru` + val,
      },
    },
  },
  pagination: {
    listItem: `.ajax_nav_page_TPL_site_search a`,
    data: {
      text: {},
      href: {
        attr: `href`,
      },
    },
  },
}

type TQuery = {
  name: string
  page?: string
}

type TResponse = {
  items: TStrategeMerge[]
  pagination: {
    text: string
    href: string
  }[]
}

export type TScrapListResponse = {
  payload: TStrategeMerge[]
  nextPage: string | undefined
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { name, page } = req.query as TQuery

  const params1 = new URLSearchParams()
  params1.append(`ajax_mode`, `site_search`)
  params1.append(`queryfr`, name)

  if (page) {
    params1.append(`page`, page)
  }

  const url = `https://www.stratege.ru/ajax_loader/site_search_ajax`

  let data = (await axios.post<string>(url, params1)).data

  if (data.startsWith(`К сожалению`)) {
    const prettyName = nameRepl(name)
    const params2 = new URLSearchParams()
    params2.append(`ajax_mode`, `site_search`)
    params2.append(`queryfr`, prettyName)

    if (page) {
      params2.append(`page`, page)
    }

    data = (await axios.post<string>(url, params2)).data
  }

  const { items, pagination } = await scrapeIt.scrapeHTML<TResponse>(data, scheme)

  const nextPageHref = pagination.find(({ text }) => text === `Далее по списку`)?.href

  const nextPage = nextPageHref
    ?.split(`?`)[1]
    .split(`&`)
    .find((item) => item.includes(`page`))
    ?.split(`=`)[1]

  const [withPS4, others] = items
    .filter(({ title }) => title)
    .reduce(
      (acc, next) => {
        if (next.title.includes(`PS4`)) {
          acc[0].push(next)
        } else {
          acc[1].push(next)
        }
        return acc
      },
      [[], []] as [TStrategeMerge[], TStrategeMerge[]]
    )

  const result: TScrapListResponse = {
    payload: [...withPS4, ...others],
    nextPage,
  }

  res.status(200).send(result)
}
