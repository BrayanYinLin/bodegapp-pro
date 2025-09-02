import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { User } from './user.entity'

@Entity()
class AuthProvider {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'varchar', length: 100, unique: true, nullable: false })
  name!: string

  @OneToMany(() => User, (user) => user.provider, { nullable: true })
  users?: User[]
}

export { AuthProvider }
