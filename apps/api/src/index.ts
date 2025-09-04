import { AppDataSource } from '@shared/database/data-source'
import { app } from './main'
import { env_port_app } from '@shared/config/environment'
import { authSeed } from '@shared/database/provider.seed'
import { logger } from '@shared/utils/logger'
import { seedPermissions } from '@shared/database/role.seed'

const init = async () => {
  try {
    await AppDataSource.initialize()
    await authSeed()
    await seedPermissions()

    app.listen(env_port_app)

    logger.info(`Server is running on port ${env_port_app}`)
  } catch (e) {
    logger.error(`Error running app ${(e as Error).name}`)
  }
}

init()
