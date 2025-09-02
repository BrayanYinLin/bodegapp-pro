import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm'
import { User } from '@auth/entities/user.entity'
import { Inventory } from '@inventories/entities/inventory.entity'
import { Role } from '@auth/entities/role.entity'
import { Invitation } from '@invitations/entities/invitation.entity'

@Entity()
export class Member {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @ManyToOne(() => User, (user) => user.members)
  user!: User

  @ManyToOne(() => Inventory, (inventory) => inventory.members)
  inventory!: Inventory

  @ManyToOne(() => Role, (role) => role.members)
  role!: Role

  @OneToMany(() => Invitation, (invitation) => invitation.invitedBy)
  invitations!: Invitation[]

  @Column({ type: 'boolean', default: true })
  state: boolean = true

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  joinedAt?: Date

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt?: Date

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP'
  })
  updatedAt?: Date
}
