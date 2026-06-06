import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class UserCreateDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name!: string;
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  correo!: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  password!: string;
}
