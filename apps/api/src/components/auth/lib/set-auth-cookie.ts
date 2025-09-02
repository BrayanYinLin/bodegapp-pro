import { Response } from 'express'
import { TOKEN_PARAMS } from '@shared/config/constants'

export function setAuthCookies(
  res: Response,
  accessToken: string,
  refreshToken: string
) {
  return res
    .cookie('access_token', accessToken, {
      httpOnly: true,
      maxAge: TOKEN_PARAMS.AT_DURATION * 1000,
      sameSite: 'lax'
    })
    .cookie('refresh_token', refreshToken, {
      httpOnly: true,
      maxAge: TOKEN_PARAMS.RT_DURATION * 1000,
      sameSite: 'lax'
    })
}
