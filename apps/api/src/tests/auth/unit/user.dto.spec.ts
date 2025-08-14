import {
  checkSigninUserDto,
  checkSignUpUserDto
} from '@auth/entities/dtos/user.dto'
import { faker } from '@faker-js/faker'
import { describe, expect, it } from 'vitest'

describe('User DTOs tests', () => {
  it('should verify CreateUserDto correctly', () => {
    const user = {
      name: faker.person.firstName(),
      email: faker.internet.email(),
      password: faker.internet.password({ length: 8 })
    }

    const { error } = checkSignUpUserDto(user)
    expect(error).toBeFalsy()
  })

  it('should verify LoginUserDto correctly', () => {
    const user = {
      email: faker.internet.email(),
      password: faker.internet.password({ length: 8 })
    }

    const { error } = checkSigninUserDto(user)
    expect(error).toBeFalsy()
  })

  // Boundary Value Analysis
  it('should throw an error because password is not long enough', () => {
    const user = {
      name: faker.person.firstName(),
      email: faker.internet.email(),
      password: faker.internet.password({ length: 7 })
    }

    const { error } = checkSigninUserDto(user)
    expect(error).toBeTruthy()

    const { error: signUpError } = checkSignUpUserDto(user)
    expect(signUpError).toBeTruthy()
  })

  // Boundary Value Analysis
  it('should throw an error because password is too much long', () => {
    const user = {
      name: faker.person.firstName(),
      email: faker.internet.email(),
      password: faker.internet.password({ length: 130 })
    }

    const { error } = checkSigninUserDto(user)
    expect(error).toBeTruthy()

    const { error: signUpError } = checkSignUpUserDto(user)
    expect(signUpError).toBeTruthy()
  })

  it('should throw an error because invalid email', () => {
    const user = {
      name: faker.person.firstName(),
      email: faker.internet.url(),
      password: faker.internet.password({ length: 130 })
    }

    const { error: signInError } = checkSigninUserDto(user)
    expect(signInError).toBeTruthy()

    const { error: singUpError } = checkSignUpUserDto(user)
    expect(singUpError).toBeTruthy()
  })
})
