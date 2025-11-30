import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { parse } from 'yaml';
import { SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  const docsFile = await readFile(join(__dirname, '../doc/api.yaml'), 'utf-8');
  SwaggerModule.setup('doc', app, parse(docsFile));
  console.log('Swagger start on path http://localhost:4000/doc');
  await app.listen(process.env.PORT || 4000);
}
bootstrap();
