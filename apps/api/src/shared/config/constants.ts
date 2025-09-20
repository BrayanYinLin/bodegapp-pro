import { CookieOptions } from 'express'
import { env_node_env } from './environment'
import { Algorithm } from 'jsonwebtoken'

const ERROR_NAMES = {
  NOT_FOUND: 'NOT_FOUND_ERROR', // Recurso no encontrado
  BAD_REQUEST: 'BAD_REQUEST_ERROR', // Datos mal formados o parámetros inválidos
  AUTHENTICATION: 'AUTHENTICATION_ERROR', // Usuario no autenticado
  INTERNAL: 'INTERNAL_ERROR', // Error genérico del servidor
  FORBIDDEN: 'FORBIDDEN_ERROR', // Usuario autenticado pero sin permisos
  CONFLICT: 'CONFLICT_ERROR', // Estado conflictivo, duplicado o inconsistente
  VALIDATION: 'VALIDATION_ERROR', // Datos válidos en formato pero inválidos en lógica
  TIMEOUT: 'TIMEOUT_ERROR' // El servidor o cliente tardó demasiado en responder
} as const

const ERROR_HTTP_CODES = {
  NOT_FOUND: 404,
  BAD_REQUEST: 400,
  AUTHENTICATION: 401,
  INTERNAL: 500,
  FORBIDDEN: 403,
  CONFLICT: 409,
  VALIDATION: 422,
  TIMEOUT: 408
} as const

const EXPIRATION_EMAIL_CODE = 30 * 60 * 1000

const RATE_LIMITER_PARAMS = {
  WINDOW_TIME: 15 * 60 * 1000,
  REQUEST_LIMIT: 100
}

const TOKEN_PARAMS = {
  AT_DURATION: 60 * 60 * 4, //  4 horas
  RT_DURATION: 60 * 60 * 24 * 15, //  15 Dias
  IAT_DURATION: 60 * 60 * 4 // 4 horas
}

const ALGORITHM: Algorithm = 'RS256'

const COOKIE_PARAMS: CookieOptions = {
  httpOnly: true,
  sameSite: 'lax',
  secure: env_node_env === 'production'
} as const

const COOKIE_NAMES = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  INVENTORY_ACCESS: 'access_inventory',
  INVENTORY_REFRESH: 'refresh_inventory'
} as const

const ROUTES = {
  AUTH: '/api/v1/auth',
  INVENTORY: '/api/v1/inventory',
  INVITATION: '/:inventoryId/invitation',
  ROLE: '/:inventoryId/role',
  PERMISSION: '/api/v1/permission'
} as const

type Code = (typeof ERROR_NAMES)[keyof typeof ERROR_NAMES]
type HttpCode = (typeof ERROR_HTTP_CODES)[keyof typeof ERROR_HTTP_CODES]

export {
  ERROR_NAMES,
  ERROR_HTTP_CODES,
  EXPIRATION_EMAIL_CODE,
  RATE_LIMITER_PARAMS,
  TOKEN_PARAMS,
  ALGORITHM,
  ROUTES,
  COOKIE_PARAMS,
  COOKIE_NAMES,
  Code,
  HttpCode
}
