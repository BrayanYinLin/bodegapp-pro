import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import { middlewareError } from '@shared/middleware/error-middleware'
import { authenticationRouter } from '@auth/routers/auth.router'
import helmet from 'helmet'
import { limiter } from '@shared/middleware/rate-limiter-middleware'

const app = express()

app.use(express.json())
app.use(morgan('dev'))
app.use(cookieParser())
app.use(limiter)

app.use(cors())
app.use(helmet())

app.use('/api/v1/auth', authenticationRouter)
app.use(middlewareError)

export { app }
