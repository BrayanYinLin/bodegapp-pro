import { Role } from '@auth/entities/role.entity'
import { AppDataSource } from './data-source'
import { Permission } from '@auth/entities/permission.entity'

const ROLES = {
  ADMIN: 'admin',
  GUEST: 'guest'
} as const

const PERMISSIONS = {
  EDIT_INVENTORY: 'EDIT_INVENTORY',
  DELETE_INVENTORY: 'DELETE_INVENTORY',
  CREATE_INVITATION: 'CREATE_INVITATION',
  DELETE_INVITATION: 'DELETE_INVITATION',
  DELETE_MEMBER: 'DELETE_MEMBER',
  READ_PRODUCT: 'READ_PRODUCT',
  EDIT_PRODUCT: 'EDIT_PRODUCT',
  DELETE_PRODUCT: 'DELETE_PRODUCT',
  CREATE_MOVEMENT: 'CREATE_MOVEMENT',
  EDIT_MOVEMENT: 'EDIT_MOVEMENT',
  DELETE_MOVEMENT: 'DELETE_MOVEMENT',
  CREATE_ROLE: 'CREATE_ROLE',
  CREATE_CATEGORY: 'CREATE_CATEGORY',
  EDIT_CATEGORY: 'EDIT_CATEGORY',
  DELETE_CATEGORY: 'DELETE_CATEGORY'
} as const

const seedAdmin = async () => {
  const roleRepository = AppDataSource.getRepository(Role)
  const permissionRepository = AppDataSource.getRepository(Permission)
  const permissions: Permission[] = []

  for (const permission of Object.values(PERMISSIONS)) {
    const existingPermission = await permissionRepository.findOne({
      where: {
        description: permission
      }
    })

    if (existingPermission) {
      permissions.push(existingPermission)
      continue
    }

    const permissionCreated = await permissionRepository.save({
      description: permission
    })

    permissions.push(permissionCreated)
  }

  const existing = await roleRepository.findOne({
    where: {
      name: ROLES.ADMIN
    }
  })

  if (!existing) {
    await roleRepository.save({
      name: ROLES.ADMIN,
      permissions
    })
  }
}

export { ROLES, PERMISSIONS, seedAdmin }
