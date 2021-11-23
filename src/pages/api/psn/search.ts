import { serverFetch } from 'src/server/serverFetch'
import { psnApi } from 'src/utils/constants'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { name } = req.query as { name: string }

  const baseURL = `${psnApi}/search/v1/universalSearch`

  try {
    const { data } = await serverFetch({
      method: `POST`,
      baseURL,
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
    })

    const result = data.domainResponses[0].results.map((user: any) => ({
      name: user.socialMetadata.onlineId,
      accountId: user.socialMetadata.accountId,
      isPsPlus: user.socialMetadata.isPsPlus,
      avatarUrl: user.socialMetadata.avatarUrl,
      score: user.score,
    }))

    res.status(200).send(result)
  } catch (error: any) {
    throw new Error(error)
  }
}
