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

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(
  morgan('dev', {
    stream: {
      write: (message) => logger.http(message.trim())
    }
  })
)
app.use(cors())
app.use(limiter)
app.use(helmet())

app.use('/api/v1/auth', authenticationRouter)
app.use('/api/v1/inventory', inventoryRouter)
app.use(middlewareError)

export { app }
