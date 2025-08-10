import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { User } from './user.entity'
import { Inventory } from '@inventory/entities/inventory.entity'

@Entity()
class UserInventory {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @ManyToOne(() => User, (user) => user.userInventories)
  user!: User

  @ManyToOne(() => Inventory, (inventory) => inventory.inventoryUsers)
  inventory!: User
}

export { UserInventory }
