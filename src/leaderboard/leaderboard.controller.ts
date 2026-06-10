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
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('leaderboard')
export class LeaderboardController {
  constructor(private readonly leaderboardService: LeaderboardService) {}
  @Get('/:idGame')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Obtener leaderboard por ID de juego' })
  @ApiResponse({ status: 200, description: 'Leaderboard obtenido' })
  getLeaderboardById(@Param('idGame') idGame: number) {
    return this.leaderboardService.getLeaderboardByGame(idGame);
  }

  @Get('/')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Obtener todos los leaderboards' })
  @ApiResponse({ status: 200, description: 'Leaderboards obtenidos' })
  getAllLeaderboard() {
    return this.leaderboardService.getAllLeaderboardGame();
  }
}
