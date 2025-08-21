import { ERROR_HTTP_CODES, ERROR_NAMES } from '@shared/config/constants'
import { AppError } from '@shared/utils/error-factory'
import { formatErrorMessages } from '@shared/utils/format-error-messages'
import { NextFunction, Request, Response } from 'express'
import { ZodType } from 'zod'

export const validateMiddleware = <T>(schema: ZodType<T>) => {
  return (req: Request, _: Response, next: NextFunction) => {
    const { success, data, error } = schema.safeParse(req.body)

    if (!success && error) {
      return next(
        new AppError({
          code: ERROR_NAMES.VALIDATION,
          httpCode: ERROR_HTTP_CODES.VALIDATION,
          message: 'Validation error',
          isOperational: true,
          details: formatErrorMessages(error)
        })
      )
    }

    req.body = data

    return next()
  }
}
