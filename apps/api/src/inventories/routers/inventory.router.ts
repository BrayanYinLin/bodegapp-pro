import { roleRouter } from '@auth/routers/role.router'
import { InventoryCtrl } from '@inventories/controllers/inventory.controller'
import { CreateInventorySchema } from '@inventories/entities/dtos/inventory.dto'
import { InventoryController } from '@inventories/inventory'
import { invitationRouter } from '@invitations/routers/invitation.router'
import { ROUTES } from '@shared/config/constants'
import { validateMiddleware } from '@shared/middleware/validation-middleware'
import { Router } from 'express'

const createInventoryRouter = (controller: InventoryController) => {
  const router = Router({ mergeParams: true })

  router.use(ROUTES.INVITATION, invitationRouter)
  router.use(ROUTES.ROLE, roleRouter)

  router.post(
    '/',
    validateMiddleware(CreateInventorySchema),
    controller.create.bind(controller)
  )
  router.get('/', controller.findAllByUser.bind(controller))
  router.get('/:inventoryId', controller.findById.bind(controller))
  router.put(
    '/:inventoryId',
    validateMiddleware(CreateInventorySchema),
    controller.edit.bind(controller)
  )

  return router
}

const inventoryRouter = createInventoryRouter(new InventoryCtrl())

export { inventoryRouter }
