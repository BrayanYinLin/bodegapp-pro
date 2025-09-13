import 'reflect-metadata'
import { DataSource } from 'typeorm'
import {
  env_db,
  env_user_db,
  env_password_db,
  env_host_db,
  env_node_env,
  env_port_db
} from '@shared/config/environment'
import { User } from '@auth/entities/user.entity'
import { Role } from '@authorization/entities/role.entity'
import { AuthProvider } from '@auth/entities/auth-provider.entity'
import { Category } from '@products/entities/category.entity'
import { Inventory } from '@inventories/entities/inventory.entity'
import { Product } from '@products/entities/product.entity'
import { Permission } from '@authorization/entities/permission.entity'
import { Member } from '@members/entities/member.entity'
import { Invitation } from '@invitations/entities/invitation.entity'
import { Movement } from '@movements/entities/movement.entity'
import { MovementDetail } from '@movements/entities/movement-detail.entity'
import { WhiteList } from '@auth/entities/white-list.entity'
import { AuthenticationCode } from '@auth/entities/authentication-code.entity'

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: env_host_db,
  port: Number(env_port_db),
  username: env_user_db,
  password: env_password_db,
  database: env_db,
  synchronize: env_node_env === 'development',
  logging: ['error', 'warn'],
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
    Product,
    WhiteList,
    AuthenticationCode
  ],
  migrations: [],
  subscribers: []
})
