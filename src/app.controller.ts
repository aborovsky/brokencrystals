import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller('api')
@ApiTags('App')
export class AppController {
  @Get('config')
  getConfig() {
    return { status: 'ok', message: 'Configuration endpoint is operational.' };
  }
}