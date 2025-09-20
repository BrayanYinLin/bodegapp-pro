import {
  CreateUserDto,
  FindUserEmailDto,
  LoginUserDto
} from '@auth/entities/dtos/user.dto'
import { setAuthCookies } from '@auth/lib/set-auth-cookie'
import { AuthServiceImpl } from '@auth/services/auth.service'
import { AuthController } from '@root/types'
import {
  COOKIE_NAMES,
  ERROR_HTTP_CODES,
  ERROR_NAMES
} from '@shared/config/constants'
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
      await this.authService.signup(user)

      return res.status(204).end()
    } catch (error) {
      next(error)
    }
  }

  async verify(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const { access_token, refresh_token } =
        await this.authService.verifyEmail(req.body.code)

      return setAuthCookies(res, access_token, refresh_token).status(200).json({
        message: 'Signed in successfully'
      })
    } catch (e) {
      next(e)
    }
  }

  async logout(_: Request, res: Response): Promise<Response> {
    return res
      .clearCookie(COOKIE_NAMES.ACCESS_TOKEN)
      .clearCookie(COOKIE_NAMES.REFRESH_TOKEN)
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

  async findByEmail(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const found = await this.authService.findByEmail(
        req.body as FindUserEmailDto
      )

      return res.json(found)
    } catch (e) {
      next(e)
    }
  }

  async refresh(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const { access_token, refresh_token } = await this.authService.refresh(
        req.cookies.refresh_token
      )

      return setAuthCookies(res, access_token, refresh_token).json({
        message: 'Token refreshed'
      })
    } catch (e) {
      next(e)
    }
  }
}

export { AuthCtrl }
