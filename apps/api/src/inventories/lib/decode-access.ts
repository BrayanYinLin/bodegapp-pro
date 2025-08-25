import { env_jwt_secret } from '@shared/config/environment'
import { JwtPayload, verify } from 'jsonwebtoken'
import { AppError } from '@shared/utils/error-factory'
import { ERROR_HTTP_CODES, ERROR_NAMES } from '@shared/config/constants'
import { MemberPayloadDto } from '@members/entities/dto/member.dto'

export const decodeAccess = (token: string) => {
  if (!env_jwt_secret) {
    throw new AppError({
      code: ERROR_NAMES.INTERNAL,
      httpCode: 500,
      isOperational: true,
      message: 'JWT secret not provided.'
    })
  }

  if (!token) {
    throw new AppError({
      code: ERROR_NAMES.AUTHENTICATION,
      httpCode: ERROR_HTTP_CODES.AUTHENTICATION,
      isOperational: true,
      message: 'Access inventory token not provided.'
    })
  }

  const { inventory, role, sub } = verify(
    token,
    env_jwt_secret
  ) as JwtPayload as MemberPayloadDto

  if (!sub) {
    throw new AppError({
      code: ERROR_NAMES.NOT_FOUND,
      httpCode: ERROR_HTTP_CODES.NOT_FOUND,
      message: 'Sub not provided',
      isOperational: true
    })
  }

  return { inventory, role, sub }
}
