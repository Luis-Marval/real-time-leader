import { IsEmail, IsString, IsNotEmpty } from 'class-validator';
/* import { ApiProperty } from '@nestjs/swagger'; */
export class UserSessionDTO {
  id!: number;
  @IsString()
  /*   @ApiProperty() */
  name!: string;
  @IsEmail()
  @IsNotEmpty()
  /*   @ApiProperty() */
  correo!: string;
  @IsString()
  @IsNotEmpty()
  /*   @ApiProperty() */
  password!: string;
}
