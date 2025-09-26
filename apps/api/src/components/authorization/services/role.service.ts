import { ResponseRoleDto, ResponseRoleSchema } from '../entities/dtos/role.dto'
import { Role } from '@authorization/entities/role.entity'
import {
  CreateRolParams,
  RoleByInventoryParam,
  RoleService
} from '@authorization/role'
import { ERROR_HTTP_CODES, ERROR_NAMES } from '@shared/config/constants'
import { AppDataSource } from '@shared/database/data-source'
import { AppError } from '@shared/utils/error-factory'

class RoleServiceImpl implements RoleService {
  constructor(
    private readonly roleRepository = AppDataSource.getRepository(Role)
  ) {}

  async create({ inventoryId, roleDto }: CreateRolParams): Promise<boolean> {
    const created = await this.roleRepository.save({
      name: roleDto.name,
      permissions: roleDto.permissions,
      inventory: {
        id: inventoryId
      }
    })

    return Boolean(created)
  }

  async findAllByInventory({
    inventoryId
  }: RoleByInventoryParam): Promise<ResponseRoleDto[]> {
    const roles = await this.roleRepository.find({
      where: {
        inventory: {
          id: inventoryId
        }
      },
      relations: ['inventory', 'permissions']
    })

    const rolesMapped = roles.map((role) => {
      const { success, data, error } = ResponseRoleSchema.safeParse(role)

      if (!success || error) {
        throw new AppError({
          code: ERROR_NAMES.VALIDATION,
          httpCode: ERROR_HTTP_CODES.VALIDATION,
          message: 'Error validation roles.',
          isOperational: true
        })
      }

      return data
    })

    return rolesMapped
  }
}

export { RoleServiceImpl }
