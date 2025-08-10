import { AuthProvider } from '@auth/entities/auth-provider.entity'
import {
  checkSigninUserDto,
  checkSignUpUserDto,
  CreateUserDto,
  LoginUserDto
} from '@auth/entities/dtos/user.dto'
import { User } from '@auth/entities/user.entity'
import {
  generateAccessToken,
  generateRefreshToken
} from '@auth/lib/generate-tokens'
import { AuthService, AuthTokens } from '@root/types'
import { env_bcrypt_salt_rounds } from '@shared/config/environment'
import { AppDataSource } from '@shared/database/data-source'
import { AppError } from '@shared/utils/error-factory'
import { hash, compare } from 'bcrypt'

class AuthServiceImpl implements AuthService {
  async signin(user: LoginUserDto): Promise<AuthTokens> {
    const repository = AppDataSource.getRepository(User)
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

    const foundUser = await repository.findOne({
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

    const access_token = generateAccessToken({
      id: foundUser.id
    })

    const refresh_token = generateRefreshToken({
      id: foundUser.id
    })

    return {
      access_token,
      refresh_token
    }
  }
  async signup(user: CreateUserDto): Promise<AuthTokens> {
    const repository = AppDataSource.getRepository(User)
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

    const newUser = await repository.save(
      new User({
        name: data.name,
        email: data.email,
        password: encryptedPassword,
        provider: local
      })
    )

    const access_token = generateAccessToken({
      id: newUser.id
    })

    const refresh_token = generateRefreshToken({
      id: newUser.id
    })

    return {
      access_token,
      refresh_token
    }
  }
}

export { AuthServiceImpl }
