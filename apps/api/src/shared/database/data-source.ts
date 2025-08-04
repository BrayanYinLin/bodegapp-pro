import 'reflect-metadata'
import { DataSource } from 'typeorm'
import {
  env_db,
  env_user_db,
  env_password_db,
  env_host_db
} from '@shared/config/environment'
import { User } from '@auth/entities/user.entity'
import { Role } from '@auth/entities/role.entity'
import { AuthProvider } from '@auth/entities/auth-provider.entity'
import { Category } from '@inventory/entities/category.entity'
import { Inventory } from '@inventory/entities/inventory.entity'
import { Product } from '@inventory/entities/product.entity'

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: env_host_db,
  port: 5432,
  username: env_user_db,
  password: env_password_db,
  database: env_db,
  synchronize: true,
  logging: true,
  entities: [User, Role, AuthProvider, Category, Inventory, Product],
  migrations: [],
  subscribers: []
})
