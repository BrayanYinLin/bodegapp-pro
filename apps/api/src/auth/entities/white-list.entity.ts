import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class WhiteList {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'uuid', unique: true })
  jti!: string

  @Column({ type: 'uuid' })
  sub!: string
}
