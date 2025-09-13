import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { AuthServiceImpl } from '@auth/services/auth.service'
import { faker } from '@faker-js/faker'
import { CreateUserDto, LoginUserDto } from '@auth/entities/dtos/user.dto'
import { AppDataSource } from '@shared/database/data-source'
import { authSeed } from '@shared/database/provider.seed'
import { TestEmailService } from './test-email.service'

type UserDtos = CreateUserDto | LoginUserDto

describe('Authentication Services Tests', () => {
  const service = new AuthServiceImpl(new TestEmailService())

  const dto: CreateUserDto | LoginUserDto = {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password({ length: 8 })
  }

  const casos: UserDtos[] = [
    {
      // Nombre invalido
      name: '',
      email: faker.internet.email(),
      password: faker.internet.password({ length: 8 })
    },
    {
      // Email invalido
      name: faker.person.fullName(),
      email: faker.internet.domainName(),
      password: faker.internet.password({ length: 8 })
    },
    {
      // Email invalido
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password({ length: 6 })
    }
  ]

  beforeAll(async () => {
    await AppDataSource.initialize()
    await AppDataSource.synchronize()
    await authSeed()
  })

  afterAll(async () => {
    await AppDataSource.dropDatabase()
  })

  it('should sign up user successfully', async () => {
    const registeredUser = await service.signup(dto)

    expect(registeredUser).toHaveProperty('access_token')
    expect(registeredUser).toHaveProperty('refresh_token')
  })

  it('should sign in user successfully', async () => {
    const registeredUser = await service.signin(dto)

    expect(registeredUser).toHaveProperty('access_token')
    expect(registeredUser).toHaveProperty('refresh_token')
  })

  it('should throw an error by invalid name', async () => {
    await expect(service.signup(casos[0] as CreateUserDto)).rejects.toThrow()
    await expect(service.signin(casos[0] as LoginUserDto)).rejects.toThrow()
  })

  it('should throw an error by invalid email', async () => {
    await expect(service.signup(casos[1] as CreateUserDto)).rejects.toThrow()
    await expect(service.signin(casos[1] as LoginUserDto)).rejects.toThrow()
  })

  it('should throw an error by invalid password', async () => {
    await expect(service.signup(casos[2] as CreateUserDto)).rejects.toThrow()
    await expect(service.signin(casos[2] as LoginUserDto)).rejects.toThrow()
  })
})
