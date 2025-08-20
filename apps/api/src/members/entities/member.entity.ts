import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { User } from '@auth/entities/user.entity'
import { Inventory } from '@root/inventories/entities/inventory.entity'
import { Role } from '@auth/entities/role.entity'

@Entity()
export class Member {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @ManyToOne(() => User, (user) => user.members)
  user!: User

  @ManyToOne(() => Inventory, (inventory) => inventory.members)
  inventory!: User

  @ManyToOne(() => Role, (role) => role.members)
  role!: Role

  @Column({ type: 'boolean', default: false })
  state: boolean = false

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
