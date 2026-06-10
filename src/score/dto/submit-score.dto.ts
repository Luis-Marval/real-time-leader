import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SubmitScoreDTO {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  userId!: number;
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  gameId!: number;
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  points!: number;
}
