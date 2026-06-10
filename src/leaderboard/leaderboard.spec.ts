import { Test, TestingModule } from '@nestjs/testing';
import { LeaderboardController } from './leaderboard.controller';
import { LeaderboardService } from './leaderboard.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Game } from '../game/entities/game';
import { AuthGuard } from '../auth/guards/auth.guard';
import { InternalServerErrorException } from '@nestjs/common';

describe('Leaderboard Module Tests', () => {
  let service: LeaderboardService;
  let controller: LeaderboardController;

  const mockGameRepository = {
    find: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  const mockValkeyClient = {
    zrangeWithScores: jest.fn(),
    zadd: jest.fn(),
  };

  const mockAuthGuard = {
    canActivate: jest.fn(() => true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LeaderboardController],
      providers: [
        LeaderboardService,
        {
          provide: getRepositoryToken(Game),
          useValue: mockGameRepository,
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

    service = module.get<LeaderboardService>(LeaderboardService);
    controller = module.get<LeaderboardController>(LeaderboardController);

    jest.clearAllMocks();
  });

  // ==========================================
  // PARTE 1: PRUEBAS DEL SERVICIO (LeaderboardService)
  // ==========================================
  describe('LeaderboardService', () => {
    describe('getLeaderboardByGame', () => {
      it('debe retornar datos de Valkey si existen en caché', async () => {
        const mockCache = [{ element: 'User1', score: 100 }];
        mockValkeyClient.zrangeWithScores.mockResolvedValue(mockCache);

        const result = await service.getLeaderboardByGame(1);

        expect(mockValkeyClient.zrangeWithScores).toHaveBeenCalled();
        expect(mockGameRepository.createQueryBuilder).not.toHaveBeenCalled();
        expect(result).toEqual(mockCache);
      });

      it('debe consultar DB y guardar en Valkey si la caché está vacía', async () => {
        mockValkeyClient.zrangeWithScores.mockResolvedValue([]);
        const mockDbData = [{ element: 'User2', score: 150 }];

        const mockQueryBuilder: any = {
          select: jest.fn().mockReturnThis(),
          leftJoin: jest.fn().mockReturnThis(),
          where: jest.fn().mockReturnThis(),
          orderBy: jest.fn().mockReturnThis(),
          getRawMany: jest.fn().mockResolvedValue(mockDbData),
        };
        mockGameRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);
        mockValkeyClient.zadd.mockResolvedValue(1);

        const result = await service.getLeaderboardByGame(1);

        expect(mockQueryBuilder.where).toHaveBeenCalledWith('a.id = :idA', {
          idA: 1,
        });
        expect(mockValkeyClient.zadd).toHaveBeenCalledWith('leaderBoard:1', {
          User2: 150,
        });
        expect(result).toEqual(mockDbData);
      });

      it('debe lanzar un error si ocurre una excepción', async () => {
        mockValkeyClient.zrangeWithScores.mockRejectedValue(
          new Error('Valkey Fail'),
        );

        await expect(service.getLeaderboardByGame(1)).rejects.toThrow(
          'Valkey Fail',
        );
      });
    });

    describe('getAllLeaderboardGame', () => {
      it('debe retornar la lista completa estructurada para todos los juegos usando caché o DB', async () => {
        mockGameRepository.find.mockResolvedValue([{ id: 1, name: 'Tetris' }]);
        mockValkeyClient.zrangeWithScores.mockResolvedValue([
          { element: 'User1', score: 90 },
        ]);

        const result = await service.getAllLeaderboardGame();

        expect(mockGameRepository.find).toHaveBeenCalledWith({
          select: ['id', 'name'],
        });
        expect(result).toEqual([
          {
            gameName: 'Tetris',
            result: [{ element: 'User1', score: 90 }],
          },
        ]);
      });
    });
  });

  // ==========================================
  // PARTE 2: PRUEBAS DEL CONTROLADOR (LeaderboardController)
  // ==========================================
  describe('LeaderboardController', () => {
    describe('getLeaderboardById', () => {
      it('debe llamar a service.getLeaderboardByGame con el id correspondiente', async () => {
        const spy = jest
          .spyOn(service, 'getLeaderboardByGame')
          .mockResolvedValue([]);

        const result = await controller.getLeaderboardById(1);

        expect(spy).toHaveBeenCalledWith(1);
        expect(result).toEqual([]);
      });
    });

    describe('getAllLeaderboard', () => {
      it('debe llamar a service.getAllLeaderboardGame', async () => {
        const spy = jest
          .spyOn(service, 'getAllLeaderboardGame')
          .mockResolvedValue([]);

        const result = await controller.getAllLeaderboard();

        expect(spy).toHaveBeenCalled();
        expect(result).toEqual([]);
      });
    });
  });
});
