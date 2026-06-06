import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { ActivitisController } from './game.controller';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from './entities/game';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([Game])],
  providers: [GameService],
  controllers: [ActivitisController],
})
export class ActivitisModule {}
