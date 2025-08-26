import { Request, Response, NextFunction } from 'express'

export type RoleByInventoryParam = {
  inventoryId: string
}

export interface RoleService {
  findAllByInventory({
    inventoryId
  }: RoleByInventoryParam): Promise<ResponseRoleDto[]>
}

export interface RoleController {
  findAllByInventory(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void>
}
