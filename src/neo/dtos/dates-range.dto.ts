import { IsDate, IsOptional } from 'class-validator';

export class DateRangeDto {
  @IsDate()
  @IsOptional()
  start_date?: Date;

  @IsDate()
  @IsOptional()
  end_date?: Date;
}
