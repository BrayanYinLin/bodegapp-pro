import { AuthController } from '@root/types'
import { AuthCtrl } from '@auth/controllers/auth.controller'
import { AuthServiceImpl } from '@auth/services/auth.service'
import { Router } from 'express'
import passport from 'passport'
import { validateMiddleware } from '@shared/middleware/validation-middleware'
import { FindUserEmailSchema } from '@auth/entities/dtos/user.dto'
import { checkAccessMiddleware } from '@shared/middleware/check-access-middleware'

const createAuthRouter = (controller: AuthController) => {
  const authRouter = Router()

  authRouter.get(
    '/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
  )
  authRouter.get(
    '/google/callback',
    passport.authenticate('google', { session: false }),
    controller.callback.bind(controller)
  )
  authRouter.post('/signup', controller.signup.bind(controller))
  authRouter.post('/signin', controller.signin.bind(controller))
  authRouter.get('/logout', controller.logout.bind(controller))
  authRouter.post(
    '/search',
    validateMiddleware(FindUserEmailSchema),
    checkAccessMiddleware(),
    controller.findByEmail.bind(controller)
  )

  return authRouter
}

const authenticationRouter = createAuthRouter(
  new AuthCtrl(new AuthServiceImpl())
)

export { authenticationRouter }
