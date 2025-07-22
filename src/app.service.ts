import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from './app.config.api';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(private readonly configService: ConfigService) {}

  getConfig(): AppConfig {
    this.logger.debug('Called getConfig');
    const dbSchema = this.configService.get<string>('DATABASE_SCHEMA');
    const dbHost = this.configService.get<string>('DATABASE_HOST');
    const dbPort = this.configService.get<string>('DATABASE_PORT');
    const dbUser = this.configService.get<string>('DATABASE_USER');
    const dbPwd = this.configService.get<string>('DATABASE_PASSWORD');

    return {
      awsBucket: this.configService.get<string>('AWS_BUCKET'),
      sql: `postgres://${dbUser}:${dbPwd}@${dbHost}:${dbPort}/${dbSchema}`,
      googlemaps: this.configService.get<string>('GOOGLE_MAPS')
    };
  }
}
