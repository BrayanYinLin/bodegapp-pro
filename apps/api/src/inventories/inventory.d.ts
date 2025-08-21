import {
  CreateInventoryDto,
  ResponseInventoryDto
} from './entities/dtos/inventory.dto'
import { NextFunction, Request, Response } from 'express'

export interface InventoryTokens {
  [key: string]: string
  [key: string]: string
}

export type CreateInventoryParam = {
  dto: CreateInventoryDto
  sub: string
}

export type InventoryParam = {
  sub: string
}

export interface InventoryService {
  findAllByUser({ sub }: InventoryParam): Promise<ResponseInventoryDto[]>
  create({ dto, sub }: CreateInventoryParam): Promise<InventoryTokens>
}

export interface InventoryController {
  findAllByUser(
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
