import { IsNotEmpty, IsNumber } from 'class-validator';
export class SubmitScoreDTO {
  @IsNumber()
  @IsNotEmpty()
  userId!: number;
  @IsNumber()
  @IsNotEmpty()
  gameId!: number;
  @IsNumber()
  @IsNotEmpty()
  points!: number;
}
