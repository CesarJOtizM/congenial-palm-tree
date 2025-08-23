import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { serverConfig } from './config/env.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });

  // Configurar validación global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  // Configurar CORS
  app.enableCors();

  const port = serverConfig.port || 3000;
  await app.listen(port);

  // eslint-disable-next-line no-console
  console.log(`🚀 Application running on http://localhost:${port}`);
  // eslint-disable-next-line no-console
  console.log(`🌍 Environment: ${serverConfig.environment}`);
}
bootstrap();
