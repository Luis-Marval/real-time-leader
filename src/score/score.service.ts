import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GlideClient } from '@valkey/valkey-glide';
import { Repository } from 'typeorm';
import { Score } from './entities/score.entity';
import { SubmitScoreDTO } from './dto/submit-score.dto';
import { TopPlayerBody } from './dto/top-player-body.dto';

@Injectable()
export class ScoreService {
  constructor(
    @InjectRepository(Score)
    private readonly scoreRepository: Repository<Score>,
    @Inject('VALKEY_CLIENT') private readonly valkeyClient: GlideClient,
  ) {}

  async submitScore(submitScore: SubmitScoreDTO) {
    await this.scoreRepository.save([
      {
        userId: submitScore.userId,
        gameId: submitScore.gameId,
        point: submitScore.points,
      },
    ]);
    await this.valkeyClient.del([`leaderBoard:${submitScore.gameId}`]);
    return true;
  }

  async findHighestScore(idA: number) {
    try {
      const dataScore: { point: number } = await this.scoreRepository.findOneBy(
        {
          gameId: idA,
        },
      );
      return { score: dataScore.point };
    } catch (error: unknown) {
      if (error instanceof Error) throw new Error(error.message);
      else throw new Error('Error desconocido');
    }
  }

  async findTopPlayers({ id, initDate, endDate }: TopPlayerBody) {
    const reportQuery = this.scoreRepository
      .createQueryBuilder('s')
      .select(['u.name AS username', 's.point AS score'])
      .leftJoin('game', 'a', 's.gameId = a.id')
      .leftJoin('users', 'u', 's.userId = u.id')
      .where('a.id = :id', { id: id })
      .andWhere('game.isdelete = false');
    if (initDate !== undefined) {
      reportQuery.andWhere('s.create_date >= :initDate', {
        initDate: initDate,
      });
    }
    if (endDate !== undefined) {
      reportQuery.andWhere('s.create_date <= :endDate', { endDate: endDate });
    }
    const reportList: Array<{
      name: string;
      point: number;
    }> = await reportQuery.orderBy('s.point', 'DESC').limit(5).getRawMany();
    return reportList;
  }
}
