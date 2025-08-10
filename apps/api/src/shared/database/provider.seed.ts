import { AppDataSource } from '@shared/database/data-source'
import { AuthProvider } from '@auth/entities/auth-provider.entity'
import { In } from 'typeorm'

const authSeed = async () => {
  const repository = AppDataSource.getRepository(AuthProvider)

  const providers = ['Local', 'Google']

  for (const name of providers) {
    const exists = await repository.findOne({ where: { name } })
    if (!exists) {
      await repository.save(repository.create({ name }))
    }
  }
}

const authUnseed = async () => {
  const repository = AppDataSource.getRepository(AuthProvider)

  await repository.delete({ name: In(['Local', 'Google']) })
}

export { authSeed, authUnseed }
