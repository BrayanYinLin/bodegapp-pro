import { EmailService } from '@auth/auth'
import {
  AuthenticationCode,
  AuthenticationPurpose
} from '@auth/entities/authentication-code.entity'
import { User } from '@auth/entities/user.entity'
import { EXPIRATION_EMAIL_CODE } from '@shared/config/constants'
import { AppDataSource } from '@shared/database/data-source'
import { logger } from '@shared/utils/logger'
import { randomUUID } from 'node:crypto'
import EventEmitter from 'node:events'

export const authEmitter = new EventEmitter()

export class TestEmailService implements EmailService {
  constructor(
    private readonly authenticationCodeRepo = AppDataSource.getRepository(
      AuthenticationCode
    )
  ) {}

  async sendVerificationEmail(_: string, user: User): Promise<void> {
    try {
      const now = new Date()
      const plus30min = new Date(now.getTime() + EXPIRATION_EMAIL_CODE)
      const { code } = await this.authenticationCodeRepo.save({
        code: randomUUID(),
        user: user,
        expiresAt: plus30min,
        purpose: AuthenticationPurpose.EMAIL_VERIFICATION
      })

      authEmitter.emit('verification-code', { code })
      logger.info(`Verification code: ${code}`)
    } catch (e) {
      throw new Error((e as Error).message)
    }
  }
}
