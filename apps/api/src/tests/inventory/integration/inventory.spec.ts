import { AppDataSource } from '@shared/database/data-source'
import { authSeed } from '@shared/database/provider.seed'
import { seedAdmin } from '@shared/database/role.seed'
import { describe, beforeAll, it, expect, vi } from 'vitest'
import express from 'express'
import request from 'supertest'
import { passportMock } from '@root/tests/mocks/passport'
import { faker } from '@faker-js/faker'

const sampleUser = {
  name: faker.person.firstName(),
  email: faker.internet.email(),
  password: faker.internet.password({ length: 10 })
}

const sampleInventory = {
  name: faker.company.name(),
  description: faker.company.catchPhrase()
}

vi.mock('passport', () => {
  return {
    default: passportMock
  }
})

let app: ReturnType<typeof express>
describe('Inventory tests', () => {
  let agent: ReturnType<typeof request.agent>

  beforeAll(async () => {
    await AppDataSource.initialize()
    await AppDataSource.synchronize()
    await authSeed()
    await seedAdmin()

    const module = await import('@root/main')
    app = module.app
    agent = request.agent(app)

    await agent.post('/api/v1/auth/signup').send(sampleUser)
  })

  it('should create a new inventory', async () => {
    const response = await agent.post('/api/v1/inventory').send(sampleInventory)

    const cookie = response.headers['set-cookie']

    expect(cookie).toBeDefined()
    expect(cookie[0]).toMatch(/access_inventory_/)
    expect(cookie[1]).toMatch(/refresh_inventory_/)
  })
})
