import { IsEmail, IsString, IsNotEmpty } from 'class-validator';
export class UserLoginDTO {
  @IsEmail()
  @IsNotEmpty()
  correo!: string;
  @IsString()
  @IsNotEmpty()
  password!: string;
}
