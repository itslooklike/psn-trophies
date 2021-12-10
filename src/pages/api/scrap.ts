import axios from 'axios'
import { redisGet, redisSet, redisExp } from 'src/server/redis'
import type { NextApiRequest, NextApiResponse } from 'next'
import pup from 'src/server/pup'
import { storageSlugs } from 'src/utils/storageSlugs'
import { apiBaseUrl } from 'src/utils/config'
import { fmtName } from 'src/utils/fmt'
import { fmtStrategeUrl } from 'src/utils/fmt'

import type { TScrapListResponse } from './scrap-list'

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
  items: {
    titleFull: string
    titleEng: string
    description: string
    tips: {
      text: string
      rating: string
    }[]
  }[]
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

    items = items.map((item) => ({
      ...item,
      tips: item.tips.filter(({ text }) => text),
    }))

    // await pup.close()
    await redisSet(url, JSON.stringify(items))
    await redisExp(url, 60 * 60)
    console.log(`💰 save to cache: `, url)
    res.status(200).send(items)
  }
}
