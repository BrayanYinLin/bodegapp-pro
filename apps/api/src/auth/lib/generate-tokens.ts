import { User } from '@auth/entities/user.entity'
import { ERROR_NAMES, TOKEN_PARAMS } from '@shared/config/constants'
import { env_jwt_secret } from '@shared/config/environment'
import { AppError } from '@shared/utils/error-factory'
import { sign } from 'jsonwebtoken'
import { randomUUID } from 'node:crypto'

export type UserId = Pick<User, 'id'>

const generateAccessToken = ({ id }: UserId) => {
  if (!env_jwt_secret) {
    throw new AppError({
      code: ERROR_NAMES.INTERNAL,
      httpCode: 500,
      isOperational: false,
      message: 'JWT Secret not provided'
    })
  }

  const payload = {
    sub: id,
    iat: Math.floor(Date.now() / 1000)
  }

  const token = sign(payload, env_jwt_secret, {
    algorithm: 'HS256',
    expiresIn: TOKEN_PARAMS.AT_DURATION
  })

  return token
}

const generateRefreshToken = ({ id }: UserId) => {
  if (!env_jwt_secret) {
    throw new AppError({
      code: ERROR_NAMES.INTERNAL,
      httpCode: 500,
      isOperational: false,
      message: 'JWT Secret not provided'
    })
  }

  const payload = {
    jti: randomUUID(),
    sub: id
  }

  const token = sign(payload, env_jwt_secret, {
    algorithm: 'HS256',
    expiresIn: TOKEN_PARAMS.RT_DURATION
  })

  return token
}

export { generateAccessToken, generateRefreshToken }
