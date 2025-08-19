import 'reflect-metadata'
import { DataSource } from 'typeorm'
import {
  env_db,
  env_user_db,
  env_password_db,
  env_host_db,
  env_node_env
} from '@shared/config/environment'
import { User } from '@auth/entities/user.entity'
import { Role } from '@auth/entities/role.entity'
import { AuthProvider } from '@auth/entities/auth-provider.entity'
import { Category } from '@products/entities/category.entity'
import { Inventory } from '@inventory/entities/inventory.entity'
import { Product } from '@products/entities/product.entity'
import { Permission } from '@auth/entities/permission.entity'
import { UserInventory } from '@auth/entities/user-inventory.entity'

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: env_host_db,
  port: 5432,
  username: env_user_db,
  password: env_password_db,
  database: env_db,
  synchronize: env_node_env === 'development',
  logging: env_node_env !== 'development',
  entities: [
    User,
    Role,
    AuthProvider,
    Permission,
    UserInventory,
    Category,
    Inventory,
    Product
  ],
  migrations: [],
  subscribers: []
})
