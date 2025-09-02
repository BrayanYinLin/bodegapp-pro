import { Role } from '@authorization/entities/role.entity'
import { AppDataSource } from './data-source'
import { Permission } from '@authorization/entities/permission.entity'
import { Inventory } from '@inventories/entities/inventory.entity'

const ROLES = {
  ADMIN: 'admin',
  GUEST: 'guest'
} as const

const PERMISSIONS = {
  // Inventario
  EDIT_INVENTORY: 'EDIT_INVENTORY',
  DELETE_INVENTORY: 'DELETE_INVENTORY',
  // Invitacion
  READ_INVITATION: 'READ_INVITATION',
  CREATE_INVITATION: 'CREATE_INVITATION',
  DELETE_INVITATION: 'DELETE_INVITATION',
  // Miembro
  READ_MEMBER: 'READ_MEMBER',
  DELETE_MEMBER: 'DELETE_MEMBER',
  // Producto
  READ_PRODUCT: 'READ_PRODUCT',
  CREATE_PRODUCT: 'CREATE_PRODUCT',
  EDIT_PRODUCT: 'EDIT_PRODUCT',
  DELETE_PRODUCT: 'DELETE_PRODUCT',
  // Movimiento
  READ_MOVEMENT: 'READ_MOVEMENT',
  CREATE_MOVEMENT: 'CREATE_MOVEMENT',
  EDIT_MOVEMENT: 'EDIT_MOVEMENT',
  DELETE_MOVEMENT: 'DELETE_MOVEMENT',
  // Rol
  READ_ROLE: 'READ_ROLE',
  CREATE_ROLE: 'CREATE_ROLE',
  // Categoria
  READ_CATEGORY: 'READ_CATEGORY',
  CREATE_CATEGORY: 'CREATE_CATEGORY',
  EDIT_CATEGORY: 'EDIT_CATEGORY',
  DELETE_CATEGORY: 'DELETE_CATEGORY'
} as const

export type GrantedPermission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS]

const seedAdmin = async (inventory: Inventory) => {
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
      permissions,
      inventory: {
        id: inventory.id
      }
    })
  }
}

export { ROLES, PERMISSIONS, seedAdmin }
