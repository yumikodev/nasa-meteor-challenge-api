import { IsNumber, IsOptional, IsPositive, Max, Min } from 'class-validator';

export class FeedOptionsDto {
  @IsNumber()
  @Min(0)
  @Max(1)
  @IsOptional()
  onlyHazardous?: number;
}
