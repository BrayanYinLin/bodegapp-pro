import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm'
import { Permission } from './permission.entity'
import { Member } from '@members/entities/member.entity'
import { Invitation } from '@invitations/entities/invitation.entity'
import { Inventory } from '@inventories/entities/inventory.entity'

@Entity()
class Role {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'varchar', length: 100 })
  name!: string

  @Column({ type: 'boolean', default: true })
  state: boolean = true

  @OneToMany(() => Member, (member) => member.role)
  members?: Member

  @OneToMany(() => Invitation, (invitation) => invitation.role)
  invitations?: Invitation

  @ManyToOne(() => Inventory, (inventory) => inventory.roles)
  inventory!: Inventory

  @ManyToMany(() => Permission, (permission) => permission.roles)
  @JoinTable({ name: 'role_permission' })
  permissions!: Permission[]

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt?: Date

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP'
  })
  updatedAt?: Date
}

export { Role }
