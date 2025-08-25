import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm'
import { AuthProvider } from './auth-provider.entity'
import { Member } from '@members/entities/member.entity'
import { Invitation } from '@invitations/entities/invitation.entity'

@Entity()
class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'varchar', length: 100, unique: true })
  name!: string

  @Column({ type: 'varchar', length: 100, unique: true })
  email!: string

  @Column({ type: 'varchar', length: 255, nullable: true })
  password?: string

  @ManyToOne(() => AuthProvider, { eager: true })
  @JoinColumn({ name: 'provider_id' })
  provider!: AuthProvider

  @OneToMany(() => Member, (member) => member.user, {
    nullable: true
  })
  members?: Member[]

  @OneToMany(() => Invitation, (invitation) => invitation.inventory)
  invitations?: Invitation[]

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt?: Date

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP'
  })
  updatedAt?: Date

  constructor(partial?: Partial<User>) {
    if (partial) {
      Object.assign(this, partial)
    }
  }
}

export { User }
