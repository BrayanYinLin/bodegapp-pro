import { z, ZodError } from 'zod'

export const formatErrorMessages = (errors: ZodError) => {
  return z.flattenError(errors)
}
