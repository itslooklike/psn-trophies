// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  accessToken: string
}

let npsso = process.env.NPSSO_TOKEN

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  axios
    .get('https://ca.account.sony.com/api/v1/oauth/authorize', {
      params: {
        response_type: 'token',
        scope:
          'capone:report_submission,kamaji:game_list,kamaji:get_account_hash,user:account.get,user:account.profile.get,kamaji:social_get_graph,kamaji:ugc:distributor,user:account.identityMapper,kamaji:music_views,kamaji:activity_feed_get_feed_privacy,kamaji:activity_feed_get_news_feed,kamaji:activity_feed_submit_feed_story,kamaji:activity_feed_internal_feed_submit_story,kamaji:account_link_token_web,kamaji:ugc:distributor_web,kamaji:url_preview',
        client_id: '656ace0b-d627-47e6-915c-13b259cd06b2',
        redirect_uri:
          'https://my.playstation.com/auth/response.html?requestID=iframe_request_f634221e-b5fe-4c08-b0fa-ce1c9f7ca539',
        baseUrl: '/',
        targetOrigin: 'https://my.playstation.com',
        prompt: 'none',
      },
      headers: {
        Cookie: `npsso=${npsso}`,
      },
    })
    .then((response) => {
      const { hash } = new URL(response.request.res.responseUrl)
      const hashes = hash.replace('#', '').split('&')

      let params: {
        [_: string]: string
      } = {}

      hashes.map((hash) => {
        const [key, val] = hash.split('=')
        params[key] = val
      })

      const accessToken = params.access_token

      console.log(accessToken)

      res.status(200).json({ accessToken })
    })
}
