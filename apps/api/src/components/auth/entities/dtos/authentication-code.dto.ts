import z from 'zod'

export const VerifyEmailCodeSchema = z.object({
  code: z.uuid()
})
