import { Controller, Post, Body, Get, Query, UseGuards } from '@nestjs/common';
import { ScoreService } from './score.service';
import { SubmitScoreDTO } from './dto/submit-score.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { TopPlayerBody } from './dto/top-player-body.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('score')
export class ScoreController {
  constructor(private readonly scoreService: ScoreService) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Enviar puntuación' })
  @ApiResponse({ status: 201, description: 'Puntuación enviada correctamente' })
  create(@Body() submitdata: SubmitScoreDTO) {
    return this.scoreService.submitScore(submitdata);
  }

  @Get('/topPlayers')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Obtener reporte de mejores jugadores' })
  @ApiResponse({
    status: 200,
    description: 'Reporte de mejores jugadores obtenido',
  })
  topPlayersReport(@Query() playerData: TopPlayerBody) {
    return this.scoreService.findTopPlayers(playerData);
  }

  @Get()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Obtener puntuación más alta por ID de juego' })
  @ApiResponse({ status: 200, description: 'Puntuación más alta obtenida' })
  findOne(@Query('idgame') idgame: number) {
    return this.scoreService.findHighestScore(idgame);
  }
}
