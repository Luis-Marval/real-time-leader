import { IsEmail, IsString, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserPayloadDTO {
  @IsNumber()
  @ApiProperty()
  id!: number;
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  username!: string;
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  email!: string;
}
