import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class FeedOptionsDto {
  @ApiPropertyOptional({
    description:
      'Indica si solo se deben mostrar los asteroides peligrosos o todos. (solo se acepta 0 y 1)',
    examples: [0, 1],
  })
  @IsInt()
  @Min(0)
  @Max(1)
  @IsOptional()
  onlyHazardous?: number;
}
