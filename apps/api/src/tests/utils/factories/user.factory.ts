import { authEmitter } from '@auth/services/test-email.service'
import { faker } from '@faker-js/faker'

export const fakeUser = () => {
  return {
    name: faker.person.firstName(),
    email: faker.internet.email(),
    password: faker.internet.password({ length: 10 })
  }
}

export const waitForVerificationCode = () => {
  return new Promise((resolve) => {
    authEmitter.once('verification-code', ({ code }) => resolve(code))
  })
}
