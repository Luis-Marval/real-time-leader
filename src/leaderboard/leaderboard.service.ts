import {
  Injectable,
  Inject,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GlideClient } from '@valkey/valkey-glide';
import { Game } from '../game/entities/game';
import { Repository } from 'typeorm';

export interface LeaderboardScore {
  score: number;
  element: string;
}

export interface AllLeaderboardScore {
  gameName: string;
  result: LeaderboardScore[];
}

@Injectable()
export class LeaderboardService {
  constructor(
    @InjectRepository(Game)
    private readonly gameRepository: Repository<Game>,
    @Inject('VALKEY_CLIENT') private readonly valkeyClient: GlideClient,
  ) {}

  async getLeaderboardByGame(idA: number) {
    try {
      let leaderBoard: Array<LeaderboardScore>;
      const response = await this.valkeyClient.zrangeWithScores(
        `leaderBoard:${idA}`,
        {
          start: 0,
          end: -1,
          type: 'byScore',
        },
        { reverse: true },
      );
      if (response == null || response.length == 0) {
        leaderBoard = await this.gameRepository
          .createQueryBuilder('a')
          .select(['u.name AS element', 's.point AS score'])
          .leftJoin('a.scores', 's')
          .leftJoin('s.user', 'u')
          .where('a.id = :idA', { idA })
          .orderBy('s.point', 'DESC')
          .getRawMany();
      }
      if (leaderBoard && leaderBoard.length > 0) {
        const membersScores: Record<string, number> = {};
        leaderBoard.forEach((item) => {
          membersScores[item.element] = item.score;
        });
        await this.valkeyClient.zadd(`leaderBoard:${idA}`, membersScores);
        return leaderBoard;
      }
      return response;
    } catch (e: unknown) {
      if (e instanceof Error) {
        throw new Error(e.message);
      }
      throw new InternalServerErrorException();
    }
  }

  async getAllLeaderboardGame(): Promise<Array<AllLeaderboardScore>> {
    const activities = await this.gameRepository.find({
      select: ['id', 'name'],
    });

    const leader: Array<AllLeaderboardScore> = [];

    for (const game of activities) {
      const cacheKey = `leaderBoard:${game.id}`;
      const cached = await this.valkeyClient.zrangeWithScores(
        cacheKey,
        {
          start: 0,
          end: -1,
          type: 'byScore',
        },
        { reverse: true },
      );
      let result: LeaderboardScore[];
      if (cached.length > 0) {
        result = cached as LeaderboardScore[];
      } else {
        result = (await this.getLeaderboardByGame(
          game.id,
        )) as LeaderboardScore[];
      }
      leader.push({
        gameName: game.name,
        result,
      });
    }

    return leader;
  }
}
