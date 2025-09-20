import { Response } from 'express'
import { COOKIE_NAMES, TOKEN_PARAMS } from '@shared/config/constants'

export function setAuthCookies(
  res: Response,
  accessToken: string,
  refreshToken: string
) {
  return res
    .cookie(COOKIE_NAMES.ACCESS_TOKEN, accessToken, {
      httpOnly: true,
      maxAge: TOKEN_PARAMS.AT_DURATION * 1000,
      sameSite: 'lax',
      path: '/'
    })
    .cookie(COOKIE_NAMES.REFRESH_TOKEN, refreshToken, {
      httpOnly: true,
      maxAge: TOKEN_PARAMS.RT_DURATION * 1000,
      sameSite: 'lax',
      path: '/'
    })
}
