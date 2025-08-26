import { Role } from '@auth/entities/role.entity'
import { User } from '@auth/entities/user.entity'
import { Inventory } from '@inventories/entities/inventory.entity'
import { Member } from '@members/entities/member.entity'
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm'

export enum InvitationStatus {
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  PENDING = 'pending'
}

@Entity()
export class Invitation {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @ManyToOne(() => User, (user) => user.invitations)
  @JoinColumn({ name: 'user_invited_id' })
  userInvited!: User

  @ManyToOne(() => Member, (member) => member.invitations)
  @JoinColumn({ name: 'invited_by' })
  invitedBy!: Member

  @ManyToOne(() => Inventory, (inventory) => inventory.invitations)
  @JoinColumn({ name: 'inventory_id' })
  inventory!: Inventory

  @ManyToOne(() => Role, (role) => role.invitations)
  role!: Role

  @Column({
    type: 'enum',
    enum: InvitationStatus,
    default: InvitationStatus.PENDING
  })
  status!: InvitationStatus

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  invitatedAt?: Date
}
