import { InventoryCtrl } from '@inventories/controllers/inventory.controller'
import { InventoryController } from '@inventories/inventory'
import { Router } from 'express'

const createInventoryRouter = (controller: InventoryController) => {
  const router = Router()

  router.post('/', controller.create.bind(controller))

  return router
}

const inventoryRouter = createInventoryRouter(new InventoryCtrl())

export { inventoryRouter }
