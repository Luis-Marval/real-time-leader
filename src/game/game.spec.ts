import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { Game } from './entities/game';
import { GameService } from './game.service';
import { ActivitisController } from './game.controller';
import { AuthGuard } from '../auth/guards/auth.guard';

describe('Game Module', () => {
  let service: GameService;
  let repository: Repository<Game>;
  let controller: ActivitisController;
  const mockQueryBuilder = {
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    getMany: jest
      .fn()
      .mockResolvedValue([
        { id: 1, name: 'game 1', description: 'description' },
      ]),
  };

  // Mock del repositorio de TypeORM
  const mockGameRepository = {
    findOneBy: jest.fn(() => {
      return {
        id: 28,
        name: 'nombre de la actividad',
        description: 'descripcion de la actividad',
      };
    }),
    save: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    findOne: jest.fn().mockReturnThis(),
    createQueryBuilder: jest.fn(() => mockQueryBuilder),
    findBy: jest.fn().mockReturnThis(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ActivitisController],
      providers: [
        GameService,
        {
          provide: getRepositoryToken(Game),
          useValue: mockGameRepository,
        },
      ],
    })
      .overrideGuard(AuthGuard) // reemplaza el guard real
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();
    service = module.get<GameService>(GameService);
    repository = module.get<Repository<Game>>(getRepositoryToken(Game));
    controller = module.get<ActivitisController>(ActivitisController);
  });

  describe('gameService', () => {
    describe('createGame', () => {
      it('create a new game', async () => {
        const mockCreateGame = {
          id: 28,
          name: 'nombre de la actividad',
          description: 'descripcion de la actividad',
        };

        mockGameRepository.save.mockResolvedValue(mockCreateGame);

        const result = await service.create(
          mockCreateGame.name,
          mockCreateGame.description,
        );
        expect(repository.save).toHaveBeenCalled();
        expect(result).toEqual(true);
      });
      it('manage error in create game', async () => {
        mockGameRepository.save.mockRejectedValue(
          new Error('Error en crear la actividad'),
        );

        await expect(
          service.create(
            'nombre de la actividad',
            'descripcion de la actividad',
          ),
        ).rejects.toThrow('Error en crear la actividad');
      });
    });

    describe('findgame', () => {
      const mockFindGame = [
        {
          id: 28,
          name: 'nombre de la actividad',
          description: 'descripcion de la actividad',
        },
      ];
      it('find one Game by number', async () => {
        mockGameRepository.findBy.mockResolvedValue(mockFindGame);

        const result = await service.find(mockFindGame[0].id);
        expect(repository.findBy).toHaveBeenCalled();
        expect(result).toEqual(mockFindGame);
      });
      it('find one game by name', async () => {
        const result = await service.find(mockFindGame[0].name);
        expect(result).toEqual([
          {
            id: 1,
            name: 'game 1',
            description: 'description',
          },
        ]);
        expect(mockQueryBuilder.where).toHaveBeenCalledWith(
          'game.name LIKE :name',
          { name: `%${mockFindGame[0].name}%` },
        );
        expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
          'game.isdelete = false',
        );
      });
      it('find a delete astivity', async () => {
        mockGameRepository.findBy.mockResolvedValue([]);

        const result = await service.find(mockFindGame[0].id);
        expect(repository.findBy).toHaveBeenCalled();
        expect(repository.findBy).toHaveBeenCalledWith({
          id: mockFindGame[0].id,
          isDelete: false,
        });
        expect(result).toEqual([]);
      });
    });

    describe('update', () => {
      const mockUpdateGame = {
        id: 28,
        name: 'nuevo nombre de la actividad',
        description: 'nueva descripcion de la actividad',
      };
      it('update one game', async () => {
        mockGameRepository.save.mockResolvedValue(mockUpdateGame);

        const result = await service.update(mockUpdateGame.id, {
          name: mockUpdateGame.name,
          description: mockUpdateGame.description,
        });
        expect(repository.save).toHaveBeenCalledWith(mockUpdateGame);
        expect(result).toEqual(true);
      });
    });

    describe('delete', () => {
      const mockFindGame = [
        {
          id: 28,
          name: 'nombre de la actividad',
          description: 'descripcion de la actividad',
        },
      ];
      it('delete one game', async () => {
        mockGameRepository.save.mockResolvedValue(mockFindGame);

        const result = await service.delete(mockFindGame[0].id);
        expect(repository.update).toHaveBeenCalled();
        expect(result).toEqual(true);
      });
    });
  });

  describe('ScoreController', () => {
    describe('create', () => {
      it('debe llamar a service.submitScore', async () => {
        const dto = { userId: 1, gameId: 10, points: 100 };
        const spy = jest.spyOn(service, 'create').mockResolvedValue(true);

        const result = await controller.createGame({
          name: 'nueva actividad',
          description: 'descripcond',
        });

        expect(spy).toHaveBeenCalledWith(dto);
        expect(result).toBe(true);
      });
    });
  });
});
