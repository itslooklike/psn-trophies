import type { NextApiRequest, NextApiResponse } from 'next'
import pup from 'src/server/pup'
import { getStrategeSearchUrl } from 'src/utils'

const searchScheme = {
  items: {
    listItem: '.ss_search_bx_list_table tr',
    data: {
      title: '.ss_search_bx_list_title a',
      atitle: '.ss_search_bx_list_atitle',
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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { name } = req.query as TQuery

  const url = getStrategeSearchUrl(name)
  // @ts-ignore
  const { items } = await pup.scrap(url, searchScheme, searchScheme.items.listItem)

  // @ts-ignore
  const result = items.filter(({ title }) => title)

  res.status(200).send(result)
}
