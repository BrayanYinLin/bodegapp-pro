import { handler } from '@shared/utils/error-handler'
import { NextFunction, Request, Response } from 'express'

export const middlewareError = async (
  err: Error,
  req: Request,
  res: Response,
  // Do not remove the comment below because express does not recognize this as a middleware error
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
) => {
  await handler.handleHttpError(err, req, res)
}
