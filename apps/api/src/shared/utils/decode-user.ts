import { env_jwt_secret } from '@shared/config/environment'
import { JwtPayload, verify } from 'jsonwebtoken'
import { AppError } from './error-factory'
import { ERROR_HTTP_CODES, ERROR_NAMES } from '@shared/config/constants'

export const decodeUser = (token: string) => {
  if (!env_jwt_secret) {
    throw new AppError({
      code: ERROR_NAMES.INTERNAL,
      httpCode: 500,
      isOperational: false,
      message: 'JWT secret not provided.'
    })
  }

  const { sub } = verify(token, env_jwt_secret) as JwtPayload

  if (!sub) {
    throw new AppError({
      code: ERROR_NAMES.NOT_FOUND,
      httpCode: ERROR_HTTP_CODES.NOT_FOUND,
      message: 'Sub not provided',
      isOperational: true
    })
  }

  return sub
}
