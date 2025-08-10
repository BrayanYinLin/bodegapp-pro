import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { faker } from '@faker-js/faker'
import request from 'supertest'
import { app } from '@root/main'
import { AppDataSource } from '@shared/database/data-source'
import { authSeed, authUnseed } from '@shared/database/provider.seed'
import { User } from '@auth/entities/user.entity'

const mockUser = {
  name: faker.person.firstName(),
  email: faker.internet.email(),
  password: faker.internet.password()
}

describe('Authentication Integration Tests', () => {
  beforeAll(async () => {
    await AppDataSource.initialize()
    await AppDataSource.synchronize()
    await authSeed()
  })

  afterAll(async () => {
    const repository = AppDataSource.getRepository(User)

    await repository.delete({ email: mockUser.email })

    await authUnseed()
    await AppDataSource.destroy()
  })

  it('should register a new user', async () => {
    const response = await request(app)
      .post('/api/v1/auth/signup')
      .send(mockUser)

    expect(response.status).toBe(201)
  })

  it('should login as user', async () => {
    const response = await request(app).post('/api/v1/auth/signin').send({
      email: mockUser.email,
      password: mockUser.password
    })

    expect(response.status).toBe(200)
  })
})
