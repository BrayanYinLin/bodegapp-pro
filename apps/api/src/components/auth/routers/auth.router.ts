import { AuthController } from '@root/types'
import { AuthCtrl } from '@auth/controllers/auth.controller'
import { AuthServiceImpl } from '@auth/services/auth.service'
import { Router } from 'express'
import passport from 'passport'
import { validateMiddleware } from '@shared/middleware/validation-middleware'
import { FindUserEmailSchema } from '@auth/entities/dtos/user.dto'
import { checkAccessMiddleware } from '@shared/middleware/check-access-middleware'
import { TestEmailService } from '@auth/services/test-email.service'
import { env_node_env } from '@shared/config/environment'
import { ResendService } from '@auth/services/resend.service'
import { VerifyEmailCodeSchema } from '@auth/entities/dtos/authentication-code.dto'

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
  authRouter.post(
    '/verify',
    validateMiddleware(VerifyEmailCodeSchema),
    controller.verify.bind(controller)
  )
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

const emailService = () => {
  return env_node_env === 'development'
    ? new TestEmailService()
    : new ResendService()
}

const authenticationRouter = createAuthRouter(
  new AuthCtrl(new AuthServiceImpl(emailService()))
)

export { authenticationRouter }
