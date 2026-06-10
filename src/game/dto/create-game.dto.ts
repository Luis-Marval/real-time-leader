import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateGameDTO {
  @IsString()
  @ApiProperty()
  name: string;
  @IsString()
  @ApiProperty()
  description: string;
}
