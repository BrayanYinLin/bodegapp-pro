import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class MovementDetail {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price!: number

  @Column({ type: 'integer' })
  quantity!: number

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt?: Date

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP'
  })
  updatedAt?: Date
}
