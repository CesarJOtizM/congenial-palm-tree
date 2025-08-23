/* eslint-disable no-console */
/* eslint-disable turbo/no-undeclared-env-vars */
import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';

import { config } from 'dotenv';

/**
 * Tipos de entornos soportados
 */
export type Environment = 'development' | 'production' | 'staging' | 'test';

/**
 * Configuración de archivos de entorno por tipo
 */
const ENV_FILE_CONFIG = {
  development: '.env.development.local',
  production: '.env.production.local',
  staging: '.env.staging.local',
  test: '.env.test.local',
} as const;

/**
 * Obtiene el entorno actual desde NODE_ENV o usa 'development' por defecto
 */
export const getCurrentEnvironment = (): Environment => {
  const nodeEnv = process.env.NODE_ENV?.toLowerCase();

  if (nodeEnv === 'production') return 'production';
  if (nodeEnv === 'staging') return 'staging';
  if (nodeEnv === 'test') return 'test';

  return 'development';
};

/**
 * Busca la raíz del monorepo (donde están los archivos .env)
 */
const findMonorepoRoot = (): string => {
  let currentDir = process.cwd();

  // Buscar hacia arriba hasta encontrar package.json con workspaces
  while (currentDir !== '/') {
    const packageJsonPath = resolve(currentDir, 'package.json');

    if (existsSync(packageJsonPath)) {
      try {
        // Usar readFileSync en lugar de require() para compatibilidad con Turbopack
        const packageJsonContent = readFileSync(packageJsonPath, 'utf-8');
        const packageJson = JSON.parse(packageJsonContent);
        // Si tiene workspaces, es la raíz del monorepo
        if (packageJson.workspaces) {
          return currentDir;
        }
      } catch (error) {
        // Ignorar errores de parsing
        console.error(error);
      }
    }

    currentDir = resolve(currentDir, '..');
  }

  // Si no encuentra la raíz, usar el directorio actual
  return process.cwd();
};

/**
 * Carga las variables de entorno para el entorno especificado
 */
export const loadEnvConfig = (environment?: Environment): void => {
  const env = environment || getCurrentEnvironment();
  const monorepoRoot = findMonorepoRoot();
  const envFileName = ENV_FILE_CONFIG[env];
  const envFilePath = resolve(monorepoRoot, envFileName);

  console.log(`🔧 Configurando entorno: ${env}`);
  console.log(`📁 Raíz del monorepo: ${monorepoRoot}`);
  console.log(`📄 Archivo de entorno: ${envFileName}`);

  // Verificar si el archivo existe
  if (!existsSync(envFilePath)) {
    const exampleFilePath = resolve(monorepoRoot, `example.${envFileName}`);

    if (existsSync(exampleFilePath)) {
      console.warn(`⚠️  Archivo ${envFileName} no encontrado.`);
      console.warn(
        `💡 Copia ${`example.${envFileName}`} a ${envFileName} y configura las variables.`
      );
      console.warn(`   cp ${`example.${envFileName}`} ${envFileName}`);

      // Cargar el archivo example como fallback
      config({ path: exampleFilePath });
      console.log(`📋 Usando ${`example.${envFileName}`} como fallback.`);
    } else {
      console.warn(
        `⚠️  Ni ${envFileName} ni ${`example.${envFileName}`} encontrados.`
      );
      console.warn(
        `🔧 Las variables de entorno deben configurarse manualmente.`
      );
    }
  } else {
    // Cargar el archivo de entorno
    const result = config({ path: envFilePath });

    if (result.error) {
      console.error(`❌ Error cargando ${envFileName}:`, result.error);
      throw new Error(`Failed to load environment file: ${envFileName}`);
    } else {
      console.log(`✅ Variables de entorno cargadas desde ${envFileName}`);
    }
  }

  // Forzar NODE_ENV al entorno especificado
  // process.env.NODE_ENV = env;
};

/**
 * Inicializa la configuración de entorno automáticamente
 * Esta función se ejecuta al importar el módulo
 */
export const initializeEnvConfig = (): void => {
  // Solo cargar si no se ha cargado antes
  if (!process.env.__ENV_CONFIG_LOADED) {
    loadEnvConfig();
    process.env.__ENV_CONFIG_LOADED = 'true';
  }
};

/**
 * Información del entorno actual
 */
export const getEnvironmentInfo = () => {
  const env = getCurrentEnvironment();
  const monorepoRoot = findMonorepoRoot();
  const envFileName = ENV_FILE_CONFIG[env];
  const envFilePath = resolve(monorepoRoot, envFileName);

  return {
    environment: env,
    monorepoRoot,
    envFileName,
    envFilePath,
    fileExists: existsSync(envFilePath),
    nodeEnv: process.env.NODE_ENV,
  };
};
