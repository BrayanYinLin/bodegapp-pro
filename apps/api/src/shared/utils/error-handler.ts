import { Request, Response } from 'express'
import { AppError } from './error-factory'
import { ERROR_HTTP_CODES, ERROR_NAMES } from '@shared/config/constants'
import { logger } from './logger'
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken'

class ErrorHandler {
  public async handleHttpError(
    err: Error,
    req: Request,
    res: Response
  ): Promise<Response | void> {
    if (err instanceof AppError) {
      return res.status(Number(err.httpCode)).json({
        status: err.httpCode,
        message: err.message,
        path: req.path,
        details: err.details
      })
    } else if (err instanceof TokenExpiredError) {
      return res.status(ERROR_HTTP_CODES.AUTHENTICATION).json({
        status: ERROR_NAMES.AUTHENTICATION,
        message: 'Token expired.',
        path: req.path
      })
    } else if (err instanceof JsonWebTokenError) {
      return res.status(ERROR_HTTP_CODES.AUTHENTICATION).json({
        status: ERROR_NAMES.AUTHENTICATION,
        message: 'Invalid token.',
        path: req.path
      })
    }

    return res.status(ERROR_HTTP_CODES.INTERNAL).json({
      status: ERROR_NAMES.INTERNAL,
      message: err.name ?? 'Internal Server Error.',
      path: req.path,
      details: err.message ?? err.name
    })
  }

  public handleProcessError(err: Error) {
    logger.error(err)
    process.exit(1)
  }
}

export const handler = new ErrorHandler()
