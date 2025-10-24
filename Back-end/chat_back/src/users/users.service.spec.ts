import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { mockUser, createMockRepository } from '../test/test-setup';

describe('UsersService', () => {
  let service: UsersService;
  let repository: jest.Mocked<Repository<User>>;

  beforeEach(async () => {
    const mockRepository = createMockRepository();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'hashedPassword',
      };

      const createdUser = { ...mockUser, ...userData };
      repository.create.mockReturnValue(createdUser as User);
      repository.save.mockResolvedValue(createdUser as User);

      const result = await service.createUser(userData);

      expect(repository.create).toHaveBeenCalledWith(userData);
      expect(repository.save).toHaveBeenCalledWith(createdUser);
      expect(result).toEqual(createdUser);
    });

    it('should handle creation errors', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'hashedPassword',
      };

      repository.create.mockReturnValue(userData as User);
      repository.save.mockRejectedValue(new Error('Database error'));

      await expect(service.createUser(userData)).rejects.toThrow('Database error');
    });
  });

  describe('findByEmail', () => {
    it('should find user by email', async () => {
      const email = 'test@example.com';
      repository.findOne.mockResolvedValue(mockUser as User);

      const result = await service.findByEmail(email);

      expect(repository.findOne).toHaveBeenCalledWith({ where: { email } });
      expect(result).toEqual(mockUser);
    });

    it('should return null when user not found', async () => {
      const email = 'nonexistent@example.com';
      repository.findOne.mockResolvedValue(null);

      const result = await service.findByEmail(email);

      expect(repository.findOne).toHaveBeenCalledWith({ where: { email } });
      expect(result).toBeNull();
    });

    it('should handle find errors', async () => {
      const email = 'test@example.com';
      repository.findOne.mockRejectedValue(new Error('Database error'));

      await expect(service.findByEmail(email)).rejects.toThrow('Database error');
    });
  });

  describe('findById', () => {
    it('should find user by id', async () => {
      const id = 1;
      repository.findOne.mockResolvedValue(mockUser as User);

      const result = await service.findById(id);

      expect(repository.findOne).toHaveBeenCalledWith({ where: { id } });
      expect(result).toEqual(mockUser);
    });

    it('should return null when user not found', async () => {
      const id = 999;
      repository.findOne.mockResolvedValue(null);

      const result = await service.findById(id);

      expect(repository.findOne).toHaveBeenCalledWith({ where: { id } });
      expect(result).toBeNull();
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const users = [mockUser];
      repository.find.mockResolvedValue(users as User[]);

      const result = await service.findAll();

      expect(repository.find).toHaveBeenCalled();
      expect(result).toEqual(users);
    });

    it('should return empty array when no users', async () => {
      repository.find.mockResolvedValue([]);

      const result = await service.findAll();

      expect(repository.find).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });
});
