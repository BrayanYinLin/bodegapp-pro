import { CreateUserDto, LoginUserDto } from '@auth/entities/dtos/user.dto'
import { setAuthCookies } from '@auth/lib/set-auth-cookie'
import { AuthServiceImpl } from '@auth/services/auth.service'
import { AuthController } from '@root/types'
import { NextFunction, Request, Response } from 'express'

class AuthCtrl implements AuthController {
  constructor(private readonly authService: AuthServiceImpl) {}

  async signin(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const user = req.body as LoginUserDto
      const { access_token, refresh_token } =
        await this.authService.signin(user)

      return setAuthCookies(res, access_token, refresh_token).status(200).json({
        message: 'Signed in successfully'
      })
    } catch (error) {
      next(error)
    }
  }

  async signup(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const user = req.body as CreateUserDto
      const { access_token, refresh_token } =
        await this.authService.signup(user)

      return setAuthCookies(res, access_token, refresh_token).status(201).json({
        message: 'Signed up successfully'
      })
    } catch (error) {
      next(error)
    }
  }
}

export { AuthCtrl }
