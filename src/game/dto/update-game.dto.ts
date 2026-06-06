import { PartialType } from '@nestjs/swagger';
import { CreateGameDTO } from './create-game.dto';

export class UpdateGameDto extends PartialType(CreateGameDTO) {}
