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

  // Define the /api/config endpoint
  server.get('/api/config', async (request, reply) => {
    reply.send({
      success: true,
      config: {
        environment: process.env.NODE_ENV || 'development',
        version: '1.0.0',
      },
    });
  });

  await app.listen(3000, '0.0.0.0');
}

bootstrap();