import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
class AuthProvider {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'varchar', length: 100, unique: true })
  name!: string
}

export { AuthProvider }
