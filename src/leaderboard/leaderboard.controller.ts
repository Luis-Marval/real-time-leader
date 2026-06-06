import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service';
import { AuthGuard } from '../auth/guards/auth.guard';

@Controller('leaderboard')
export class LeaderboardController {
  constructor(private readonly leaderboardService: LeaderboardService) {}
  @Get('/:idGame')
  @UseGuards(AuthGuard)
  getLeaderboardById(@Param('idGame') idGame: number) {
    return this.leaderboardService.getLeaderboardByGame(idGame);
  }

  @Get('/')
  @UseGuards(AuthGuard)
  getAllLeaderboard() {
    return this.leaderboardService.getAllLeaderboardGame();
  }
}
