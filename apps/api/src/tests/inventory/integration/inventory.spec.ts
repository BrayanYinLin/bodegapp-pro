import { AppDataSource } from '@shared/database/data-source'
import { authSeed } from '@shared/database/provider.seed'
import { describe, beforeAll, it, expect, vi, afterAll } from 'vitest'
import express from 'express'
import request from 'supertest'
import { passportMock } from '@root/tests/mocks/passport'
import { faker } from '@faker-js/faker'
import {
  ResponseInventoryDto,
  ResponseInventorySchema
} from '@inventories/entities/dtos/inventory.dto'
import { ROUTES } from '@shared/config/constants'

const sampleUser = {
  name: faker.person.firstName(),
  email: faker.internet.email(),
  password: faker.internet.password({ length: 10 })
}

const sampleInventory = {
  name: faker.company.name(),
  description: faker.company.catchPhrase()
}

const inventories: ResponseInventoryDto[] = []

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

    const module = await import('@root/main')
    app = module.app
    agent = request.agent(app)

    await agent.post('/api/v1/auth/signup').send(sampleUser)
  })

  afterAll(async () => {
    await AppDataSource.dropDatabase()
    await AppDataSource.destroy()
  })

  it('should create a new inventory', async () => {
    const response = await agent.post(ROUTES.INVENTORY).send(sampleInventory)

    const cookie = response.headers['set-cookie']

    expect(cookie).toBeDefined()
    expect(cookie[0]).toMatch(/access_inventory/)
    expect(cookie[1]).toMatch(/refresh_inventory/)
  })

  it('should return all inventories by user logged', async () => {
    const response = await agent.get(ROUTES.INVENTORY)

    expect(response.status).toBe(200)
    expect(response.body).toBeTypeOf('object')
    expect(() =>
      ResponseInventorySchema.array().parse(response.body)
    ).not.toThrow()

    inventories.push(...response.body)
  })

  it('should return inventory data and access tokens', async () => {
    const response = await agent.get(
      ROUTES.INVENTORY.concat('/', inventories[0].id)
    )

    const cookie = response.headers['set-cookie']

    expect(() => ResponseInventorySchema.parse(response.body)).not.toThrow()
    expect(cookie).toBeDefined()
    expect(cookie[0]).toMatch(/access_inventory/)
    expect(cookie[1]).toMatch(/refresh_inventory/)
  })

  it('should update basic data about an inventory', async () => {
    const response = await agent
      .put(ROUTES.INVENTORY.concat('/', inventories[0].id))
      .send({
        name: faker.company.name(),
        description: faker.company.catchPhrase()
      })

    expect(response.status).toBe(200)
  })
})
