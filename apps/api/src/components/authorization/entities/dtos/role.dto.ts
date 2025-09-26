import z from 'zod'

export const PermissionSchema = z.object({
  description: z.string('Description is require')
})

export const RoleTokenSchema = z.object({
  name: z.string('Name is required'),
  permissions: z.array(PermissionSchema)
})

export const ResponseRoleSchema = z.object({
  id: z.uuid(),
  name: z.string()
})

export const CreateRolePermissionSchema = z.object({
  id: z.uuid(),
  description: z.string('Description is require')
})

export const CreateRoleSchema = z.object({
  name: z.string('Name is required'),
  permissions: z.array(CreateRolePermissionSchema)
})

export type CreateRoleDto = z.infer<typeof CreateRoleSchema>

export type ResponseRoleDto = z.infer<typeof ResponseRoleSchema>

export type RolePayload = z.infer<typeof RoleTokenSchema>
