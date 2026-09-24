import { ConsoleLogger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configureApp } from './app.setup';
import { loadConfig } from './config';

async function bootstrap() {
  const config = loadConfig();
  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger({ json: config.logJson }),
  });
  configureApp(app);
  await app.listen(config.port, '0.0.0.0');
}

void bootstrap();
