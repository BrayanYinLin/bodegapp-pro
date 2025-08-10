import { AuthController } from '@root/types'
import { AuthCtrl } from '@auth/controllers/auth.controller'
import { AuthServiceImpl } from '@auth/services/auth.service'
import { Router } from 'express'

const createAuthRouter = (controller: AuthController) => {
  const authRouter = Router()

  authRouter.post('/signup', controller.signup.bind(controller))
  authRouter.post('/signin', controller.signin.bind(controller))

  return authRouter
}

const authenticationRouter = createAuthRouter(
  new AuthCtrl(new AuthServiceImpl())
)

export { authenticationRouter }
