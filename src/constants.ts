import { loadEnvFile } from 'node:process';
loadEnvFile('/app/.env');

export const appConfig = {
  dbPort: Number(process.env.DB_PORT) || 5434,
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASSWORD,
  dbHost: process.env.DB_HOST,
  dbDatabase: process.env.DB_DATABASE,

  secret: process.env.JWT_SECRET,
  accessTokenLifeTime: Number(process.env.ACCESSTOKEN_LIFETIME) || 30,
  refreshTokenLifeTime: Number(process.env.REFRESHTOKEN_LIFETIME) || 604800,

  valkeyHost: process.env.VALKEY_HOST,
  valkeyPORT: Number(process.env.VALKEY_PORT) || 6379,
  ValkeyPass: process.env.VALKEY_PASSWORD,
};

console.log(appConfig.accessTokenLifeTime, appConfig.refreshTokenLifeTime);
