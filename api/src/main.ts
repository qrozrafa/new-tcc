import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { LogInterceptor } from './interceptors/log.interceptors';
import * as dotenv from 'dotenv';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new LogInterceptor());
  app.use(
    '/uploads',
    express.static(join(__dirname, '..', 'storage', 'subject')),
  );
  app.use('/uploads', express.static(join(__dirname, '..', 'storage', 'user')));
  app.enableCors();
  await app.listen(3002);
}
bootstrap();
