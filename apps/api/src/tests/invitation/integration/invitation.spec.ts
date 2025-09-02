import { describe, beforeAll, afterAll, it, expect } from 'vitest'
import request from 'supertest'
import { hash } from 'bcrypt'

import { AppDataSource } from '@shared/database/data-source'
import { authSeed } from '@shared/database/provider.seed'
import { ROUTES } from '@shared/config/constants'
import { env_bcrypt_salt_rounds } from '@shared/config/environment'

import { ResponseInventoryDto } from '@inventories/entities/dtos/inventory.dto'
import { ResponseRoleDto } from '@auth/entities/dtos/role.dto'
import { User } from '@auth/entities/user.entity'
import { AuthProvider } from '@auth/entities/auth-provider.entity'
import { Invitation } from '@invitations/entities/invitation.entity'
import { app } from '@root/main'
import { fakeUser } from '@root/tests/helpers/fakeUser'
import { fakeInventory } from '@root/tests/helpers/fakeInventory'

describe('Invitations tests', async () => {
  const agentAdmin = request.agent(app)
  const agentGuest = request.agent(app)

  let inventory: ResponseInventoryDto
  let role: ResponseRoleDto
  let guest: User
  let invitationToAccept: Invitation
  let invitationToReject: Invitation

  const sampleAdmin = fakeUser()
  const sampleGuest = fakeUser()
  const sampleInventory = fakeInventory()

  beforeAll(async () => {
    await AppDataSource.initialize()
    await AppDataSource.synchronize()
    await authSeed()

    const local = await AppDataSource.getRepository(AuthProvider).findOneOrFail(
      {
        where: { name: 'Local' }
      }
    )

    const encryptedPassword = await hash(
      sampleGuest.password,
      Number(env_bcrypt_salt_rounds)
    )

    // Crear guest manualmente
    guest = await AppDataSource.getRepository(User).save({
      ...sampleGuest,
      password: encryptedPassword,
      provider: local
    })

    // Autenticar admin y guest
    await agentAdmin.post(ROUTES.AUTH.concat('/signup')).send(sampleAdmin)
    await agentGuest.post(ROUTES.AUTH.concat('/signin')).send(sampleGuest)

    await agentAdmin.post(ROUTES.INVENTORY).send(sampleInventory)
    const { body: inventoryBody } = await agentAdmin.get(ROUTES.INVENTORY)
    inventory = inventoryBody[0]

    // Obtener rol base del inventory
    const { body: roleBody } = await agentAdmin.get(
      `${ROUTES.INVENTORY}/${inventory.id}/role`
    )
    role = roleBody[0]
  })

  afterAll(async () => {
    await AppDataSource.dropDatabase()
  })

  it('should create an invitation', async () => {
    // Crear dos invitaciones distintas
    await agentAdmin
      .post(`${ROUTES.INVENTORY}/${inventory.id}/invitation`)
      .send({ userId: guest.id, roleId: role.id })

    await agentAdmin
      .post(`${ROUTES.INVENTORY}/${inventory.id}/invitation`)
      .send({ userId: guest.id, roleId: role.id })

    // Recuperar invitaciones
    const { body: invitations } = await agentGuest.get(
      `${ROUTES.INVENTORY}/${inventory.id}/invitation`
    )

    invitationToAccept = invitations[0]
    invitationToReject = invitations[1]
  })

  it('should recover all invitations', async () => {
    const { status, body } = await agentGuest.get(
      ROUTES.INVENTORY.concat('/', inventory.id, '/invitation')
    )

    invitationToAccept = body[0]
    invitationToReject = body[1]
    expect(status).toBe(200)
    expect(invitationToAccept).toBeDefined()
    expect(invitationToReject).toBeDefined()
  })

  it('should accept invitation', async () => {
    await agentGuest
      .patch(ROUTES.INVENTORY.concat('/', inventory.id, '/invitation/accept'))
      .send({
        invitationId: invitationToAccept.id
      })
      .expect(204)
  })

  it('should reject invitation', async () => {
    await agentGuest
      .patch(ROUTES.INVENTORY.concat('/', inventory.id, '/invitation/accept'))
      .send({
        invitationId: invitationToReject.id
      })
      .expect(204)
  })
})
