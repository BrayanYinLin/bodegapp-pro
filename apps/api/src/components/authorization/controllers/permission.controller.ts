import { PermissionController } from '@authorization/permission'
import { PermissionServiceImpl } from '@authorization/services/permission.service'
import { Request, Response, NextFunction } from 'express'

export class PermissionControllerImpl implements PermissionController {
  constructor(private readonly service = new PermissionServiceImpl()) {}

  async findAll(
    _: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const data = await this.service.findAll()

      return res.status(200).json(data)
    } catch (e) {
      next(e)
    }
  }
}
