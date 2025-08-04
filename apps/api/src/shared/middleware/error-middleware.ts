import { handleError } from '@shared/utils/error-handler'
import { NextFunction, Request, Response } from 'express'

export const middlewareError = async (
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
) => {
  await handleError(err, req, res)
}
