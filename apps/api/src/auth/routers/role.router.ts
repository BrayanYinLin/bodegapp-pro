import { RoleCtrl } from '@auth/controllers/role.controller'
import { RoleController } from '@auth/role'
import { PERMISSIONS } from '@shared/database/role.seed'
import { checkPermission } from '@shared/middleware/check-permission-middleware'
import { Router } from 'express'

const createRoleRouter = (controller: RoleController) => {
  const router = Router({ mergeParams: true })

  router.get(
    '/',
    checkPermission(PERMISSIONS.READ_ROLE),
    controller.findAllByInventory.bind(controller)
  )

  return router
}

const roleRouter = createRoleRouter(new RoleCtrl())

export { roleRouter }
