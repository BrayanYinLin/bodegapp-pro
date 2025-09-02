import z from 'zod'

const CreateInventorySchema = z.object({
  name: z.string('Name is required').min(1, 'Name must be longer'),
  description: z.string('Description is required')
})

type CreateInventoryDto = z.infer<typeof CreateInventorySchema>

const ResponseInventorySchema = z.object({
  id: z.uuid('Id is required'),
  name: z.string('Name is required').min(1, 'Name must be longer'),
  description: z.string('Description is required')
})

type ResponseInventoryDto = z.infer<typeof ResponseInventorySchema>

export {
  CreateInventorySchema,
  CreateInventoryDto,
  ResponseInventorySchema,
  ResponseInventoryDto
}
