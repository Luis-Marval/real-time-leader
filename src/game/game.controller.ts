import {
  Controller,
  UseGuards,
  Get,
  Body,
  Query,
  Post,
  Param,
  BadRequestException,
  Patch,
  Delete,
} from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { GameService } from './game.service';
import { CreateGameDTO } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';

@Controller('game')
export class ActivitisController {
  constructor(private GameService: GameService) {}

  @Post('')
  @UseGuards(AuthGuard)
  async createGame(@Body() createActivitDTO: CreateGameDTO) {
    if (createActivitDTO.name == undefined)
      throw new BadRequestException('Ingrese el nombre de la actividad');
    if (createActivitDTO.description == undefined)
      throw new BadRequestException('Ingrese la descripcion de la actividad');
    await this.GameService.create(
      createActivitDTO.name,
      createActivitDTO.description,
    );
    return { status: 'Actividad creada correctamente' };
  }

  @Get('/')
  @UseGuards(AuthGuard)
  findGame(@Query('name') name?: string) {
    if (name == undefined)
      throw new BadRequestException('Ingrese el nombre de la actividad');
    return this.GameService.find(name);
  }

  @Get('/:id')
  @UseGuards(AuthGuard)
  findGameById(@Param('id') id?: number) {
    if (id == undefined)
      throw new BadRequestException('Ingrese el id de la actividad');
    return this.GameService.find(Number(id));
  }

  @Patch('/:id')
  @UseGuards(AuthGuard)
  async update(@Param('id') id: number, @Body() UpdateGameDto: UpdateGameDto) {
    try {
      await this.GameService.update(Number(id), UpdateGameDto);
      return { status: true, message: 'actividad actualizada exitosamente' };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Delete('/:id')
  @UseGuards(AuthGuard)
  async delete(@Param('id') id: number) {
    try {
      await this.GameService.delete(Number(id));
      return { status: true, message: 'actividad eliminada exitosamente' };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
