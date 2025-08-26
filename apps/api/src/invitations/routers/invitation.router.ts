import { InvitationCtrl } from '@invitations/controllers/invitation.controller'
import { InviteUserSchema } from '@invitations/entities/dtos/invitation.dto'
import { InvitationController } from '@invitations/invitation'
import { validateMiddleware } from '@shared/middleware/validation-middleware'
import { Router } from 'express'

const createInvitationRouter = (controller: InvitationController) => {
  const router = Router({ mergeParams: true })

  router.post(
    '/',
    validateMiddleware(InviteUserSchema),
    controller.create.bind(controller)
  )
  router.get('/', controller.findAllByUser.bind(controller))

  return router
}

const invitationRouter = createInvitationRouter(new InvitationCtrl())

export { invitationRouter }
