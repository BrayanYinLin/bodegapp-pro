import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
class Sale {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total!: number

  @Column({ type: 'timestamp' })
  date!: Date

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt?: Date

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP'
  })
  updatedAt?: Date
}

export { Sale }
