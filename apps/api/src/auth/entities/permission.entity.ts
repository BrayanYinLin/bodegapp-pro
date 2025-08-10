import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Role } from './role.entity'

@Entity()
class Permission {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @ManyToMany(() => Role, (role) => role.permissions)
  roles!: Role[]

  @Column({ type: 'varchar', unique: true })
  description!: string
}

export { Permission }
