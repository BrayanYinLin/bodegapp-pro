import { GrantedPermission } from '@shared/database/role.seed'

interface InventoryAccessPayload {
  role: {
    permissions: Array<{ description: string }>
  }
}

export const userHasPermission = (
  payload: InventoryAccessPayload,
  permission: GrantedPermission
): boolean => {
  if (!payload?.role?.permissions) return false
  return payload.role.permissions.some((p) => p.description === permission)
}
