import { Role } from '@authorization/entities/role.entity'
import { User } from '@auth/entities/user.entity'
import {
  ResponseInventoryDto,
  ResponseInventorySchema
} from '@inventories/entities/dtos/inventory.dto'
import { Inventory } from '@inventories/entities/inventory.entity'
import {
  CreateInventoryParam,
  EditInventoryParam,
  InventoryAndUserParam,
  InventoryParam,
  InventoryService,
  InventoryWithTokens
} from '@inventories/inventory'
import {
  generateInventoryAccessToken,
  generateInventoryRefreshToken
} from '@inventories/lib/generate-tokens'
import { Member } from '@members/entities/member.entity'
import { ERROR_HTTP_CODES, ERROR_NAMES } from '@shared/config/constants'
import { AppDataSource } from '@shared/database/data-source'
import { PERMISSIONS, ROLES, seedAdmin } from '@shared/database/role.seed'
import { AppError } from '@shared/utils/error-factory'
import { formatErrorMessages } from '@shared/utils/format-error-messages'

export class InventoryServiceImpl implements InventoryService {
  constructor(
    private readonly repository = AppDataSource.getRepository(Inventory),
    private readonly memberRepository = AppDataSource.getRepository(Member),
    private readonly userRepository = AppDataSource.getRepository(User),
    private readonly roleRepository = AppDataSource.getRepository(Role)
  ) {}

  async findAllByUser({
    sub
  }: InventoryParam): Promise<ResponseInventoryDto[]> {
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

    const members = await this.memberRepository.find({
      relations: ['user', 'inventory'],
      where: {
        user: {
          id: sub
        }
      }
    })

    const mapped = members.map(({ inventory }) => {
      const { success, data, error } =
        ResponseInventorySchema.safeParse(inventory)

      if (!success || error) {
        throw new AppError({
          code: ERROR_NAMES.VALIDATION,
          httpCode: ERROR_HTTP_CODES.VALIDATION,
          message: 'Inventory mapping failed',
          isOperational: true,
          details: formatErrorMessages(error)
        })
      }

      return data
    })

    return mapped
  }

  async create({
    dto,
    sub
  }: CreateInventoryParam): Promise<InventoryWithTokens> {
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

    //  Crea el inventario
    const inventory = await this.repository.save({
      name: dto.name,
      description: dto.description
    })

    await seedAdmin(inventory)

    //  Busca el rol de administrador -> Rol por defecto
    const adminRole = await this.roleRepository.findOne({
      where: {
        name: ROLES.ADMIN
      },
      relations: ['permissions']
    })

    if (!adminRole) {
      throw new AppError({
        code: ERROR_NAMES.NOT_FOUND,
        httpCode: ERROR_HTTP_CODES.NOT_FOUND,
        message: 'Role not found',
        isOperational: true
      })
    }

    //  Lo vincula con el usuario
    const member = await this.memberRepository.save({
      inventory,
      role: adminRole,
      user: user
    })

    //  Genera los tokens de acceso y refresco
    const access = generateInventoryAccessToken({
      sub: user.id,
      member: {
        id: member.id
      },
      inventory: member.inventory,
      role: member.role
    })

    const refresh = generateInventoryRefreshToken({
      sub: user.id,
      member: {
        id: member.id
      },
      inventory: member.inventory,
      role: member.role
    })

    const { data, success, error } =
      ResponseInventorySchema.safeParse(inventory)

    if (!success || error) {
      throw new AppError({
        code: ERROR_NAMES.VALIDATION,
        httpCode: ERROR_HTTP_CODES.VALIDATION,
        message: 'API could not validate inventory created',
        isOperational: true,
        details: formatErrorMessages(error)
      })
    }

    return {
      inventory: data,
      tokens: {
        access_inventory: access,
        refresh_inventory: refresh
      }
    }
  }

  async edit({ dto, inventoryId, role }: EditInventoryParam): Promise<void> {
    const { permissions } = role

    const hasPermission = permissions.findIndex(
      ({ description }) => PERMISSIONS.EDIT_INVENTORY === description
    )

    if (hasPermission === -1) {
      throw new AppError({
        code: ERROR_NAMES.FORBIDDEN,
        httpCode: ERROR_HTTP_CODES.FORBIDDEN,
        message: 'Permission not granted.',
        isOperational: true
      })
    }

    await AppDataSource.createQueryBuilder()
      .update(Inventory)
      .set({
        name: dto.name,
        description: dto.description
      })
      .where('id = :id', { id: inventoryId })
      .execute()
  }

  async findById({
    sub,
    id
  }: InventoryAndUserParam): Promise<InventoryWithTokens> {
    const member = await this.memberRepository.findOne({
      relations: ['inventory', 'role', 'user', 'role.permissions'],
      where: {
        user: {
          id: sub
        },
        inventory: {
          id
        }
      }
    })

    if (!member) {
      throw new AppError({
        code: ERROR_NAMES.NOT_FOUND,
        httpCode: ERROR_HTTP_CODES.NOT_FOUND,
        message: 'Member not found.',
        isOperational: true
      })
    }

    const access = generateInventoryAccessToken({
      sub: member.user.id,
      member: {
        id: member.id
      },
      inventory: member.inventory,
      role: {
        name: member.role.name,
        permissions: member.role.permissions
      }
    })

    const refresh = generateInventoryRefreshToken({
      sub: member.user.id,
      member: {
        id: member.id
      },
      inventory: member.inventory,
      role: member.role
    })

    const { success, data, error } = ResponseInventorySchema.safeParse(
      member.inventory
    )

    if (!success || error) {
      throw new AppError({
        code: ERROR_NAMES.VALIDATION,
        httpCode: ERROR_HTTP_CODES.VALIDATION,
        message: 'Inventory mapping failed',
        isOperational: true,
        details: formatErrorMessages(error)
      })
    }

    return {
      inventory: data,
      tokens: {
        access_inventory: access,
        refresh_inventory: refresh
      }
    }
  }
}
