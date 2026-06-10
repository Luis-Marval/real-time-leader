import { IsDate, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TopPlayerBody {
  @IsNumber()
  @ApiProperty()
  id: number;
  @IsDate()
  @ApiProperty()
  initDate: Date | undefined;
  @IsDate()
  @ApiProperty()
  endDate: Date | undefined;
}
