import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { env_db, env_user_db, env_password_db } from '../config/environment'
import { User } from '../../auth/entities/user.entity'
import { Role } from '../../auth/entities/role.entity'
import { AuthProvider } from '../../auth/entities/auth-provider.entity'

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: env_user_db,
  password: env_password_db,
  database: env_db,
  synchronize: true,
  logging: false,
  entities: [User, Role, AuthProvider],
  migrations: [],
  subscribers: []
})
