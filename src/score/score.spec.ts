import { Test, TestingModule } from '@nestjs/testing';
import { ScoreController } from './score.controller';
import { ScoreService } from './score.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Score } from './entities/score.entity';
import { AuthGuard } from '../auth/guards/auth.guard';
import { ExecutionContext } from '@nestjs/common';

describe('Score Module Tests', () => {
  let service: ScoreService;
  let controller: ScoreController;

  const mockScoreRepository = {
    save: jest.fn(),
    findOneBy: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  const mockValkeyClient = {
    del: jest.fn(),
  };

  const mockAuthGuard = {
    canActivate: jest.fn(() => true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScoreController],
      providers: [
        ScoreService,
        {
          provide: getRepositoryToken(Score),
          useValue: mockScoreRepository,
        },
        {
          provide: 'VALKEY_CLIENT',
          useValue: mockValkeyClient,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue(mockAuthGuard)
      .compile();

    service = module.get<ScoreService>(ScoreService);
    controller = module.get<ScoreController>(ScoreController);

    jest.clearAllMocks();
  });

  // ==========================================
  // PARTE 1: PRUEBAS DEL SERVICIO (ScoreService)
  // ==========================================
  describe('ScoreService', () => {
    describe('submitScore', () => {
      it('debe guardar el puntaje e invalidar la caché de Valkey', async () => {
        const dto = { userId: 1, gameId: 10, points: 100 };
        mockScoreRepository.save.mockResolvedValue(true);
        mockValkeyClient.del.mockResolvedValue(1);

        const result = await service.submitScore(dto);

        expect(mockScoreRepository.save).toHaveBeenCalledWith([
          { userId: 1, gameId: 10, point: 100 },
        ]);
        expect(mockValkeyClient.del).toHaveBeenCalledWith(['leaderBoard:10']);
        expect(result).toBe(true);
      });
    });

    describe('findHighestScore', () => {
      it('debe retornar el puntaje más alto del juego', async () => {
        mockScoreRepository.findOneBy.mockResolvedValue({ point: 250 });

        const result = await service.findHighestScore(10);

        expect(mockScoreRepository.findOneBy).toHaveBeenCalledWith({
          gameId: 10,
        });
        expect(result).toEqual({ score: 250 });
      });

      it('debe lanzar un error si la consulta falla', async () => {
        mockScoreRepository.findOneBy.mockRejectedValue(new Error('DB Error'));

        await expect(service.findHighestScore(10)).rejects.toThrow('DB Error');
      });
    });

    describe('findTopPlayers', () => {
      it('debe construir la query correctamente y retornar los mejores jugadores', async () => {
        const mockQueryBuilder: any = {
          select: jest.fn().mockReturnThis(),
          leftJoin: jest.fn().mockReturnThis(),
          where: jest.fn().mockReturnThis(),
          andWhere: jest.fn().mockReturnThis(),
          orderBy: jest.fn().mockReturnThis(),
          limit: jest.fn().mockReturnThis(),
          getRawMany: jest
            .fn()
            .mockResolvedValue([{ name: 'Player1', point: 500 }]),
        };

        mockScoreRepository.createQueryBuilder.mockReturnValue(
          mockQueryBuilder,
        );

        const dto = {
          id: 5,
          initDate: new Date('2026-01-01'),
          endDate: new Date('2026-12-31'),
        };
        const result = await service.findTopPlayers(dto);

        expect(mockScoreRepository.createQueryBuilder).toHaveBeenCalledWith(
          's',
        );
        expect(mockQueryBuilder.where).toHaveBeenCalledWith('a.id = :id', {
          id: 5,
        });
        expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
          'game.isdelete = false',
        );
        expect(mockQueryBuilder.limit).toHaveBeenCalledWith(5);
        expect(result).toEqual([{ name: 'Player1', point: 500 }]);
      });
    });
  });

  // ==========================================
  // PARTE 2: PRUEBAS DEL CONTROLADOR (ScoreController)
  // ==========================================
  describe('ScoreController', () => {
    describe('create', () => {
      it('debe llamar a service.submitScore', async () => {
        const dto = { userId: 1, gameId: 10, points: 100 };
        const spy = jest.spyOn(service, 'submitScore').mockResolvedValue(true);

        const result = await controller.create(dto);

        expect(spy).toHaveBeenCalledWith(dto);
        expect(result).toBe(true);
      });
    });

    describe('topPlayersReport', () => {
      it('debe llamar a service.findTopPlayers', async () => {
        const dto = { id: 5, initDate: undefined, endDate: undefined };
        const spy = jest.spyOn(service, 'findTopPlayers').mockResolvedValue([]);

        const result = await controller.topPlayersReport(dto);

        expect(spy).toHaveBeenCalledWith(dto);
        expect(result).toEqual([]);
      });
    });

    describe('findOne', () => {
      it('debe llamar a service.findHighestScore', async () => {
        const spy = jest
          .spyOn(service, 'findHighestScore')
          .mockResolvedValue({ score: 99 });

        const result = await controller.findOne(10);

        expect(spy).toHaveBeenCalledWith(10);
        expect(result).toEqual({ score: 99 });
      });
    });
  });
});
