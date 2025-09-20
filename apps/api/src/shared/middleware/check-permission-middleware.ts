import { decodeAccess } from '@inventories/lib/decode-access'
import { ERROR_HTTP_CODES, ERROR_NAMES } from '@shared/config/constants'
import { GrantedPermission } from '@shared/database/role.seed'
import { AppError } from '@shared/utils/error-factory'
import { userHasPermission } from '@shared/utils/user-has-permission'
import { NextFunction, Request, Response } from 'express'

export const checkPermission = (permission: GrantedPermission) => {
  return (req: Request, _: Response, next: NextFunction) => {
    try {
      const payload = decodeAccess(req.cookies.access_inventory)

      const grantedAction = userHasPermission(payload, permission)

      if (!grantedAction) {
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
