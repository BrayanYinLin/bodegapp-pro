// Pruebas Unitarias para los `lib` helpers: Los archivos en el directorio lib son candidatos perfectos para pruebas unitarias:
//        * generate-tokens.ts: ¿Se generan los tokens con los datos y la expiración correcta?
//        * google-auth.ts: ¿Se maneja correctamente la lógica de autenticación de Google?
//        * set-auth-cookie.ts: ¿Se construye la cookie con las opciones correctas (httpOnly, secure, etc.)?

// Pruebas Unitarias para `auth.controller.ts`: Aunque las pruebas de integración cubren el controlador, las pruebas unitarias permitirían verificar
//       que el controlador llama a los métodos de servicio correctos y maneja adecuadamente los objetos de solicitud/respuesta (request/response) sin
//       necesidad de un servidor completo.
import {
  generateAccessToken,
  generateRefreshToken
} from '@auth/lib/generate-tokens'
import { env_jwt_secret } from '@shared/config/environment'
import { JwtPayload, verify } from 'jsonwebtoken'
import { randomUUID } from 'node:crypto'
import { describe, expect, it } from 'vitest'

describe('Lib tests', () => {
  const id = randomUUID()

  it('should encode tokens successfully', () => {
    expect(() => generateAccessToken({ id })).not.throw()

    const access_token = generateAccessToken({ id })

    if (!env_jwt_secret) throw new Error()

    const { sub, iat, exp } = verify(access_token, env_jwt_secret) as JwtPayload
    expect(sub).toBe(id)
    expect(iat).toBeTypeOf('number')
    expect(exp).toBeTypeOf('number')

    expect(() => generateAccessToken({ id })).not.throw()

    const refresh_token = generateRefreshToken({ id })

    const {
      sub: refreshSub,
      iat: refreshIat,
      exp: refreshExp
    } = verify(refresh_token, env_jwt_secret) as JwtPayload
    expect(refreshSub).toBe(id)
    expect(refreshIat).toBeTypeOf('number')
    expect(refreshExp).toBeTypeOf('number')
  })
})
