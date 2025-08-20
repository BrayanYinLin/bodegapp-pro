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

export interface InventoryService {
  findAll(): Promise<ResponseInventoryDto[]>
  create({ dto, user }: CreateInventoryParam): Promise<InventoryTokens>
}

export interface InventoryController {
  create(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void>
}
