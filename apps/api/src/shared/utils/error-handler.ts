import { Request, Response } from 'express'
import { AppError } from './error-factory'
import { ERROR_HTTP_CODES, ERROR_NAMES } from '@shared/config/constants'
import { logger } from './logger'

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
    }

    return res.status(ERROR_HTTP_CODES.INTERNAL).json({
      status: ERROR_NAMES.INTERNAL,
      message: err.name ?? 'Internal Server Error',
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
