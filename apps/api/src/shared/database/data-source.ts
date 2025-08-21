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
import { Inventory } from '@inventories/entities/inventory.entity'
import { Product } from '@products/entities/product.entity'
import { Permission } from '@auth/entities/permission.entity'
import { Member } from '@members/entities/member.entity'
import { Invitation } from '@invitations/entities/invitation.entity'
import { Movement } from '@movements/entities/movement.entity'
import { MovementDetail } from '@movements/entities/movement-detail.entity'

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: env_host_db,
  port: 5432,
  username: env_user_db,
  password: env_password_db,
  database: env_db,
  synchronize: env_node_env === 'development',
  logging: env_node_env !== 'development',
  dropSchema: env_node_env === 'development',
  entities: [
    User,
    Role,
    AuthProvider,
    Permission,
    Member,
    Invitation,
    Movement,
    MovementDetail,
    Category,
    Inventory,
    Product
  ],
  migrations: [],
  subscribers: []
})
