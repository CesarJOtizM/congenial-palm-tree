import { getEnvConfig } from '@repo/config/env';

/**
 * Configuración de entorno para la aplicación backend
 * Usa el paquete @repo/config con contexto 'server' para obtener
 * todas las variables de entorno necesarias
 */
export const envConfig = getEnvConfig('server');

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
