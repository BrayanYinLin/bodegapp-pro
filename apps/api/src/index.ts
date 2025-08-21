import { AppDataSource } from '@shared/database/data-source'
import { app } from './main'
import { env_port_app } from '@shared/config/environment'
import { authSeed } from '@shared/database/provider.seed'
import { seedAdmin } from '@shared/database/role.seed'

app.listen(env_port_app, async () => {
  AppDataSource.initialize()

  await authSeed()
  await seedAdmin()
  console.log(`Server is running on port ${env_port_app}`)
})
