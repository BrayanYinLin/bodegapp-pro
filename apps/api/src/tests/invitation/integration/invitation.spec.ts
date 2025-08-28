import { describe, beforeAll, afterAll, it, expect } from 'vitest'
import request from 'supertest'
import express from 'express'
import { faker } from '@faker-js/faker'
import { AppDataSource } from '@shared/database/data-source'
import { authSeed } from '@shared/database/provider.seed'
import { ROUTES } from '@shared/config/constants'
import { ResponseInventoryDto } from '@inventories/entities/dtos/inventory.dto'
import { ResponseRoleDto } from '@auth/entities/dtos/role.dto'
import { User } from '@auth/entities/user.entity'
import { AuthProvider } from '@auth/entities/auth-provider.entity'
import { Invitation } from '@invitations/entities/invitation.entity'

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

describe('Invitations tests', async () => {
  let agentAdmin: ReturnType<typeof request.agent>
  let agentGuest: ReturnType<typeof request.agent>
  let app: ReturnType<typeof express>
  let inventory: ResponseInventoryDto
  let role: ResponseRoleDto
  let guest: User
  let invitation: Invitation
  const inventories: ResponseInventoryDto[] = []
  const roles: ResponseRoleDto[] = []

  beforeAll(async () => {
    await AppDataSource.initialize()
    await AppDataSource.synchronize()
    await authSeed()

    const module = await import('@root/main')
    app = module.app

    const userRepository = AppDataSource.getRepository(User)
    const localRepository = AppDataSource.getRepository(AuthProvider)
    const local = await localRepository.findOne({
      where: {
        name: 'Local'
      }
    })

    guest = await userRepository.save({
      ...sampleGuest,
      provider: local!
    })

    agentAdmin = request.agent(app)
    agentGuest = request.agent(app)

    await agentAdmin.post(ROUTES.AUTH.concat('/signup')).send(sampleAdmin)
    await agentGuest.post(ROUTES.AUTH.concat('/signin')).send(sampleGuest)

    await agentAdmin.post(ROUTES.INVENTORY).send(sampleInventory)
    const { body: inventoryBody } = await agentAdmin.get(ROUTES.INVENTORY)
    inventories.push(...inventoryBody)
    inventory = inventories[0]

    const { body: roleBody } = await agentAdmin.get(
      ROUTES.INVENTORY.concat('/', inventory.id, '/role')
    )
    roles.push(...roleBody)
    role = roles[0]
  })

  afterAll(async () => {
    await AppDataSource.dropDatabase()
  })

  it('should create an invitation', async () => {
    const response = await agentAdmin
      .post(ROUTES.INVENTORY.concat('/', inventory.id, '/invitation'))
      .send({
        userId: guest.id,
        roleId: role.id
      })

    expect(response.status).toBe(201)
  })

  it('should recover all invitations', async () => {
    const { status, body } = await agentGuest.get(
      ROUTES.INVENTORY.concat('/', inventory.id, '/invitation')
    )

    invitation = body[0]
    expect(status).toBe(200)
  })

  it('should accept', async () => {
    await agentGuest
      .get(
        ROUTES.INVENTORY.concat(
          '/',
          inventory.id,
          '/invitation/',
          invitation.id,
          '/accept'
        )
      )
      .expect(200)
  })
})
