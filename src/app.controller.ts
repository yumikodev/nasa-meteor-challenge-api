import { Controller, Get, Param, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { FeedOptionsDto } from './neo/dtos/feed-options.dto';

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

  @Get('asteroids')
  feed(@Query() options: FeedOptionsDto) {
    return this.service.getFeed(options);
  }

  @Get('asteroids/:asteroidId')
  info(@Param('asteroidId') asteroidId: string) {
    return this.service.getDetails(asteroidId);
  }
}
