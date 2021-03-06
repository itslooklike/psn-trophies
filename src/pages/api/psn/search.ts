import { serverFetch } from 'src/server/serverFetch'
import { psnApi } from 'src/utils/config'
import { fmtAva } from 'src/utils/fmt'
import type { NextApiRequest, NextApiResponse } from 'next'

interface ISearchSocialMeta {
  accountId: string
  onlineId: string
  isPsPlus: boolean
  avatarUrl: string
}

interface ISearchUser {
  score: number
  socialMetadata: ISearchSocialMeta
}

interface ISearchResponse {
  domainResponses: { results: ISearchUser[] }[]
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { name } = req.query as { name: string }

  const url = `${psnApi}/search/v1/universalSearch`

  try {
    const { data } = (await serverFetch({
      method: `POST`,
      url,
      headers: {
        'Content-Type': `application/json`,
        'XXX-CACHE-CONTROL': `no-cache`,
      },
      data: {
        searchTerm: decodeURIComponent(name),
        domainRequests: [
          {
            domain: `SocialAllAccounts`,
          },
        ],
      },
    })) as { data: ISearchResponse }

    const result = data.domainResponses[0].results.map((user) => ({
      name: user.socialMetadata.onlineId,
      accountId: user.socialMetadata.accountId,
      isPsPlus: user.socialMetadata.isPsPlus,
      avatarUrl: fmtAva(user.socialMetadata.avatarUrl),
      score: user.score,
    }))

    res.status(200).send(result)
  } catch (error: any) {
    console.log(`>> /search error: `, error.toJSON())
    console.log(`>> 99%, нужно просто обновить REFRESH_TOKEN (не забыть перезапустить, после изменений в .env)`)
    console.log(`>> FIXME: вкрутить рефреш токена на эту ошибку`)
    throw new Error(error)
  }
}
