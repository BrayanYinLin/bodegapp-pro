import { ResponsePermissionDto } from './entities/dtos/permission.dto'

export interface PermissionService {
  findAll(): Promise<ResponsePermissionDto[]>
}
