import { join } from 'node:path'

const PATH_ENV = join(__dirname, '../../../../../.env')
process.loadEnvFile(PATH_ENV)

export const {
  DB_NAME: env_db,
  DB_USERNAME: env_user_db,
  DB_PASSWORD: env_password_db,
  DB_HOST: env_host_db,
  DB_PORT: env_port_app,
  JWT_SECRET: env_jwt_secret,
  NODE_ENV: env_node_env,
  BCRYPT_SALT_ROUNDS: env_bcrypt_salt_rounds
} = process.env
