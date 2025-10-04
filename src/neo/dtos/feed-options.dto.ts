import { ApiPropertyOptional } from '@nestjs/swagger';
import { isInt, IsInt, IsOptional, Max, Min } from 'class-validator';

export class FeedOptionsDto {
  @ApiPropertyOptional({
    description:
      'Indica si solo se deben mostrar los asteroides peligrosos o todos. (solo se acepta 0 y 1)',
  })
  @IsInt()
  @Min(0)
  @Max(1)
  @IsOptional()
  onlyHazardous?: number;

  @ApiPropertyOptional({
    description:
      'Limita la cantidad de asteroides a devolver (no aplica cuando onlyHazardous es 1).',
  })
  @IsInt()
  @Min(1)
  @Max(50)
  @IsOptional()
  limit?: number;
}
