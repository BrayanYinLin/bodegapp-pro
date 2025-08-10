import { AppDataSource } from '@shared/database/data-source'
import { app } from './main'
import { env_port_app } from '@shared/config/environment'
import { authSeed } from '@shared/database/provider.seed'

app.listen(env_port_app, async () => {
  AppDataSource.initialize()

  await authSeed()
  console.log(`Server is running on port ${env_port_app}`)
})
