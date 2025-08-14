import { NextFunction, Request, Response } from 'express'
import { faker } from '@faker-js/faker'
import { randomUUID } from 'node:crypto'

export const passportMock = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  authenticate: (strategy: string, options?: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
      req.user = {
        id: randomUUID().toString(),
        displayName: faker.person.fullName(),
        emails: [{ value: faker.internet.email(), verified: true }],
        provider: 'google',
        profileUrl: 'http://fake.url',
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
        }
      }
      next()
    }
  }
}
