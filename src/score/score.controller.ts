import { Controller, Post, Body, Get, Query, UseGuards } from '@nestjs/common';
import { ScoreService } from './score.service';
import { SubmitScoreDTO } from './dto/submit-score.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { TopPlayerBody } from './dto/top-player-body.dto';

@Controller('score')
export class ScoreController {
  constructor(private readonly scoreService: ScoreService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() submitdata: SubmitScoreDTO) {
    return this.scoreService.submitScore(submitdata);
  }

  @Get('/topPlayers')
  @UseGuards(AuthGuard)
  topPlayersReport(@Query() playerData: TopPlayerBody) {
    return this.scoreService.findTopPlayers(playerData);
  }

  @Get()
  @UseGuards(AuthGuard)
  findOne(@Query('idgame') idgame: number) {
    return this.scoreService.findHighestScore(idgame);
  }
}
