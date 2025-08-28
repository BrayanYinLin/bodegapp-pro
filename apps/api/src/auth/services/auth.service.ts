import { AuthProvider } from '@auth/entities/auth-provider.entity'
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
  env_jwt_secret
} from '@shared/config/environment'
import { AppDataSource } from '@shared/database/data-source'
import { AppError } from '@shared/utils/error-factory'
import { hash, compare } from 'bcrypt'
import { JwtPayload, verify } from 'jsonwebtoken'
import { Profile } from 'passport'

class AuthServiceImpl implements AuthService {
  constructor(
    private readonly repo = AppDataSource.getRepository(User),
    private readonly whiteListRepo = AppDataSource.getRepository(WhiteList)
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

  async signup(user: CreateUserDto): Promise<AuthTokens> {
    const AuthProviderRepository = AppDataSource.getRepository(AuthProvider)
    const { success, data, error } = checkSignUpUserDto(user)

    if (!success || !data) {
      throw new AppError({
        code: 'VALIDATION_ERROR',
        httpCode: 400,
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

    const newUser = await this.repo.save(
      new User({
        name: data.name,
        email: data.email,
        password: encryptedPassword,
        provider: local
      })
    )

    const { token: access_token } = accessToken({
      id: newUser.id
    })

    const { token: refresh_token, payload } = refreshToken({
      id: newUser.id
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
        provider: googleProvider
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
