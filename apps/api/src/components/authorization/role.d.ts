import { Request, Response, NextFunction } from 'express'
import { CreateRoleDto } from './entities/dtos/role.dto'

export type RoleByInventoryParam = {
  inventoryId: string
}

export type CreateRolParams = {
  inventoryId: string
  roleDto: CreateRoleDto
}

export interface RoleService {
  findAllByInventory({
    inventoryId
  }: RoleByInventoryParam): Promise<ResponseRoleDto[]>
  create({ inventoryId, roleDto }: CreateRolParams): Promise<boolean>
}

export interface RoleController {
  findAllByInventory(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void>
  create(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void>
}
