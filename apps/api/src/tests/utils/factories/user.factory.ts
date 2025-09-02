import { faker } from '@faker-js/faker'

export const fakeUser = () => {
  return {
    name: faker.person.firstName(),
    email: faker.internet.email(),
    password: faker.internet.password({ length: 10 })
  }
}
