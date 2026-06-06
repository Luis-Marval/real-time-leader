import { IsDate, IsNumber } from 'class-validator';
export class TopPlayerBody {
  @IsNumber()
  id: number;
  @IsDate()
  initDate: Date | undefined;
  @IsDate()
  endDate: Date | undefined;
}
