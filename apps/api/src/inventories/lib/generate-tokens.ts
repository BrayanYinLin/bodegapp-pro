import { sign } from 'jsonwebtoken'
import {
  ERROR_HTTP_CODES,
  ERROR_NAMES,
  TOKEN_PARAMS
} from '@shared/config/constants'
import { env_jwt_secret } from '@shared/config/environment'
import { AppError } from '@shared/utils/error-factory'
import {
  MemberPayloadDto,
  MemberPayloadSchema
} from '@members/entities/dto/member.dto'
import { randomUUID } from 'node:crypto'

const generateInventoryAccessToken = (payload: MemberPayloadDto) => {
  if (!env_jwt_secret) {
    throw new AppError({
      code: ERROR_NAMES.INTERNAL,
      httpCode: 500,
      isOperational: true,
      message: 'JWT Secret not provided'
    })
  }

  const { success, data, error } = MemberPayloadSchema.safeParse(payload)

  if (!success || error) {
    throw new AppError({
      code: ERROR_NAMES.VALIDATION,
      httpCode: ERROR_HTTP_CODES.VALIDATION,
      isOperational: true,
      message: 'Member payload token validation failed.'
    })
  }

  const token = sign(data, env_jwt_secret, {
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
      isOperational: true,
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
