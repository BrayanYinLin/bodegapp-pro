import { CreateInventoryDto } from '@inventories/entities/dtos/inventory.dto'
import { InventoryController } from '@inventories/inventory'
import { decodeAccess } from '@inventories/lib/decode-access'
import { InventoryServiceImpl } from '@inventories/services/inventory.service'
import {
  COOKIE_NAMES,
  COOKIE_PARAMS,
  ROUTES,
  TOKEN_PARAMS
} from '@shared/config/constants'
import { decodeUser } from '@shared/utils/decode-user'
import { NextFunction, Request, Response } from 'express'

export class InventoryCtrl implements InventoryController {
  constructor(private readonly service = new InventoryServiceImpl()) {}

  async findAllByUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const sub = decodeUser(req.cookies.access_token)
      const inventories = await this.service.findAllByUser({ sub })

      return res.json(inventories)
    } catch (e) {
      next(e)
    }
  }

  async create(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const sub = decodeUser(req.cookies.access_token)
      const { inventory, tokens } = await this.service.create({
        dto: req.body as CreateInventoryDto,
        sub
      })

      return res
        .cookie(COOKIE_NAMES.INVENTORY_ACCESS, tokens.access_inventory, {
          ...COOKIE_PARAMS,
          maxAge: TOKEN_PARAMS.IAT_DURATION * 1000,
          path: ROUTES.INVENTORY.concat('/', inventory.id)
        })
        .cookie(COOKIE_NAMES.INVENTORY_REFRESH, tokens.refresh_inventory, {
          ...COOKIE_PARAMS,
          maxAge: TOKEN_PARAMS.IAT_DURATION * 1000,
          path: ROUTES.INVENTORY.concat('/', inventory.id)
        })
        .status(201)
        .json(inventory)
    } catch (e) {
      next(e)
    }
  }

  async edit(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const { inventoryId } = req.params
      const { role } = decodeAccess(req.cookies.access_inventory)
      await this.service.edit({
        dto: req.body as CreateInventoryDto,
        inventoryId: String(inventoryId),
        role
      })

      return res.status(200).end()
    } catch (e) {
      next(e)
    }
  }

  async findById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const { inventoryId } = req.params
      const sub = decodeUser(req.cookies.access_token)
      const { inventory, tokens } = await this.service.findById({
        sub,
        id: String(inventoryId)
      })

      return res
        .cookie(COOKIE_NAMES.INVENTORY_ACCESS, tokens.access_inventory, {
          ...COOKIE_PARAMS,
          maxAge: TOKEN_PARAMS.IAT_DURATION * 1000,
          path: ROUTES.INVENTORY.concat('/', inventory.id)
        })
        .cookie(COOKIE_NAMES.INVENTORY_REFRESH, tokens.refresh_inventory, {
          ...COOKIE_PARAMS,
          maxAge: TOKEN_PARAMS.IAT_DURATION * 1000,
          path: ROUTES.INVENTORY.concat('/', inventory.id)
        })
        .json(inventory)
    } catch (e) {
      next(e)
    }
  }
}
