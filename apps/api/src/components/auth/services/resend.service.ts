import { EmailService } from '@auth/auth'
import {
  AuthenticationCode,
  AuthenticationPurpose
} from '@auth/entities/authentication-code.entity'
import { User } from '@auth/entities/user.entity'
import {
  ERROR_HTTP_CODES,
  ERROR_NAMES,
  EXPIRATION_EMAIL_CODE
} from '@shared/config/constants'
import { env_resend_secret } from '@shared/config/environment'
import { verifyEmailHtml } from '@shared/config/verification'
import { AppDataSource } from '@shared/database/data-source'
import { AppError } from '@shared/utils/error-factory'
import { Resend } from 'resend'
import { randomUUID } from 'node:crypto'

export class ResendService implements EmailService {
  constructor(
    private readonly authenticationCodeRepo = AppDataSource.getRepository(
      AuthenticationCode
    )
  ) {}

  async sendVerificationEmail(from: string, user: User): Promise<void> {
    if (!env_resend_secret) {
      throw new AppError({
        code: ERROR_NAMES.INTERNAL,
        httpCode: ERROR_HTTP_CODES.INTERNAL,
        isOperational: true,
        message: 'Resend secret not configured'
      })
    }

    try {
      const resend = new Resend(env_resend_secret)
      const now = new Date()
      const plus30min = new Date(now.getTime() + EXPIRATION_EMAIL_CODE)
      const { code, expiresAt } = await this.authenticationCodeRepo.save({
        code: randomUUID(),
        user: user,
        expiresAt: plus30min,
        purpose: AuthenticationPurpose.EMAIL_VERIFICATION
      })

      await resend.emails.send({
        from,
        to: [user.email],
        subject: 'Confirmation email',
        html: verifyEmailHtml(code, expiresAt.toISOString())
      })
    } catch (e) {
      throw new Error((e as Error).message)
    }
  }
}
