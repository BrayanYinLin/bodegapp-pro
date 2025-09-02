import {
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn
} from 'typeorm'
import { Inventory } from '@inventories/entities/inventory.entity'
import { Category } from '@products/entities/category.entity'

@Entity()
class Product {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'varchar', length: 100, unique: true })
  name!: string

  @Column({ type: 'int' })
  quantity!: number

  @Column({ type: 'boolean', default: true })
  state!: boolean

  @OneToOne(() => Category, { nullable: false })
  category!: Category

  @ManyToOne(() => Inventory, { eager: true, nullable: false })
  inventory!: Inventory

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt?: Date

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP'
  })
  updatedAt?: Date
}

export { Product }
