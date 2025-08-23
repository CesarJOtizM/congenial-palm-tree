import { getEnvClientConfig } from '@repo/config/env';

const envConfig = getEnvClientConfig();

export const apiConfig = {
  url: envConfig.api.url,
  version: envConfig.api.version,
};
