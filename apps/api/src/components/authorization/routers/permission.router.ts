import { PermissionControllerImpl } from '@authorization/controllers/permission.controller'
import { PermissionController } from '@authorization/permission'
import { Router } from 'express'

const createPermissionRouter = (controller: PermissionController) => {
  const router = Router()

  router.get('/', controller.findAll.bind(controller))

  return router
}

const permissionRouter = createPermissionRouter(new PermissionControllerImpl())

export { permissionRouter }
