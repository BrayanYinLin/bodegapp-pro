import { join } from 'node:path'
import { cwd } from 'node:process'

const env_path = join(cwd(), '../../.env')
process.loadEnvFile(env_path)

export const {
  DB_NAME: env_db,
  DB_USERNAME: env_user_db,
  DB_PASSWORD: env_password_db,
  DB_HOST: env_host_db,
  DB_PORT: env_port_db,
  PORT: env_port_app,
  API_BASE: env_api_base,
  JWT_SECRET: env_jwt_secret,
  ENVIRONMENT: env_node_env,
  EMAIL_SENDER: env_email_sender,
  RESEND_SECRET: env_resend_secret,
  API_BASE_URL: env_api_base_url,
  GOOGLE_CLIENT: env_google_client,
  GOOGLE_SECRET: env_google_secret,
  GOOGLE_CALLBACK: env_google_callback,
  BCRYPT_SALT_ROUNDS: env_bcrypt_salt_rounds
} = process.env
