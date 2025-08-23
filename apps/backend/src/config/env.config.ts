import { getEnvConfig } from '@repo/config/env';

/**
 * Configuración de entorno para la aplicación backend
 */
export const envConfig = getEnvConfig('core', 'server');

/**
 * Configuración de la base de datos
 */
export const databaseConfig = {
  url: envConfig.databaseUrl,
  postgres: envConfig.postgres,
};

/**
 * Configuración de JWT
 */
export const jwtConfig = {
  secret: envConfig.jwtSecret,
  expiresIn: envConfig.jwtExpiresIn,
};

/**
 * Configuración de Redis
 */
export const redisConfig = {
  host: envConfig.redis?.host,
  port: envConfig.redis?.port,
};

/**
 * Configuración del servidor
 */
export const serverConfig = {
  port: envConfig.port,
  environment: envConfig.environment.current,
  isDevelopment: envConfig.environment.isDev,
  isProduction: envConfig.environment.isProd,
  isStaging: envConfig.environment.isStaging,
  isTest: envConfig.environment.isTest,
};
