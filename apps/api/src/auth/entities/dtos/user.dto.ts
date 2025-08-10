import { z } from 'zod'

/**
 * 🏗 **DTO para registrar usuario**
 */
const CreateUserSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.email().min(1, 'Email is required'),
  password: z.string().min(8, 'Password must be at least 8 characters long')
})

type CreateUserDto = z.infer<typeof CreateUserSchema>

const checkSignUpUserDto = (userDto: CreateUserDto) => {
  return CreateUserSchema.safeParse(userDto)
}

/**
 * 🏗 **DTO para logear usuario**
 */
const LoginUserSchema = z.object({
  email: z.email().min(1, 'Email is required'),
  password: z.string().min(8, 'Password must be at least 8 characters long')
})

type LoginUserDto = z.infer<typeof LoginUserSchema>

const checkSigninUserDto = (userDto: LoginUserDto) => {
  return LoginUserSchema.safeParse(userDto)
}

export {
  CreateUserSchema,
  LoginUserSchema,
  checkSignUpUserDto,
  checkSigninUserDto,
  CreateUserDto,
  LoginUserDto
}
