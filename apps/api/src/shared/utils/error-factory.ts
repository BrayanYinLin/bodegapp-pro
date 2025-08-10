/**
 * 💡 **Guía para nombrar errores de manera clara y estructurada**
 *
 * 📌 **Principios para nombres de errores**
 * 1. **Claridad** → Usa nombres descriptivos que indiquen el tipo de error.
 * 2. **Consistencia** → Agrega el sufijo `Error` para identificarlo fácilmente.
 * 3. **Especificidad** → Diferencia los errores según su contexto.
 *
 * 🚀 **Ejemplo de uso**
 * ```ts
 * const NotFoundError = createError({ name: "NotFoundError" });
 * const ValidationError = createError({ name: "ValidationError" });
 * const AuthenticationError = createError({ name: "AuthenticationError" });
 * const AuthorizationError = createError({ name: "AuthorizationError" });
 * const DatabaseError = createError({ name: "DatabaseError" });
 * const InternalServerError = createError({ name: "InternalServerError" });
 *
 * 🏗 **Estrategia de nombres por contexto**
 * | **Contexto**       | **Ejemplo de nombre de error**       |
 * |--------------------|------------------------------------|
 * | No encontrado      | `NotFoundError`                   |
 * | Validación        | `ValidationError`                 |
 * | Autenticación     | `AuthenticationError`             |
 * | Autorización      | `AuthorizationError`              |
 * | Base de datos     | `DatabaseError`                   |
 * | Servidor interno  | `InternalServerError`             |
 * | Tiempo de espera  | `TimeoutError`                    |
 * | Conexión          | `ConnectionError`                 |
 * | Formato inválido  | `InvalidFormatError`              |
 */

import { Code, HttpCode } from '@shared/config/constants'
import { ZodError } from 'zod'

type ErrorParams = {
  code: Code
  httpCode: HttpCode
  message: string
  isOperational: boolean
  details?: ZodError | unknown
}

class AppError extends Error {
  public readonly code: Code
  public readonly httpCode: HttpCode
  public readonly isOperational: boolean
  public readonly details?: ZodError | unknown

  constructor({
    code,
    httpCode,
    message,
    isOperational,
    details
  }: ErrorParams) {
    super(message)

    Object.setPrototypeOf(this, new.target.prototype)

    this.code = code
    this.httpCode = httpCode
    this.isOperational = isOperational
    this.details = details

    Error.captureStackTrace(this)
  }
}

export { AppError }
