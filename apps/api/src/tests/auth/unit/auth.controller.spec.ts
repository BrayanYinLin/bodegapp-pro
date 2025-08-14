import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AuthCtrl } from '@auth/controllers/auth.controller'
import { AuthServiceImpl } from '@auth/services/auth.service'
import { setAuthCookies } from '@auth/lib/set-auth-cookie'
import { Request, Response, NextFunction } from 'express'
import { LoginUserDto } from '@auth/entities/dtos/user.dto'
import { faker } from '@faker-js/faker'

// 1. Mockear las dependencias externas
// Mockeamos el servicio para controlar sus métodos.
vi.mock('@auth/services/auth.service')
// Mockeamos la función de cookies para verificar si se llama correctamente.
vi.mock('@auth/lib/set-auth-cookie')

describe('AuthCtrl', () => {
  let controller: AuthCtrl
  let mockAuthService: Partial<AuthServiceImpl>
  let mockRequest: Partial<Request>
  let mockGoogle: Partial<Request>
  let mockSignUpRequest: Partial<Request>
  let mockResponse: Partial<Response>
  let mockResponseGoogle: Partial<Response>
  const mockNext: NextFunction = vi.fn()

  // 2. Configuración que se ejecuta antes de cada prueba
  beforeEach(() => {
    mockAuthService = {
      signin: vi.fn(),
      signup: vi.fn(),
      callbackGoogle: vi.fn()
    }

    controller = new AuthCtrl(mockAuthService as AuthServiceImpl)

    mockRequest = {
      body: {
        email: faker.internet.email(),
        password: faker.internet.password()
      } as LoginUserDto
    }

    mockGoogle = {
      user: {
        emails: [{ value: faker.internet.email(), verified: true }],
        profileUrl: faker.internet.url(),
        provider: 'google',
        id: faker.string.uuid(),
        _raw: '{}',
        _json: {
          iss: 'https://accounts.google.com',
          azp: '1234987819200.apps.googleusercontent.com',
          aud: '1234987819200.apps.googleusercontent.com',
          sub: '10769150350006150715113082367',
          at_hash: 'HK6E_P6Dh8Y93mRNtsDB1Q',
          hd: 'example.com',
          email: 'jsmith@example.com',
          email_verified: true,
          iat: 1353601026,
          exp: 1353604926,
          nonce: '0394852-3190485-2490358'
        },
        displayName: faker.person.fullName(),
        name: {
          familyName: faker.person.lastName(),
          givenName: faker.person.firstName()
        }
      }
    }

    mockSignUpRequest = {
      body: {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password()
      }
    }

    mockResponse = {
      status: vi.fn().mockReturnThis(), // Permite encadenar .json()
      json: vi.fn()
    }

    mockResponseGoogle = {
      status: vi.fn().mockReturnThis(),
      redirect: vi.fn()
    }

    vi.mocked(setAuthCookies).mockReturnValue(mockResponse as Response)
  })

  // 3. Escribir los casos de prueba
  it('should sign in a user and set cookies successfully', async () => {
    // Arrange: Preparamos el escenario
    const tokens = {
      access_token: 'fake_access_token',
      refresh_token: 'fake_refresh_token'
    }
    vi.mocked(mockAuthService.signin!).mockResolvedValue(tokens)

    await controller.signin(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    )

    expect(mockAuthService.signin).toHaveBeenCalledWith(mockRequest.body)
    expect(setAuthCookies).toHaveBeenCalledWith(
      mockResponse,
      tokens.access_token,
      tokens.refresh_token
    )

    expect(mockResponse.status).toHaveBeenCalledWith(200)
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Signed in successfully'
    })
  })

  it('should sign up a user and set cookies successfully', async () => {
    const tokens = {
      access_token: 'fake_access_token',
      refresh_token: 'fake_refresh_token'
    }
    vi.mocked(mockAuthService.signup!).mockResolvedValue(tokens)

    await controller.signup(
      mockSignUpRequest as Request,
      mockResponse as Response,
      mockNext
    )

    expect(mockAuthService.signup).toHaveBeenCalledWith(mockSignUpRequest.body)
    expect(setAuthCookies).toHaveBeenCalledWith(
      mockResponse,
      tokens.access_token,
      tokens.refresh_token
    )

    expect(mockResponse.status).toHaveBeenCalledWith(201)
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Signed up successfully'
    })
  })

  it('should auth with google and set cookies successfully', async () => {
    const tokens = {
      access_token: 'fake_access_token',
      refresh_token: 'fake_refresh_token'
    }

    vi.mocked(mockAuthService.callbackGoogle!).mockResolvedValue(tokens)
    vi.mocked(setAuthCookies).mockReturnValue(mockResponseGoogle as Response)

    await controller.callback(
      mockGoogle as Request,
      mockResponseGoogle as Response,
      mockNext
    )

    await controller.callback(
      mockGoogle as Request,
      mockResponseGoogle as Response,
      mockNext
    )

    expect(mockAuthService.callbackGoogle).toHaveBeenCalledWith(mockGoogle.user)

    expect(setAuthCookies).toHaveBeenCalledWith(
      mockResponseGoogle,
      tokens.access_token,
      tokens.refresh_token
    )

    expect(mockResponseGoogle.redirect).toHaveBeenCalledWith(301, '/home')
  })

  it('should call next with an error if signin fails', async () => {
    const error = new Error('Signin failed')
    vi.mocked(mockAuthService.signin!).mockRejectedValue(error)

    await controller.signin(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    )

    expect(mockNext).toHaveBeenCalledWith(error)
  })
})
