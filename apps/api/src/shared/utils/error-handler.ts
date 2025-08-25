import { Request, Response } from 'express'
import { AppError } from './error-factory'
import { ERROR_NAMES } from '@shared/config/constants'

export const handleError = async (
  err: Error,
  req: Request,
  res: Response
): Promise<Response | void> => {
  if (err instanceof AppError) {
    return res.status(Number(err.httpCode)).json({
      status: err.httpCode,
      message: err.message,
      path: req.path,
      details: err.details
    })
  }

  return res.status(500).json({
    status: ERROR_NAMES.INTERNAL,
    message: err.name ?? 'Internal Server Error',
    path: req.path,
    details: err.message ?? err.name
  })
}
