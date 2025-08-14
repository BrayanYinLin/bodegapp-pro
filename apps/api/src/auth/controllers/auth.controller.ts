import { CreateUserDto, LoginUserDto } from '@auth/entities/dtos/user.dto'
import { setAuthCookies } from '@auth/lib/set-auth-cookie'
import { AuthServiceImpl } from '@auth/services/auth.service'
import { AuthController } from '@root/types'
import { ERROR_HTTP_CODES, ERROR_NAMES } from '@shared/config/constants'
import { AppError } from '@shared/utils/error-factory'
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

  async logout(_: Request, res: Response): Promise<Response> {
    return res
      .clearCookie('access_token')
      .clearCookie('refresh_token')
      .status(200)
      .json({ message: 'Logout successfully' })
  }

  async callback(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      if (!req.user) {
        throw new AppError({
          code: ERROR_NAMES.AUTHENTICATION,
          httpCode: ERROR_HTTP_CODES.AUTHENTICATION,
          message: 'Email profile was not provided',
          isOperational: true
        })
      }
      const { access_token, refresh_token } =
        await this.authService.callbackGoogle(req.user)

      return setAuthCookies(res, access_token, refresh_token).redirect(
        301,
        '/home'
      )
    } catch (e) {
      console.error(e)
      next(e)
    }
  }
}

export { AuthCtrl }
