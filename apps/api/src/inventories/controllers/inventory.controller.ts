import { CreateInventoryDto } from '@inventories/entities/dtos/inventory.dto'
import { InventoryController } from '@inventories/inventory'
import { InventoryServiceImpl } from '@inventories/services/inventory.service'
import { COOKIE_PARAMS, TOKEN_PARAMS } from '@shared/config/constants'
import { decodeUser } from '@shared/utils/decode-user'
import { NextFunction, Request, Response } from 'express'

export class InventoryCtrl implements InventoryController {
  constructor(private readonly service = new InventoryServiceImpl()) {}

  async create(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const sub = decodeUser(req.cookies.access_token)
      const tokens = await this.service.create({
        dto: req.body as CreateInventoryDto,
        sub
      })

      const [accessKey, refreshKey] = Object.keys(tokens)
      const [accessVal, refreshVal] = Object.values(tokens)

      return res
        .cookie(accessKey, accessVal, {
          ...COOKIE_PARAMS,
          maxAge: TOKEN_PARAMS.IAT_DURATION * 1000,
          path: '/'
        })
        .cookie(refreshKey, refreshVal, {
          ...COOKIE_PARAMS,
          maxAge: TOKEN_PARAMS.IAT_DURATION * 1000,
          path: '/'
        })
        .status(201)
        .json({ message: 'Inventory created successfully.' })
    } catch (e) {
      next(e)
    }
  }
}
