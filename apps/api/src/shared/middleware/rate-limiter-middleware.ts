import rateLimit from 'express-rate-limit'
import { RATE_LIMITER_PARAMS } from '@shared/config/constants'

const limiter = rateLimit({
  windowMs: RATE_LIMITER_PARAMS.WINDOW_TIME,
  limit: RATE_LIMITER_PARAMS.REQUEST_LIMIT,
  standardHeaders: true,
  legacyHeaders: false,
  ipv6Subnet: 56
})

export { limiter }
