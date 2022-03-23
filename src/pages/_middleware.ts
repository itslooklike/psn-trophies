import { NextResponse, NextRequest } from 'next/server'

import { NAME_ACCOUNT_ID } from 'src/utils/config'

export function middleware(req: NextRequest) {
  const { pathname, origin, searchParams } = req.nextUrl

  const userId = searchParams.get(`user_id`) || req.cookies[NAME_ACCOUNT_ID]

  const LOGIN_ROUTE = `/login`
  const isApiCall = pathname.startsWith(`/api`)

  if (pathname !== LOGIN_ROUTE && !userId && !isApiCall) {
    return NextResponse.redirect(origin + LOGIN_ROUTE)
  }

  return NextResponse.next()
}
