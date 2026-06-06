import { loadEnvFile } from 'node:process';
loadEnvFile('/app/.env');

export const appConfig = {
  dbPort: Number(process.env.DB_PORT) || 5434,
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASSWORD,
  dbHost: process.env.DB_HOST,
  dbDatabase: process.env.DB_DATABASE,
  secret: process.env.JWT_SECRET,
  Type: process.env.DB_TYPE,
};
