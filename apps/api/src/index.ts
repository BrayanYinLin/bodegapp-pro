import { AppDataSource } from '@shared/database/data-source'
import { app } from './main'
import { env_port_app } from '@shared/config/environment'
import { authSeed } from '@shared/database/provider.seed'
import { logger } from '@shared/utils/logger'

const init = async () => {
  await AppDataSource.initialize()
  await authSeed()

  app.listen(env_port_app)

  logger.info(`Server is running on port ${env_port_app}`)
}

init()
