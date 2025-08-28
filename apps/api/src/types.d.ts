import {
  CreateUserDto,
  FindUserEmailDto,
  LoginUserDto,
  ResponseUserIdDto
} from './auth/entities/dtos/user.dto'
import { Request, Response } from 'express'
import { Profile } from 'passport-google-oauth20'

interface AuthTokens {
  access_token: string
  refresh_token: string
}

declare global {
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface User extends Profile {}
  }
}

interface AuthService {
  signup(user: CreateUserDto): Promise<AuthTokens>
  signin(user: LoginUserDto): Promise<AuthTokens>
  callbackGoogle(profile: Profile): Promise<AuthTokens>
  findByEmail(user: FindUserEmailDto): Promise<ResponseUserIdDto>
  refresh(token: string): Promise<AuthTokens>
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
  logout(req: Request, res: Response): Promise<Response>
  callback(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void>
  findByEmail(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void>
  refresh(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void>
}

export { AuthService, AuthController, AuthTokens }
