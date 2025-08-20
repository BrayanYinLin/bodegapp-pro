import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

export enum InvitationStatus {
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  PENDING = 'pending'
}

@Entity()
export class Invitation {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({
    type: 'enum',
    enum: InvitationStatus,
    default: InvitationStatus.PENDING
  })
  status!: InvitationStatus

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  invitatedAt?: Date
}
