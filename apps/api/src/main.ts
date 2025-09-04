import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import { middlewareError } from '@shared/middleware/error-middleware'
import { authenticationRouter } from '@auth/routers/auth.router'
import helmet from 'helmet'
import { limiter } from '@shared/middleware/rate-limiter-middleware'
import { inventoryRouter } from '@inventories/routers/inventory.router'
import { logger } from '@shared/utils/logger'
import { ROUTES } from '@shared/config/constants'
import { handler } from '@shared/utils/error-handler'
import { permissionRouter } from '@authorization/routers/permission.router'
import { env_api_base } from '@shared/config/environment'

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(
  morgan('dev', {
    stream: {
      write: (message) => logger.info(message.trim())
    }
  })
)
app.use(limiter)
app.use(cors({ origin: String(env_api_base) }))
app.use(helmet({ contentSecurityPolicy: false }))

app.use(ROUTES.AUTH, authenticationRouter)
app.use(ROUTES.INVENTORY, inventoryRouter)
app.use(ROUTES.PERMISSION, permissionRouter)
app.use(middlewareError)

process.on('uncaughtException', (err) => {
  handler.handleProcessError(err)
})

export { app }
