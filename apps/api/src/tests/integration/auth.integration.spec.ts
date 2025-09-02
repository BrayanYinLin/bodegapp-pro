import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import { faker } from '@faker-js/faker'
import request from 'supertest'
import { AppDataSource } from '@shared/database/data-source'
import { authSeed, authUnseed } from '@shared/database/provider.seed'
import { User } from '@auth/entities/user.entity'
import { passportMock } from '@root/tests/utils/mocks/passport'

const mockUser = {
  name: faker.person.firstName(),
  email: faker.internet.email(),
  password: faker.internet.password({ length: 10 })
}

vi.mock('passport', () => {
  return {
    default: passportMock
  }
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let app: any

describe('Authentication Integration Tests', () => {
  beforeAll(async () => {
    await AppDataSource.initialize()
    await AppDataSource.synchronize()
    const mod = await import('@root/main')
    app = mod.app
    await authSeed()
  })

  afterAll(async () => {
    const repository = AppDataSource.getRepository(User)
    await repository.deleteAll()

    await authUnseed()
    await AppDataSource.destroy()
  })

  it('should signup a new user', async () => {
    const response = await request(app)
      .post('/api/v1/auth/signup')
      .send(mockUser)

    expect(response.status).toBe(201)
  })

  it('should signin as user', async () => {
    const response = await request(app).post('/api/v1/auth/signin').send({
      email: mockUser.email,
      password: mockUser.password
    })

    expect(response.status).toBe(200)
  })

  it('should logout user', async () => {
    const response = await request(app).get('/api/v1/auth/logout')

    expect(response.status).toBe(200)
  })

  it('responde con el perfil de usuario mockeado', async () => {
    const res = await request(app).get('/api/v1/auth/google/callback')

    expect(res.status).toBe(301)
  })
})
