import { Role } from '@auth/entities/role.entity'
import { User } from '@auth/entities/user.entity'
import {
  ResponseInventoryDto,
  CreateInventorySchema
} from '@inventories/entities/dtos/inventory.dto'
import { Inventory } from '@inventories/entities/inventory.entity'
import {
  CreateInventoryParam,
  InventoryService,
  InventoryTokens
} from '@inventories/inventory'
import {
  generateInventoryAccessToken,
  generateInventoryRefreshToken
} from '@inventories/lib/generate-tokens'
import { sanitizeInventoryName } from '@inventories/lib/sanitize-names'
import { Member } from '@members/entities/member.entity'
import { ERROR_HTTP_CODES, ERROR_NAMES } from '@shared/config/constants'
import { AppDataSource } from '@shared/database/data-source'
import { ROLES } from '@shared/database/role.seed'
import { AppError } from '@shared/utils/error-factory'

export class InventoryServiceImpl implements InventoryService {
  constructor(
    private readonly repository = AppDataSource.getRepository(Inventory),
    private readonly memberRepository = AppDataSource.getRepository(Member),
    private readonly userRepository = AppDataSource.getRepository(User),
    private readonly roleRepository = AppDataSource.getRepository(Role)
  ) {}

  async findAll(): Promise<ResponseInventoryDto[]> {
    throw new Error('Method not implemented.')
  }

  async create({ dto, sub }: CreateInventoryParam): Promise<InventoryTokens> {
    const { success, data, error } = CreateInventorySchema.safeParse(dto)

    if (!success || !data) {
      throw new AppError({
        code: ERROR_NAMES.VALIDATION,
        httpCode: ERROR_HTTP_CODES.VALIDATION,
        message: 'Inventory validation failed.',
        isOperational: true,
        details: error
      })
    }

    //  Busca el usuario
    const user = await this.userRepository.findOne({
      where: {
        id: sub
      }
    })

    if (!user) {
      throw new AppError({
        code: ERROR_NAMES.NOT_FOUND,
        httpCode: ERROR_HTTP_CODES.NOT_FOUND,
        message: 'User not found.',
        isOperational: true
      })
    }

    //  Busca el rol de administrador -> Rol por defecto
    const adminRole = await this.roleRepository.findOne({
      where: {
        name: ROLES.ADMIN
      }
    })

    if (!adminRole) {
      throw new AppError({
        code: ERROR_NAMES.NOT_FOUND,
        httpCode: ERROR_HTTP_CODES.NOT_FOUND,
        message: 'Role not found',
        isOperational: true
      })
    }

    //  Crea el inventario
    const inventory = await this.repository.save({
      name: data.name,
      description: data.description
    })

    //  Lo vincula con el usuario
    const member = await this.memberRepository.save({
      inventory,
      role: adminRole,
      user: user
    })

    //  Genera los tokens de acceso y refresco
    const access = generateInventoryAccessToken({
      sub: member.id,
      inventory: member.inventory,
      role: member.role
    })

    const refresh = generateInventoryRefreshToken({
      sub: member.id,
      inventory: member.inventory,
      role: member.role
    })

    //  Crea las propiedades dinamicas
    const accessKey = `access_inventory_${sanitizeInventoryName(inventory.name)}`
    const refreshKey = `refresh_inventory_${sanitizeInventoryName(inventory.name)}`

    return {
      [accessKey]: access,
      [refreshKey]: refresh
    }
  }
}
