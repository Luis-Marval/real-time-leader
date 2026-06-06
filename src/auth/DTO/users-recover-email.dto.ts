import { IsEmail, IsNotEmpty } from 'class-validator';
export class userRecoverEmailDTO {
  @IsEmail()
  @IsNotEmpty()
  email!: string;
}
