import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { GameModule } from './game/game.module';
import { appConfig } from './constants';
import { User } from './users/entities/users';
import { Game } from './game/entities/game';
import { ValkeyModule } from './valkey/valkey.module';
import { ScoreModule } from './score/score.module';
import { Score } from './score/entities/score.entity';
import { ThrottlerModule } from '@nestjs/throttler';
import { LeaderboardModule } from './leaderboard/leaderboard.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    GameModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: appConfig.dbHost,
      port: appConfig.dbPort,
      username: appConfig.dbUser,
      password: appConfig.dbPassword,
      database: appConfig.dbDatabase,
      entities: [User, Score, Game],
      synchronize: false,
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 10,
        },
      ],
    }),
    ValkeyModule,
    ScoreModule,
    LeaderboardModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
