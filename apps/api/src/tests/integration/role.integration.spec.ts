import { beforeAll, describe, expect, it } from 'vitest'
import { faker } from '@faker-js/faker'
import { setupSignup } from '@tests/utils/helpers/auth.helper'
import { app } from '@root/main'
import { AppDataSource } from '@shared/database/data-source'
import { authSeed } from '@shared/database/provider.seed'
import request from 'supertest'
import { ResponseInventoryDto } from '@inventories/entities/dtos/inventory.dto'
import { setupInventory } from '@tests/utils/helpers/inventory.helper'
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

describe('Role tests', () => {
  const agent = request.agent(app)
  let inventory: ResponseInventoryDto

  beforeAll(async () => {
    await AppDataSource.initialize()
    await AppDataSource.synchronize()
    await authSeed()
    await setupSignup({ user: sampleUser, agent: agent })
    inventory = await setupInventory({
      inventory: sampleInventory,
      agent: agent
    })
  })

  it('shoud create a new role', async () => {
    const permission = await agent.get(ROUTES.PERMISSION)

    const response = await agent
      .post(ROUTES.INVENTORY.concat('/', inventory.id, '/role'))
      .send({
        name: 'OWNER',
        permissions: permission.body
      })

    expect(response.status).toBe(201)
  })
})
