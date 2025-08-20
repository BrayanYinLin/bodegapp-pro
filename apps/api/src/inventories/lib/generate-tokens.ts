import { sign } from 'jsonwebtoken'
import { ERROR_NAMES, TOKEN_PARAMS } from '@shared/config/constants'
import { env_jwt_secret } from '@shared/config/environment'
import { AppError } from '@shared/utils/error-factory'
import { MemberPayloadDto } from '@members/entities/dto/member.dto'
import { randomUUID } from 'node:crypto'

const generateInventoryAccessToken = (payload: MemberPayloadDto) => {
  if (!env_jwt_secret) {
    throw new AppError({
      code: ERROR_NAMES.INTERNAL,
      httpCode: 500,
      isOperational: false,
      message: 'JWT Secret not provided'
    })
  }

  const token = sign(payload, env_jwt_secret, {
    algorithm: 'HS256',
    expiresIn: TOKEN_PARAMS.AT_DURATION
  })

  return token
}

const generateInventoryRefreshToken = (member: MemberPayloadDto) => {
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
    sub: member.sub
  }

  const token = sign(payload, env_jwt_secret, {
    algorithm: 'HS256',
    expiresIn: TOKEN_PARAMS.AT_DURATION
  })

  return token
}

export { generateInventoryAccessToken, generateInventoryRefreshToken }
