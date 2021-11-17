import axios from 'axios'
import { redisGet, redisSet, redisExp } from 'src/server/redis'
import type { NextApiRequest, NextApiResponse } from 'next'
import pup from 'src/server/pup'
import { gamesMap } from 'src/utils/gamesMap'
import { apiBaseUrl } from 'src/utils/config'
import { nameRepl } from 'src/utils/nameRepl'

const scheme = {
  items: {
    listItem: '.tltstpl_trophies',
    data: {
      titleFull: 'span.tltstpl_tt_trops_title a',
      titleEng: {
        selector: 'span.tltstpl_tt_trops_title a',
        convert: (text: string) => text.split(' / ')[0],
      },
      titleRu: {
        selector: 'span.tltstpl_tt_trops_title a',
        convert: (text: string) => text.split(' / ')[1],
      },
      description: '.tltstpl_tt_trops_description_box',
      tips: {
        listItem: '.tlhsltpl_helps_body > div',
        data: {
          text: {
            selector: '.viewstgix_layer_find',
            how: 'html',
          },
          rating: '.tlhsltpl_helps_header_hearts',
        },
      },
    },
  },
}

const postFix = ' (PS4)'

type TQuery = {
  id: string
  name?: string
  slug?: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id, name, slug } = req.query as TQuery

  // @ts-ignore
  let gameSlug = slug || gamesMap[id]

  if (!gameSlug) {
    if (!name) {
      throw new Error('no data')
    }

    // FIXME: name из приложения отправляется уже в энкодед состоянии
    // Кто его докодирует, что нуобходимо опять его енкодить? Это некст? аксиос?
    const { data } = await axios(`${apiBaseUrl}/scrap-list?name=${encodeURIComponent(name)}`)

    // @ts-ignore
    const preData = data.filter(({ title }) => title.includes(postFix))

    const newName = nameRepl(name)

    // @ts-ignore
    const result = preData.find(({ title, atitle }) => {
      return title === newName + postFix || atitle === newName
    })

    if (!result) {
      throw new Error(data)
    }

    gameSlug = result.slug
  }

  const url = `https://www.stratege.ru/ps4/games/${gameSlug}/trophies`
  const cache = await redisGet(url)

  if (cache) {
    console.log('👾 cache loaded: ', url)
    res.status(200).send(JSON.parse(cache))
  } else {
    // @ts-ignore
    const { items } = await pup.scrap(url, scheme, scheme.items.listItem)
    await pup.close()
    await redisSet(url, JSON.stringify(items))
    await redisExp(url, 60 * 60)
    console.log('💰 save to cache: ', url)
    res.status(200).send(items)
  }
}
