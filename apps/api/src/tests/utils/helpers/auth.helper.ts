import request from 'supertest'
import { CreateUserDto } from '@auth/entities/dtos/user.dto'
import { once } from 'node:events'
import { authEmitter } from '@auth/services/test-email.service'

export type SetupSignupOptions = {
  user: CreateUserDto
  agent: ReturnType<typeof request.agent>
}

export const setupSignup = async ({ user, agent }: SetupSignupOptions) => {
  await agent.post('/api/v1/auth/signup').send(user)
  const [{ code }] = await once(authEmitter, 'verification-code')
  await agent.post('/api/v1/auth/verify').send({ code })
}
