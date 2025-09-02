import { AppDataSource } from '@shared/database/data-source'
import { describe, beforeAll, afterAll, it, expect } from 'vitest'
import { RoleServiceImpl } from './role.service'
import { fakeUser } from '@tests/utils/factories/user.factory'
import { fakeInventory } from '@tests/utils/factories/inventory.factory'
import { InventoryServiceImpl } from '@inventories/services/inventory.service'
import { User } from '@auth/entities/user.entity'
import { AuthProvider } from '@auth/entities/auth-provider.entity'
import { Inventory } from '@inventories/entities/inventory.entity'
import {
  ResponseRoleDto,
  ResponseRoleSchema
} from '@authorization/entities/dtos/role.dto'
import z from 'zod'
import { authSeed } from '@shared/database/provider.seed'

describe('Rolen service tests', () => {
  const inventoryService = new InventoryServiceImpl()
  const roleService = new RoleServiceImpl()

  const sampleUser = fakeUser()
  const sampleInventory = fakeInventory()

  let user: User
  let inventory: Inventory

  beforeAll(async () => {
    await AppDataSource.initialize()
    await AppDataSource.synchronize()
    await authSeed()

    const provider = await AppDataSource.getRepository(
      AuthProvider
    ).findOneOrFail({
      where: {
        name: 'Local'
      }
    })

    user = await AppDataSource.getRepository(User).save({
      ...sampleUser,
      provider: provider
    })

    await inventoryService.create({
      dto: sampleInventory,
      sub: user.id
    })

    inventory = await AppDataSource.getRepository(Inventory).findOneOrFail({
      where: {
        name: sampleInventory.name
      }
    })
  })

  afterAll(async () => {
    await AppDataSource.dropDatabase()
  })

  it('should return all roles by inventory', async () => {
    const inventories: ResponseRoleDto[] = await roleService.findAllByInventory(
      {
        inventoryId: inventory.id
      }
    )

    expect(() => z.array(ResponseRoleSchema).parse(inventories)).not.throw()
  })
})
