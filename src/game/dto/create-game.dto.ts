import { IsString } from 'class-validator';

export class CreateGameDTO {
  @IsString()
  name: string;
  @IsString()
  description: string;
}
