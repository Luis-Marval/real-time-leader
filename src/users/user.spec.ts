import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/users';
import { UsersService } from './users.service';

describe('User Module', () => {
  let service: UsersService;
  let repository: Repository<User>;

  // Mock del QueryBuilder para el método userRankings
  const mockQueryBuilder = {
    select: jest.fn().mockReturnThis(),
    leftJoin: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    getRawMany: jest.fn().mockResolvedValue([{ score: 10, name: 'game 1' }]),
  };

  // Mock del repositorio de TypeORM
  const mockUsersRepository = {
    findOne: jest.fn().mockReturnThis(),
    createQueryBuilder: jest.fn(() => mockQueryBuilder),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUsersRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findUser', () => {
    it('debe retornar un usuario si existe', async () => {
      const mockUser = {
        id: 1,
        name: 'Test',
        correo: 'test@test.com',
        password: '123',
      };
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockUser as User);

      const result = await service.findUser({ id: 1 });
      expect(result).toEqual(mockUser);
      expect(repository.findOne).toHaveBeenCalledWith({
        select: { id: true, name: true, correo: true, password: true },
        where: { id: 1 },
      });
    });

    it('debe manejar errores del repositorio', async () => {
      jest
        .spyOn(repository, 'findOne')
        .mockRejectedValue(new Error('DB Error'));
      const consoleSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      const result = await service.findUser({ id: 1 });
      expect(result).toBeUndefined();
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('userRankings', () => {
    it('debe retornar el ranking sin filtro de actividad', async () => {
      const result = await service.userRankings(1);
      expect(result).toEqual([{ score: 10, name: 'game 1' }]);
      expect(mockQueryBuilder.where).toHaveBeenCalledWith('u.id  = :idU', {
        idU: 1,
      });
    });

    it('debe aplicar el filtro de actividad si idA es provisto', async () => {
      await service.userRankings(1, 5);
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('a.id  = :idA', {
        idA: 5,
      });
    });
  });
});
