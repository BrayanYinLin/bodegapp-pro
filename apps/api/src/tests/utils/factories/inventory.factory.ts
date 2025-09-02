import { faker } from '@faker-js/faker'

export const fakeInventory = () => {
  return {
    name: faker.company.name(),
    description: faker.company.catchPhrase()
  }
}
