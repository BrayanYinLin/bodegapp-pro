import { EmailService } from '@auth/auth'
import { AuthProvider } from '@auth/entities/auth-provider.entity'
import { AuthenticationCode } from '@auth/entities/authentication-code.entity'
import {
  checkSigninUserDto,
  checkSignUpUserDto,
  CreateUserDto,
  FindUserEmailDto,
  LoginUserDto,
  ResponseUserIdDto
} from '@auth/entities/dtos/user.dto'
import { User } from '@auth/entities/user.entity'
import { WhiteList } from '@auth/entities/white-list.entity'
import { accessToken, refreshToken } from '@auth/lib/generate-tokens'
import { AuthService, AuthTokens } from '@root/types'
import { ERROR_HTTP_CODES, ERROR_NAMES } from '@shared/config/constants'
import {
  env_bcrypt_salt_rounds,
  env_email_sender,
  env_jwt_secret
} from '@shared/config/environment'
import { AppDataSource } from '@shared/database/data-source'
import { AppError } from '@shared/utils/error-factory'
import { hash, compare } from 'bcrypt'
import { JwtPayload, verify } from 'jsonwebtoken'
import { UUID } from 'node:crypto'
import { Profile } from 'passport'

class AuthServiceImpl implements AuthService {
  constructor(
    private emailService: EmailService,
    private readonly repo = AppDataSource.getRepository(User),
    private readonly whiteListRepo = AppDataSource.getRepository(WhiteList),
    private readonly authenticationCodeRepo = AppDataSource.getRepository(
      AuthenticationCode
    )
  ) {}

  async signin(user: LoginUserDto): Promise<AuthTokens> {
    const { success, data, error } = checkSigninUserDto(user)

    if (!success || !data) {
      throw new AppError({
        code: 'VALIDATION_ERROR',
        httpCode: 400,
        message: 'Invalid user data',
        isOperational: true,
        details: error
      })
    }

    const foundUser = await this.repo.findOne({
      where: { email: data.email },
      relations: {
        provider: true
      }
    })

    if (!foundUser) {
      throw new AppError({
        code: 'NOT_FOUND_ERROR',
        httpCode: 404,
        message: 'User not found',
        isOperational: true
      })
    }

    const isPasswordValid = await compare(data.password, foundUser.password!)

    if (!isPasswordValid) {
      throw new AppError({
        code: 'AUTHENTICATION_ERROR',
        httpCode: 401,
        message: 'Invalid email or password',
        isOperational: true
      })
    }

    if (!foundUser.validatedAccount) {
      throw new AppError({
        code: ERROR_NAMES.AUTHENTICATION,
        httpCode: 401,
        message: 'User not validated',
        isOperational: true
      })
    }

    const { token: access_token } = accessToken({
      id: foundUser.id
    })

    const { token: refresh_token, payload } = refreshToken({
      id: foundUser.id
    })

    await this.whiteListRepo.save({
      jti: payload.jti,
      sub: payload.sub
    })

    return {
      access_token,
      refresh_token
    }
  }

  async signup(user: CreateUserDto): Promise<void> {
    if (!env_email_sender) {
      throw new AppError({
        code: ERROR_NAMES.INTERNAL,
        httpCode: ERROR_HTTP_CODES.INTERNAL,
        message: 'email sender not configured',
        isOperational: false
      })
    }

    const AuthProviderRepository = AppDataSource.getRepository(AuthProvider)
    const { success, data, error } = checkSignUpUserDto(user)

    if (!success || !data) {
      throw new AppError({
        code: ERROR_NAMES.VALIDATION,
        httpCode: ERROR_HTTP_CODES.VALIDATION,
        message: 'Invalid user data',
        isOperational: true,
        details: error
      })
    }

    const local = await AuthProviderRepository.findOne({
      where: { name: 'Local' }
    })

    if (!local) {
      throw new AppError({
        code: 'NOT_FOUND_ERROR',
        httpCode: 404,
        message: 'Local auth provider not found',
        isOperational: true
      })
    }

    const encryptedPassword = await hash(
      data.password,
      Number(env_bcrypt_salt_rounds)
    )

    const newUser = await this.repo.save({
      name: data.name,
      email: data.email,
      password: encryptedPassword,
      provider: local,
      validatedAccount: false
    })
    this.emailService.sendVerificationEmail(env_email_sender, newUser)
  }

