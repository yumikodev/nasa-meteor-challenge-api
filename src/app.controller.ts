import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
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
  @ApiOperation({
    summary:
      'Obtener todos los asteroides más cercanos en un rango de una semana (usando la fecha de la petición como inicio).',
  })
  feed(@Query() options: FeedOptionsDto) {
    return this.service.getFeed(options);
  }

  @Get('asteroids/:asteroidId')
  @ApiOperation({
    summary: 'Obten los datos específicos de un asteroide por su ID.',
  })
  details(@Param('asteroidId') asteroidId: string) {
    return this.service.getDetails(asteroidId);
  }
}
