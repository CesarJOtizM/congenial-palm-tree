import { z } from 'zod';

export const envSchema = z.object({
  // Variables básicas del servidor
  NODE_ENV: z
    .enum(['development', 'production', 'staging', 'test'])
    .default('development'),

  // Puerto de la aplicación
  PORT: z.coerce.number().default(3000),

  // Variables específicas de PostgreSQL
  POSTGRES_DB: z.string().optional(),
  POSTGRES_USER: z.string().optional(),
  POSTGRES_PASSWORD: z.string().optional(),
  DATABASE_URL: z.string().url().optional(),

  // Variables específicas de Redis
  REDIS_HOST: z.string().default('localhost'),
  REDIS_PORT: z.coerce.number().default(6379),

  // Variables específicas de JWT
  JWT_SECRET: z.string().min(32).optional(),
  JWT_EXPIRES_IN: z.string().default('24h'),
});

export type GlobalEnvTypes = z.infer<typeof envSchema>;
