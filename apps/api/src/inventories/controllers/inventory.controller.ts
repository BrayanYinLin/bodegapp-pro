import { CreateInventoryDto } from '@inventories/entities/dtos/inventory.dto'
import { InventoryController } from '@inventories/inventory'
import { InventoryServiceImpl } from '@inventories/services/inventory.service'
import { COOKIE_PARAMS, ROUTES, TOKEN_PARAMS } from '@shared/config/constants'
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
        .cookie('access_inventory', tokens.access_inventory, {
          ...COOKIE_PARAMS,
          maxAge: TOKEN_PARAMS.IAT_DURATION * 1000,
          path: ROUTES.INVENTORY.concat('/', inventory.id)
        })
        .cookie('refresh_inventory', tokens.refresh_inventory, {
          ...COOKIE_PARAMS,
          maxAge: TOKEN_PARAMS.IAT_DURATION * 1000,
          path: ROUTES.INVENTORY.concat('/', inventory.id)
        })
        .status(201)
        .json({ message: 'Inventory created successfully.' })
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
        .cookie('access_inventory', tokens.access_inventory, {
          ...COOKIE_PARAMS,
          maxAge: TOKEN_PARAMS.IAT_DURATION * 1000,
          path: ROUTES.INVENTORY.concat('/', inventory.id)
        })
        .cookie('refresh_inventory', tokens.refresh_inventory, {
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
