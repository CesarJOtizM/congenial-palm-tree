import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { serverConfig, validateEnvironment } from './config/env.config';

async function bootstrap() {
  // Validar variables de entorno críticas
  validateEnvironment();

  const app = await NestFactory.create(AppModule);

  const port = serverConfig.port;
  await app.listen(port);

  console.log(`🚀 Servidor backend ejecutándose en puerto ${port}`);
  console.log(`🌍 Entorno: ${serverConfig.environment}`);
}
bootstrap();
