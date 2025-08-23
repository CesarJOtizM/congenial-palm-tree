export * from './generated/client';

import { PrismaClient } from './generated/client';

declare global {
  var DB: PrismaClient;
}

let client: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  client = new PrismaClient();
} else {
  if (!global.DB) {
    global.DB = new PrismaClient();
  }
  client = global.DB;
  client.$connect();
}

export { client };
