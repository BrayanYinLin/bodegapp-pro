import { User } from '@auth/entities/user.entity'
import { ALGORITHM, ERROR_NAMES, TOKEN_PARAMS } from '@shared/config/constants'
import { env_jwt_secret } from '@shared/config/environment'
import { AppError } from '@shared/utils/error-factory'
import { sign } from 'jsonwebtoken'
import { randomUUID } from 'node:crypto'

export type UserIdDto = Pick<User, 'id'>
export type AccessTokenDto = {
  token: string
  payload: {
    sub: string
  }
}
export type RefreshTokenDto = {
  token: string
  payload: {
    jti: string
    sub: string
  }
}

const accessToken = ({ id }: UserIdDto): AccessTokenDto => {
  if (!env_jwt_secret) {
    throw new AppError({
      code: ERROR_NAMES.INTERNAL,
      httpCode: 500,
      isOperational: true,
      message: 'JWT Secret not provided'
    })
  }

  const payload = {
    sub: id
  }

  const token = sign(payload, env_jwt_secret, {
    algorithm: ALGORITHM,
    expiresIn: TOKEN_PARAMS.AT_DURATION
  })

  return {
    token,
    payload
  }
}

const refreshToken = ({ id }: UserIdDto): RefreshTokenDto => {
  if (!env_jwt_secret) {
    throw new AppError({
      code: ERROR_NAMES.INTERNAL,
      httpCode: 500,
      isOperational: true,
      message: 'JWT Secret not provided'
    })
  }

  const payload = {
    jti: randomUUID(),
    sub: id
  }

  const token = sign(payload, env_jwt_secret, {
    algorithm: ALGORITHM,
    expiresIn: TOKEN_PARAMS.RT_DURATION
  })

  return {
    token,
    payload
  }
}

export { accessToken, refreshToken }
