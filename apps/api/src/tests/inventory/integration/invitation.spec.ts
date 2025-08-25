import { faker } from '@faker-js/faker'
import { AppDataSource } from '@shared/database/data-source'
import { authSeed } from '@shared/database/provider.seed'
import { seedAdmin } from '@shared/database/role.seed'
import { beforeAll, describe, it, expect } from 'vitest'
import express from 'express'
import request from 'supertest'
import { ROUTES } from '@shared/config/constants'
import { User } from '@auth/entities/user.entity'
import {
  ResponseInventoryDto,
  ResponseInventorySchema
} from '@inventories/entities/dtos/inventory.dto'

const sampleAdmin = {
  name: faker.person.firstName(),
  email: faker.internet.email(),
  password: faker.internet.password({ length: 10 })
}

const sampleGuest = {
  name: faker.person.firstName(),
  email: faker.internet.email(),
  password: faker.internet.password({ length: 10 })
}

const sampleInventory = {
  name: faker.company.name(),
  description: faker.company.catchPhrase()
}

let app: ReturnType<typeof express>
describe('Invitations tests', async () => {
  let agent: ReturnType<typeof request.agent>
  let guest: User
  const inventories: ResponseInventoryDto[] = []

  beforeAll(async () => {
    await AppDataSource.initialize()
    await AppDataSource.synchronize()
    await authSeed()
    await seedAdmin()

    const userRepository = AppDataSource.getRepository(User)

    const module = await import('@root/main')
    app = module.app
    agent = request.agent(app)

    await agent.post(ROUTES.AUTH.concat('/signup')).send(sampleAdmin)
    guest = await userRepository.save(sampleGuest)
  })

  it('should create an inventory', async () => {
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

  it('should create an invitation', async () => {
    const [inventory] = inventories
    const response = await agent
      .post(ROUTES.INVENTORY.concat('/', inventory.id, '/invitation'))
      .send({
        userId: guest.id
      })

    expect(response.status).toBe(201)
  })
})
