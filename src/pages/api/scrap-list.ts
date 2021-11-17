import axios from 'axios'
import scrapeIt from 'scrape-it'
import type { NextApiRequest, NextApiResponse } from 'next'

const scheme = {
  items: {
    listItem: '.ss_search_bx_list_table tr',
    data: {
      title: '.ss_search_bx_list_title a',
      altTitle: '.ss_search_bx_list_atitle',
      url: {
        selector: '.ss_search_bx_list_title a',
        attr: 'href',
      },
      slug: {
        selector: '.ss_search_bx_list_title a',
        attr: 'href',
        convert: (url?: string) => url?.split('/')[3],
      },
      img: {
        selector: '.ss_search_bx_list_img',
        attr: 'src',
        convert: (val?: string) => 'https://www.stratege.ru' + val,
      },
    },
  },
}

type TQuery = {
  name: string
}

type TResponse = {
  items: {
    title: string
    altTitle: string
    url: string
    slug: string
    img: string
  }[]
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { name } = req.query as TQuery

  const params = new URLSearchParams()
  params.append('ajax_mode', 'site_search')
  params.append('queryfr', name)

  const config = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  }

  const { data } = await axios.post<string>('https://www.stratege.ru/ajax_loader/site_search_ajax', params, config)

  const { items } = await scrapeIt.scrapeHTML<TResponse>(data, scheme)

  const [withPS4, others] = items
    .filter(({ title }) => title)
    .reduce(
      (acc, next) => {
        if (next.title.includes('PS4')) {
          // @ts-ignore
          acc[0].push(next)
        } else {
          // @ts-ignore
          acc[1].push(next)
        }
        return acc
      },
      [[], []]
    )

  const result = [...withPS4, ...others]

  res.status(200).send(result)
}