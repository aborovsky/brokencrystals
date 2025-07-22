import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import fastify from 'fastify';

async function bootstrap() {
  const server = fastify({
    logger: true,
  });

  const app: NestFastifyApplication = await NestFactory.create(
    AppModule,
    new FastifyAdapter(server),
  );

  await app.listen(3000, '0.0.0.0');
}

bootstrap();