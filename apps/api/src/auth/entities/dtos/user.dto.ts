import { z } from 'zod'

/**
 * 🏗 **DTO para registrar usuario**
 */
const CreateUserSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.email().min(1, 'Email is required'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .max(128, 'Password must be shorter')
})

type CreateUserDto = z.infer<typeof CreateUserSchema>

const checkSignUpUserDto = (userDto: CreateUserDto) => {
  return CreateUserSchema.safeParse(userDto)
}

const FindUserEmailSchema = z.object({
  email: z.email()
})

type FindUserEmailDto = z.infer<typeof FindUserEmailSchema>

const ResponseUserIdSchema = z.object({
  userId: z.uuid()
})

type ResponseUserIdDto = z.infer<typeof ResponseUserIdSchema>
/**
 * 🏗 **DTO para logear usuario**
 */
const LoginUserSchema = z.object({
  email: z.email().min(1, 'Email is required'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .max(128, 'Password must be shorter')
})

type LoginUserDto = z.infer<typeof LoginUserSchema>

const checkSigninUserDto = (userDto: LoginUserDto) => {
  return LoginUserSchema.safeParse(userDto)
}

const GoogleUserSchema = z.object({
  name: z.string('Name is required'),
  email: z.email('Email is required'),
  picture: z.string('Picture is required')
})

type GoogleUserDto = z.infer<typeof GoogleUserSchema>

const checkGoogleUserDto = (userDto: GoogleUserDto) => {
  return GoogleUserSchema.safeParse(userDto)
}

export {
  CreateUserSchema,
  LoginUserSchema,
  GoogleUserSchema,
  FindUserEmailSchema,
  ResponseUserIdSchema,
  checkSignUpUserDto,
  checkSigninUserDto,
  checkGoogleUserDto,
  GoogleUserDto,
  FindUserEmailDto,
  CreateUserDto,
  LoginUserDto,
  ResponseUserIdDto
}
