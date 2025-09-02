import z from 'zod'

export const ResponsePermissionSchema = z.object({
  id: z.uuid(),
  description: z.string()
})

export type ResponsePermissionDto = z.infer<typeof ResponsePermissionSchema>
