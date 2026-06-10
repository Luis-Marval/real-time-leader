import {
  Injectable,
  Inject,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Game } from './entities/game';
import { UpdateGameDto } from './dto/update-game.dto';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(Game)
    private readonly GameRepository: Repository<Game>,
  ) {}

  async create(name: string, description: string) {
    try {
      let saveObject: { name: string; description: string };
      if (description !== undefined)
        saveObject = { name: name, description: description };
      else throw new Error('Ingrese la descripcion');
      await this.GameRepository.save(saveObject);
      return true;
    } catch (e: unknown) {
      if (e instanceof Error) {
        throw new Error(e.message);
      }
      throw new InternalServerErrorException();
    }
  }

  async find(searchElemet: number | string): Promise<Array<Game>> {
    try {
      let gameList: Game[] = [];
      if (typeof searchElemet == 'string') {
        gameList = await this.GameRepository.createQueryBuilder('game')
          .where('game.name LIKE :name', { name: `%${searchElemet}%` })
          .andWhere('game.isdelete = false')
          .getMany();
      }
      if (typeof searchElemet == 'number') {
        gameList = await this.GameRepository.findBy({
          id: searchElemet,
          isDelete: false,
        });
      }
      return gameList;
    } catch (e: unknown) {
      if (e instanceof Error) {
        throw new Error(e.message);
      }
      throw new InternalServerErrorException();
    }
  }

  async update(id: number, updategameDto: UpdateGameDto) {
    try {
      const game = await this.GameRepository.findOneBy({ id });
      if (!game) return new NotFoundException('Actividad no encontrada');
      if (updategameDto.description !== undefined)
        game.description = updategameDto.description;
      if (updategameDto.name !== undefined) game.name = updategameDto.name;
      await this.GameRepository.save(game);
      return true;
    } catch (e: unknown) {
      if (e instanceof Error) {
        throw new Error(e.message);
      }
      throw new InternalServerErrorException();
    }
  }

  async delete(id: number) {
    try {
      await this.GameRepository.update(id, {
        isDelete: true,
      });
      return true;
    } catch (e: unknown) {
      if (e instanceof Error) {
        throw new Error(e.message);
      }
      throw new InternalServerErrorException();
    }
  }
}
