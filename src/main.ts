import { NestFactory } from '@nestjs/core';
import { corsConfiguration } from './config/cors-configuration';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { json } from 'express';
import { HttpExceptionFilter } from './lib/filters/http-exception.filter';
import { CastObjectIdExceptionFilter } from './lib/filters/cast-object-id-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: corsConfiguration,
  });

  app.use(json({ limit: '10mb' }));

  app.disable('x-powered-by');

  app.useGlobalFilters(
    new HttpExceptionFilter(),
    new CastObjectIdExceptionFilter(),
  );

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  app.enableShutdownHooks();

  await app.listen(process.env.PORT || 8080, () => {
    new Logger().log(`API is started on PORT ${process.env.PORT || 8080}...`);
  });
}
bootstrap();