  async verifyEmail(code: UUID): Promise<AuthTokens> {
    try {
      const authentication = await this.authenticationCodeRepo.findOne({
        where: {
          code: code
        },
        relations: ['user']
      })

      if (!authentication) {
        throw new AppError({
          code: ERROR_NAMES.NOT_FOUND,
          httpCode: ERROR_HTTP_CODES.NOT_FOUND,
          isOperational: true,
          message: 'Code not found'
        })
      }

      await this.repo.update(
        { id: authentication.user.id },
        { validatedAccount: true }
      )

      const updatedUser = await this.repo.findOne({
        where: { id: authentication.user.id }
      })

      if (!updatedUser) {
        throw new AppError({
          code: ERROR_NAMES.NOT_FOUND,
          httpCode: ERROR_HTTP_CODES.NOT_FOUND,
          isOperational: true,
          message: 'User not found'
        })
      }

      if (!updatedUser.validatedAccount) {
        throw new AppError({
          code: ERROR_NAMES.AUTHENTICATION,
          httpCode: ERROR_HTTP_CODES.AUTHENTICATION,
          isOperational: true,
          message: 'User not validated'
        })
      }

      const { token: access_token } = accessToken({
        id: updatedUser.id
      })

      const { token: refresh_token, payload } = refreshToken({
        id: updatedUser.id
      })

      await this.whiteListRepo.save({
        jti: payload.jti,
        sub: payload.sub
      })

      return {
        access_token,
        refresh_token
      }
    } catch (e) {
      throw new Error((e as Error).message)
    }
  }

  async callbackGoogle(profile: Profile): Promise<AuthTokens> {
    const providerRepository = AppDataSource.getRepository(AuthProvider)

    if (!profile.emails) {
      throw new AppError({
        code: ERROR_NAMES.NOT_FOUND,
        httpCode: ERROR_HTTP_CODES.NOT_FOUND,
        message: 'Email was not found',
        isOperational: true
      })
    }

    const email = profile?.emails[0].value

    const existingUser = await this.repo.findOne({
      where: {
        email
      }
    })

    const googleProvider = await providerRepository.findOne({
      where: {
        name: 'Google'
      }
    })

    if (!googleProvider) {
      throw new AppError({
        code: ERROR_NAMES.NOT_FOUND,
        httpCode: ERROR_HTTP_CODES.NOT_FOUND,
        message: 'Google provider not found',
        isOperational: true
      })
    }

    let userRecord = existingUser
    if (!existingUser) {
      userRecord = await this.repo.save({
        name: profile.displayName,
        email: profile.emails[0].value,
        provider: googleProvider,
        validatedAccount: true
      })
    }

    if (!userRecord) {
      throw new AppError({
        code: ERROR_NAMES.NOT_FOUND,
        httpCode: ERROR_HTTP_CODES.NOT_FOUND,
        message: 'User not found',
        isOperational: true
      })
    }

    const { token: access_token } = accessToken({
      id: userRecord.id
    })

    const { token: refresh_token, payload } = refreshToken({
      id: userRecord.id
    })

    await this.whiteListRepo.save({
      jti: payload.jti,
      sub: payload.sub
    })

    return {
      access_token,
      refresh_token
    }
  }

  async findByEmail({ email }: FindUserEmailDto): Promise<ResponseUserIdDto> {
    const user = await this.repo.findOne({
      where: {
        email
      }
    })

    if (!user) {
      throw new AppError({
        code: ERROR_NAMES.NOT_FOUND,
        httpCode: ERROR_HTTP_CODES.NOT_FOUND,
        message: 'User not found by email.',
        isOperational: true
      })
    }

    return {
      userId: user.id
    }
  }

  async refresh(token: string): Promise<AuthTokens> {
    if (!token) {
      throw new AppError({
        code: ERROR_NAMES.AUTHENTICATION,
        httpCode: ERROR_HTTP_CODES.AUTHENTICATION,
        message: 'Missing refresh token.',
        isOperational: true
      })
    }

    if (!env_jwt_secret) {
      throw new AppError({
        code: ERROR_NAMES.INTERNAL,
        httpCode: ERROR_HTTP_CODES.INTERNAL,
        message: 'Missing jwt secret to sign.',
        isOperational: true
      })
    }

    const { jti, sub } = verify(token, env_jwt_secret) as JwtPayload

    if (!jti || !sub) {
      throw new AppError({
        code: ERROR_NAMES.INTERNAL,
        httpCode: ERROR_HTTP_CODES.INTERNAL,
        message: 'Error decoding jwt.',
        isOperational: true
      })
    }

    const whiteList = await this.whiteListRepo.findOne({
      where: {
        jti: jti
      }
    })

    if (!whiteList) {
      throw new AppError({
        code: ERROR_NAMES.AUTHENTICATION,
        httpCode: ERROR_HTTP_CODES.AUTHENTICATION,
        message: 'Invalid refresh token.',
        isOperational: true
      })
    }

    const { token: access_token } = accessToken({ id: sub })
    const { token: refresh_token, payload } = refreshToken({ id: sub })

    await this.whiteListRepo
      .createQueryBuilder()
      .update(WhiteList)
      .set({ jti: payload.jti })
      .where('id = :id', { id: whiteList.id })
      .execute()

    return {
      access_token,
      refresh_token
    }
  }
}

export { AuthServiceImpl }
