import { RoleController } from '../role'
import { RoleServiceImpl } from '../services/role.service'
import { Request, Response, NextFunction } from 'express'

class RoleCtrl implements RoleController {
  constructor(private readonly roleService = new RoleServiceImpl()) {}

  async create(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const { inventoryId } = req.params
      await this.roleService.create({
        inventoryId: inventoryId,
        roleDto: req.body
      })

      return res.status(201).json({ message: 'Role created successfully' })
    } catch (e) {
      next(e)
    }
  }

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
