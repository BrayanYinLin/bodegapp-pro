import { AppDataSource } from '@shared/database/data-source'
import { seedPermissions } from '@shared/database/role.seed'
import { describe, beforeAll, afterAll, it, expect } from 'vitest'
import { PermissionServiceImpl } from './permission.service'
import z from 'zod'
import { ResponsePermissionSchema } from '@authorization/entities/dtos/permission.dto'

describe('Permission service tests', () => {
  const permissionService = new PermissionServiceImpl()

  beforeAll(async () => {
    await AppDataSource.initialize()
    await AppDataSource.synchronize()
    await seedPermissions()
  })

  afterAll(async () => {
    await AppDataSource.dropDatabase()
  })

  it('should return all permissions', async () => {
    const permissions = await permissionService.findAll()

    expect(() =>
      z.array(ResponsePermissionSchema).parse(permissions)
    ).not.throw()
  })
})
