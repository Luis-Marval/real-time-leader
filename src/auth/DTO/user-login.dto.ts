import { IsEmail, IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserLoginDTO {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  correo!: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  password!: string;
}
