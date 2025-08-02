import { join } from 'node:path'

const PATH_ENV = join(__dirname, '../../../../../.env')
process.loadEnvFile(PATH_ENV)

export const {
  POSTGRES_DB: env_db,
  POSTGRES_USER: env_user_db,
  POSTGRES_PASSWORD: env_password_db,
  DB_HOST: env_host_db,
  PORT: env_port_app,
  JWT_SECRET: env_jwt_secret,
  NODE_ENV: env_node_env
} = process.env
