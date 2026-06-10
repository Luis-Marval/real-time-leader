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

  userRankings(idU: number, idG?: number) {
    const ranking = this.usersRepository
      .createQueryBuilder('u')
      .select(['s.point as score', 'g.name as name'])
      .leftJoin('u.scores', 's')
      .leftJoin('s.game', 'g')
      .where('u.id  = :idU', { idU });
    if (idG !== undefined && idG !== null) {
      const idGNumber = Number(idG);
      if (!isNaN(idGNumber)) {
        ranking.andWhere('g.id  = :idG', { idG: idGNumber });
      }
    }
    ranking.andWhere('g.isdelete = false');
    const rest = ranking.getRawMany();
    return rest;
  }
}
