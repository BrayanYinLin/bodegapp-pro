import { RoleController } from '@auth/role'
import { RoleServiceImpl } from '@auth/services/role.service'
import { Request, Response, NextFunction } from 'express'

class RoleCtrl implements RoleController {
  constructor(private readonly roleService = new RoleServiceImpl()) {}

  async findAllByInventory(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const { inventoryId } = req.params
      const roles = await this.roleService.findAllByInventory({
        inventoryId: inventoryId
      })

      return res.json(roles)
    } catch (e) {
      next(e)
    }
  }
}

export { RoleCtrl }
