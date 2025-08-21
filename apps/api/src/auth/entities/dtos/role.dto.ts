import z from 'zod'

export const PermissionSchema = z.object({
  description: z.string('Description is require')
})

export const RoleTokenSchema = z.object({
  name: z.string('Name is required'),
  permissions: z.array(PermissionSchema)
})

export type RolePayload = z.infer<typeof RoleTokenSchema>
