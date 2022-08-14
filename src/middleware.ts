import { NextResponse, NextRequest } from 'next/server'

import { NAME_ACCOUNT_ID } from 'src/utils/config'

export function middleware(request: NextRequest) {
  const { pathname, origin, searchParams } = request.nextUrl

  const userId = searchParams.get(`user_id`) || request.cookies.get(NAME_ACCOUNT_ID)

  const LOGIN_ROUTE = `/login`
  const isApiCall = pathname.startsWith(`/api`)
  const isStaticCall = pathname.startsWith(`/_next`)
  const isFileCall = pathname.includes(`.`)

  if (pathname !== LOGIN_ROUTE && !userId && !isApiCall && !isStaticCall && !isFileCall) {
    return NextResponse.redirect(origin + LOGIN_ROUTE)
  }

  return NextResponse.next()
}
