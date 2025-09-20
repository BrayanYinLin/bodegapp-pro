import { z } from 'zod'

export const envSchema = z.object({
  PORT: z.string().transform((val) => {
    const port = Number(val)
    if (isNaN(port)) throw new Error('PORT must be a number')
    return port
  }),
  API_BASE: z.string().url(),

  DB_HOST: z.string(),
  DB_PORT: z.string().transform((val) => {
    const port = Number(val)
    if (isNaN(port)) throw new Error('DB_PORT must be a number')
    return port
  }),
  DB_USERNAME: z.string(),
  DB_PASSWORD: z.string(),
  DB_NAME: z.string(),

  JWT_SECRET: z.string(),

  EMAIL_SENDER: z.string().email(),
  RESEND_SECRET: z.string(),

  ENVIRONMENT: z.enum(['development', 'production', 'test']),

  BCRYPT_SALT_ROUNDS: z.string().transform((val) => {
    const rounds = Number(val)
    if (isNaN(rounds)) throw new Error('BCRYPT_SALT_ROUNDS must be a number')
    return rounds
  }),

  GOOGLE_CLIENT: z.string().optional().or(z.literal('')),
  GOOGLE_SECRET: z.string().optional().or(z.literal('')),
  GOOGLE_CALLBACK: z.string().optional().or(z.literal('')),

  CACHE_DB_PASSWORD: z.string().optional()
})
