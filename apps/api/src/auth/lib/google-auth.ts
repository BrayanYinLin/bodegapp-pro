import { Strategy } from 'passport-google-oauth20'
import passport from 'passport'
import {
  env_google_client,
  env_google_secret
} from '@shared/config/environment'
import { AppError } from '@shared/utils/error-factory'
import { ERROR_HTTP_CODES, ERROR_NAMES } from '@shared/config/constants'

const createOauthMiddleware = () => {
  if (!env_google_client || !env_google_secret) {
    throw new AppError({
      code: ERROR_NAMES.INTERNAL,
      httpCode: ERROR_HTTP_CODES.INTERNAL,
      message: 'Google credentials are not provided',
      isOperational: true
    })
  }

  const callbackURL = `${process.env.API_BASE_URL}/api/v1/user/auth/google/callback`
  passport.use(
    'google',
    new Strategy(
      {
        clientID: env_google_client,
        clientSecret: env_google_secret,
        callbackURL
      },
      async (at, rt, profile, cb) => {
        if (!profile.emails) {
          throw new AppError({
            code: ERROR_NAMES.AUTHENTICATION,
            httpCode: ERROR_HTTP_CODES.AUTHENTICATION,
            message: 'Email not found in Google profile',
            isOperational: true
          })
        }

        cb(null, profile)
      }
    )
  )
}

createOauthMiddleware()
