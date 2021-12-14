import axios from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'

import { redisGet, redisSet, redisExp } from 'src/server/redis'
import { storageSlugs } from 'src/utils/storageSlugs'
import { fmtStrategeUrl } from 'src/utils/fmt'
import { apiBaseUrl } from 'src/utils/config'
import { fmtName } from 'src/utils/fmt'
import pup from 'src/server/pup'

import type { TScrapListResponse } from './scrap-list'
import type { TStrategeGame } from 'src/types'

const scheme = {
  items: {
    listItem: `.tltstpl_trophies`,
    data: {
      titleFull: `span.tltstpl_tt_trops_title a`,
      titleEng: {
        selector: `span.tltstpl_tt_trops_title a`,
        convert: (text: string) => text.split(` / `)[0],
      },
      titleRu: {
        selector: `span.tltstpl_tt_trops_title a`,
        convert: (text: string) => text.split(` / `)[1],
      },
      description: `.tltstpl_tt_trops_description_box`,
      tips: {
        listItem: `.tlhsltpl_helps_body > div`,
        data: {
          text: {
            selector: `.viewstgix_layer_find`,
            how: `html`,
          },
          rating: `.tlhsltpl_helps_header_hearts`,
          date: {
            selector: `.tlhsltpl_helps_header_autor_date`,
            convert: (text: string) => text.replace(`— `, ``).replace(` в `, ` `),
          },
        },
      },
      tables: {
        listItem: `.tlhsltpl_slider_table_td > div > div`,
        data: {
          firstRowRating: `.tlhsltpl_helps_header_helps .tlhsltpl_helps_header_hearts`,
          firstRowDate: {
            selector: `.tlhsltpl_helps_header_helps .tlhsltpl_helps_header_autor_date`,
            convert: (text: string) => text.replace(`— `, ``).replace(` в `, ` `),
          },
          firstText: {
            selector: `.tlhsltpl_helps_text_helps.viewstgix_layer_find`,
            how: `html`,
          },
          allHeaders: {
            listItem: `.tlhsltpl_add_helps_header`,
            data: {
              rating: `.tlhsltpl_helps_header_hearts`,
              date: {
                selector: `.tlhsltpl_helps_header_autor_date`,
                convert: (text: string) => text.replace(`— `, ``).replace(` в `, ` `),
              },
            },
          },
          allBody: {
            listItem: `.tlhsltpl_add_helps_text`,
            data: {
              text: {
                how: `html`,
              },
            },
          },
        },
      },
    },
  },
}

const postFix = ` (PS4)`

type TQuery = {
  id: string
  name?: string
  slug?: string
}

type TResponse = {
  items: TStrategeGame[]
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id, name, slug } = req.query as TQuery

  // @ts-ignore
  let gameSlug = slug || storageSlugs[id]

  if (!gameSlug) {
    if (!name) {
      throw new Error(`no data`)
    }

    const { data } = await axios.get<TScrapListResponse>(
      `${apiBaseUrl}/scrap-list?name=${encodeURIComponent(name)}`
    )

    const preData = data.payload.filter(({ title }) => title.includes(postFix))

    const newName = fmtName(name)

    const result = preData.find(({ title, altTitle }) => {
      return title === newName + postFix || altTitle === newName
    })

    if (!result) {
      throw new Error(`No data`)
    }

    gameSlug = result.slug
  }

  const url = fmtStrategeUrl(gameSlug)
  const cache = await redisGet(url)

  if (cache) {
    console.log(`👾 cache loaded: `, url)
    res.status(200).send(JSON.parse(cache))
  } else {
    let { items } = (await pup.scrap(url, scheme, scheme.items.listItem)) as TResponse

    ;[...items] = items.map((item) => {
      // @ts-ignore
      let tips = item.tables.map((table) => {
        // @ts-ignore
        const arr = table.allHeaders.map((row, index) => ({
          text: table.allBody[index].text,
          rating: row.rating,
          date: row.date,
        }))

        return [
          {
            text: table.firstText,
            rating: table.firstRowRating,
            date: table.firstRowDate,
          },
          ...arr,
        ]
      })

      console.log(`tips`, tips)
      // @ts-ignore
      delete item.tables

      return {
        ...item,
        tips: tips.flat(),
      }
    })

    console.log(`items`, JSON.stringify(items, null, 2))

    // await pup.close()
    await redisSet(url, JSON.stringify(items))
    await redisExp(url, 60 * 60)
    console.log(`💰 save to cache: `, url)
    res.status(200).send(items)
  }
}
