import { IsEmail, IsString, IsNotEmpty, IsNumber } from 'class-validator';
export class UserPayloadDTO {
  @IsNumber()
  id!: number;
  @IsString()
  /*   @ApiProperty() */
  @IsString()
  @IsNotEmpty()
  username!: string;
  @IsEmail()
  @IsNotEmpty()
  email!: string;
}
