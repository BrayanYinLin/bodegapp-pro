import {
  CreateInventoryDto,
  ResponseInventoryDto
} from './entities/dtos/inventory.dto'
import { NextFunction, Request, Response } from 'express'

export interface InventoryTokens {
  access_inventory: string
  refresh_inventory: string
}

export type CreateInventoryParam = {
  dto: CreateInventoryDto
  sub: string
}

export type InventoryParam = {
  sub: string
}

export type InventoryWithTokens = {
  inventory: ResponseInventoryDto
  tokens: InventoryTokens
}

export type InventoryAndUserParam = {
  sub: string
  id: string
}

export interface InventoryService {
  findAllByUser({ sub }: InventoryParam): Promise<ResponseInventoryDto[]>
  findById({ sub, id }: InventoryAndUserParam): Promise<InventoryWithTokens>
  create({ dto, sub }: CreateInventoryParam): Promise<InventoryWithTokens>
}

export interface InventoryController {
  findAllByUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void>
  findById(
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
