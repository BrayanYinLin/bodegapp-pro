import { ERROR_HTTP_CODES, ERROR_NAMES } from '@shared/config/constants'
import { decodeUser } from '@shared/utils/decode-user'
import { AppError } from '@shared/utils/error-factory'
import { NextFunction, Request, Response } from 'express'

export const checkAccessMiddleware = () => {
  return (req: Request, _: Response, next: NextFunction) => {
    try {
      const accessToken = req.cookies.access_token
      if (!accessToken) {
        throw new AppError({
          code: 'AUTHENTICATION_ERROR',
          httpCode: 401,
          message: 'Access not granted.',
          isOperational: true
        })
      }

      const sub = decodeUser(accessToken)

      if (!sub) {
        throw new AppError({
          code: ERROR_NAMES.AUTHENTICATION,
          httpCode: ERROR_HTTP_CODES.AUTHENTICATION,
          message: 'Access not granted.',
          isOperational: true
        })
      }

      next()
    } catch (e) {
      next(e)
    }
  }
}
