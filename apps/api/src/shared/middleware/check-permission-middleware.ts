import { decodeAccess } from '@inventories/lib/decode-access'
import { ERROR_HTTP_CODES, ERROR_NAMES } from '@shared/config/constants'
import { GrantedPermission } from '@shared/database/role.seed'
import { AppError } from '@shared/utils/error-factory'
import { NextFunction, Request, Response } from 'express'

export const checkPermission = (permission: GrantedPermission) => {
  return (req: Request, _: Response, next: NextFunction) => {
    try {
      const { role } = decodeAccess(req.cookies.access_inventory)

      const grantedAction = role.permissions.findIndex(
        ({ description }) => description === permission
      )

      if (grantedAction === -1) {
        throw new AppError({
          code: ERROR_NAMES.FORBIDDEN,
          httpCode: ERROR_HTTP_CODES.FORBIDDEN,
          message: 'Permission not granted.',
          isOperational: true
        })
      }

      next()
    } catch (e) {
      next(e)
    }
  }
}
