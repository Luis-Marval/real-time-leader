import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class userRecoverEmailDTO {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  email!: string;
}
