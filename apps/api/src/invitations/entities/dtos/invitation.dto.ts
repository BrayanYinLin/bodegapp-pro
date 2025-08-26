import { ResponseInventorySchema } from '@inventories/entities/dtos/inventory.dto'
import z from 'zod'
import { InvitationStatus } from '../invitation.entity'

const InviteUserSchema = z.object({
  userId: z.uuid(),
  roleId: z.uuid()
})

type InviteUserDto = z.infer<typeof InviteUserSchema>

const CreateInvitationSchema = z.object({
  userId: z.uuid(),
  inventoryId: z.uuid(),
  memberId: z.uuid(),
  roleId: z.uuid()
})

type CreateInvitationDto = z.infer<typeof CreateInvitationSchema>

const ResponseInvitationSchema = z.object({
  invitedBy: z.object({
    id: z.uuid(),
    user: {
      name: z.string(),
      email: z.email()
    }
  }),
  inventory: ResponseInventorySchema,
  status: z.enum(InvitationStatus)
})

type ResponseInvitationDto = z.infer<typeof ResponseInvitationSchema>

export {
  CreateInvitationSchema,
  ResponseInvitationSchema,
  InviteUserSchema,
  InviteUserDto,
  ResponseInvitationDto,
  CreateInvitationDto
}
