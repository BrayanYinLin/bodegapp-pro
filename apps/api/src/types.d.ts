import { CreateUserDto, LoginUserDto } from './auth/entities/dtos/user.dto'
import { Request, Response } from 'express'

type AuthTokens = {
  access_token: string
  refresh_token: string
}

interface AuthService {
  signup(user: CreateUserDto): Promise<AuthTokens>
  signin(user: LoginUserDto): Promise<AuthTokens>
}

interface AuthController {
  signup(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void>
  signin(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void>
}

export { AuthService, AuthController, AuthTokens }
