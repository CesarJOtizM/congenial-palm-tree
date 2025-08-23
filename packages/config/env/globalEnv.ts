import {
  getCurrentEnvironment,
  getEnvironmentInfo,
  initializeEnvConfig,
} from './envLoader';
import { GlobalEnvTypes, envSchema } from './schemas/envSchema';

// Inicializar la configuración de entorno antes de parsear
initializeEnvConfig();

const globalEnv: GlobalEnvTypes = envSchema.parse(process.env);

export const getEnvServerConfig = () => {
  const currentEnv = getCurrentEnvironment();
  const envInfo = getEnvironmentInfo();

  const isDev = globalEnv.NODE_ENV === 'development';
  const isProd = globalEnv.NODE_ENV === 'production';
  const isStaging = globalEnv.NODE_ENV === 'staging';
  const isTest = globalEnv.NODE_ENV === 'test';

  const baseConfig = {
    // Información del entorno
    environment: {
      current: currentEnv,
      nodeEnv: globalEnv.NODE_ENV,
      isDev,
      isProd,
      isStaging,
      isTest,
      info: envInfo,
    },
    port: globalEnv.PORT,
  };

  const serverConfig = {
    databaseUrl: globalEnv.DATABASE_URL,
    jwtSecret: globalEnv.JWT_SECRET,
    jwtExpiresIn: globalEnv.JWT_EXPIRES_IN,
    postgres: {
      database: globalEnv.POSTGRES_DB,
      user: globalEnv.POSTGRES_USER,
      password: globalEnv.POSTGRES_PASSWORD,
    },
    redis: {
      host: globalEnv.REDIS_HOST,
      port: globalEnv.REDIS_PORT,
    },
  };

  const finalConfig = {
    ...baseConfig,
    ...serverConfig,
  };

  return finalConfig;
};

export const getEnvClientConfig = () => {
  const currentEnv = getCurrentEnvironment();
  const envInfo = getEnvironmentInfo();

  const isDev = globalEnv.NODE_ENV === 'development';
  const isProd = globalEnv.NODE_ENV === 'production';
  const isStaging = globalEnv.NODE_ENV === 'staging';
  const isTest = globalEnv.NODE_ENV === 'test';

  const baseConfig = {
    // Información del entorno
    environment: {
      current: currentEnv,
      nodeEnv: globalEnv.NODE_ENV,
      isDev,
      isProd,
      isStaging,
      isTest,
      info: envInfo,
    },
    port: globalEnv.PORT,
  };

  const clientConfig = {
    api: {
      url: globalEnv.NEXT_PUBLIC_API_URL,
      version: globalEnv.NEXT_PUBLIC_API_VERSION,
    },
  };

  const finalConfig = {
    ...baseConfig,
    ...clientConfig,
  };

  return finalConfig;
};
