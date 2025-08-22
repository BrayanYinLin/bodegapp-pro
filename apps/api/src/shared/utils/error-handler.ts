import { Request, Response } from 'express'
import { AppError } from './error-factory'

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

  // if (err instanceof errors.JWTInvalid) {
  //   res.status(401).json({ status: 401, message: err.message, path: req.path })
  //   return
  // } else if (err instanceof errors.JWTExpired) {
  //   res.status(401).json({ status: 401, message: err.message, path: req.path })
  //   return
  // }

  return res.status(500).json({
    status: 'error',
    message: 'Internal Server Error',
    path: req.path,
    details: err.message ?? err.name
  })
}
