import {
  ResponsePermissionDto,
  ResponsePermissionSchema
} from '@authorization/entities/dtos/permission.dto'
import { Permission } from '@authorization/entities/permission.entity'
import { PermissionService } from '@authorization/permission'
import { ERROR_HTTP_CODES, ERROR_NAMES } from '@shared/config/constants'
import { AppDataSource } from '@shared/database/data-source'
import { AppError } from '@shared/utils/error-factory'

class PermissionServiceImpl implements PermissionService {
  constructor(
    private readonly repository = AppDataSource.getRepository(Permission)
  ) {}

  async findAll(): Promise<ResponsePermissionDto[]> {
    const permissions = await this.repository.find()

    const permissionsMapped = permissions.map((permission) => {
      const { success, data, error } =
        ResponsePermissionSchema.safeParse(permission)

      if (!success || error) {
        throw new AppError({
          code: ERROR_NAMES.VALIDATION,
          httpCode: ERROR_HTTP_CODES.VALIDATION,
          message: 'Validate permissions failed',
          isOperational: true
        })
      }

      return data
    })

    return permissionsMapped
  }
}

export { PermissionServiceImpl }
