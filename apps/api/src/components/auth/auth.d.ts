import { User } from './entities/user.entity'

export interface EmailService {
  sendVerificationEmail(from: string, user: User): Promise<void>
}
