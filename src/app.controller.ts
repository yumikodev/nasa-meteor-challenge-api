import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly service: AppService) {}

  @Get()
  health() {
    return {
      message: 'NEO API WRAPPER',
      team: 'CAPIBARAS ESPACIALES',
      status: 200,
    };
  }

  @Get('feed')
  feed() {
    return this.service.getFeed();
  }
}
