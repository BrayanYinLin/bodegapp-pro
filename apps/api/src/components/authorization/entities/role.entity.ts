import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
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
  @JoinColumn({ name: 'inventory_id' })
  inventory!: Inventory

  @ManyToMany(() => Permission, (permission) => permission.roles)
  @JoinTable({ name: 'role_permission' })
  permissions!: Permission[]

  @CreateDateColumn()
  createdAt?: Date

  @UpdateDateColumn()
  updatedAt?: Date
}

export { Role }
