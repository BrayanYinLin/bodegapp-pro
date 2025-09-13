import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm'
import { User } from './user.entity'

export enum AuthenticationPurpose {
  EMAIL_VERIFICATION = 'EMAIL_VERIFICATION',
  PASSWORD_RESET = 'PASSWORD_RESET'
}

@Entity()
export class AuthenticationCode {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'uuid', unique: true })
  code!: string

  @Column({ type: 'enum', enum: AuthenticationPurpose })
  purpose!: AuthenticationPurpose

  @ManyToOne(() => User, (user) => user.verificationCodes, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'user_id' })
  user!: User

  @CreateDateColumn()
  createdAt!: Date

  @Column({ type: 'timestamptz', nullable: true })
  expiresAt!: Date | null
}
