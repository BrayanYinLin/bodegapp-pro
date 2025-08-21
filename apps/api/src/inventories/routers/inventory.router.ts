import { InventoryCtrl } from '@inventories/controllers/inventory.controller'
import { CreateInventorySchema } from '@inventories/entities/dtos/inventory.dto'
import { InventoryController } from '@inventories/inventory'
import { validateMiddleware } from '@shared/middleware/validation-middleware'
import { Router } from 'express'

const createInventoryRouter = (controller: InventoryController) => {
  const router = Router()

  router.post(
    '/',
    validateMiddleware(CreateInventorySchema),
    controller.create.bind(controller)
  )

  return router
}

const inventoryRouter = createInventoryRouter(new InventoryCtrl())

export { inventoryRouter }
