import { Injectable } from '@nestjs/common';
import { UserSessionDTO } from '../auth/DTO/users-session.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/users';

interface UserWhere {
  id?: number;
  name?: string;
  correo?: string;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findUser(datos: UserWhere): Promise<UserSessionDTO | null> {
    try {
      const res = await this.usersRepository.findOne({
        select: { id: true, name: true, correo: true, password: true },
        where: datos,
      });
      return res;
    } catch (error: unknown) {
      console.error(error);
    }
  }

  userRankings(idU: number, idA?: number) {
    const ranking = this.usersRepository
      .createQueryBuilder('u')
      .select(['s.point as score', 'a.name as name'])
      .leftJoin('u.scores', 's')
      .leftJoin('s.game', 'a')
      .where('u.id  = :idU', { idU });
    if (idA !== undefined) {
      ranking.andWhere('a.id  = :idA', { idA });
    }
    ranking.andWhere('game.isdelete = false');
    const rest = ranking.getRawMany();
    return rest;
  }
}
