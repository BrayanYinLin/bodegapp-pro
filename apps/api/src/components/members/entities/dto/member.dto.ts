import { RoleTokenSchema } from '@auth/entities/dtos/role.dto'
import { ResponseInventorySchema } from '@inventories/entities/dtos/inventory.dto'
import z from 'zod'

const MemberPayloadSchema = z.object({
  sub: z.uuid(),
  member: z.object({
    id: z.uuid()
  }),
  inventory: ResponseInventorySchema,
  role: RoleTokenSchema
})

type MemberPayloadDto = z.infer<typeof MemberPayloadSchema>

export { MemberPayloadSchema, MemberPayloadDto }
