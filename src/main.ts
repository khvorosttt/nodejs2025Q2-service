import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { parse } from 'yaml';
import { SwaggerModule } from '@nestjs/swagger';
import { LoggingInterceptor } from './logging/logging.interceptor';
import { LoggingService } from './logging/logging.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  const docsFile = await readFile(
    join(process.cwd(), '/doc/api.yaml'),
    'utf-8',
  );
  app.useGlobalInterceptors(new LoggingInterceptor(new LoggingService()));
  SwaggerModule.setup('doc', app, parse(docsFile));
  console.log('Swagger start on path http://localhost:4000/doc');
  await app.listen(process.env.PORT || 4000);
}
bootstrap();
