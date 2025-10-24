import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConversationsService } from './conversations.service';
import { Conversation } from './conversation.entity';
import { mockConversation, mockUser, createMockRepository } from '../test/test-setup';

describe('ConversationsService', () => {
  let service: ConversationsService;
  let repository: jest.Mocked<Repository<Conversation>>;

  beforeEach(async () => {
    const mockRepository = createMockRepository();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConversationsService,
        {
          provide: getRepositoryToken(Conversation),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ConversationsService>(ConversationsService);
    repository = module.get(getRepositoryToken(Conversation));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createConversation', () => {
    it('should create a new conversation', async () => {
      const conversationData = {
        name: 'Test Conversation',
        userIds: [1, 2],
      };

      const createdConversation = { ...mockConversation, ...conversationData };
      repository.create.mockReturnValue(createdConversation as Conversation);
      repository.save.mockResolvedValue(createdConversation as Conversation);

      const result = await service.createConversation(conversationData);

      expect(repository.create).toHaveBeenCalledWith(conversationData);
      expect(repository.save).toHaveBeenCalledWith(createdConversation);
      expect(result).toEqual(createdConversation);
    });

    it('should handle creation errors', async () => {
      const conversationData = {
        name: 'Test Conversation',
        userIds: [1, 2],
      };

      repository.create.mockReturnValue(conversationData as Conversation);
      repository.save.mockRejectedValue(new Error('Database error'));

      await expect(service.createConversation(conversationData)).rejects.toThrow('Database error');
    });
  });

  describe('findByUserId', () => {
    it('should find conversations by user id', async () => {
      const userId = 1;
      const conversations = [mockConversation];
      
      repository.find.mockResolvedValue(conversations as Conversation[]);

      const result = await service.findByUserId(userId);

      expect(repository.find).toHaveBeenCalledWith({
        where: { users: { id: userId } },
        relations: ['users'],
        order: { updatedAt: 'DESC' },
      });
      expect(result).toEqual(conversations);
    });

    it('should return empty array when no conversations found', async () => {
      const userId = 999;
      repository.find.mockResolvedValue([]);

      const result = await service.findByUserId(userId);

      expect(repository.find).toHaveBeenCalledWith({
        where: { users: { id: userId } },
        relations: ['users'],
        order: { updatedAt: 'DESC' },
      });
      expect(result).toEqual([]);
    });

    it('should handle find errors', async () => {
      const userId = 1;
      repository.find.mockRejectedValue(new Error('Database error'));

      await expect(service.findByUserId(userId)).rejects.toThrow('Database error');
    });
  });

  describe('findById', () => {
    it('should find conversation by id', async () => {
      const id = 1;
      repository.findOne.mockResolvedValue(mockConversation as Conversation);

      const result = await service.findById(id);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id },
        relations: ['users'],
      });
      expect(result).toEqual(mockConversation);
    });

    it('should return null when conversation not found', async () => {
      const id = 999;
      repository.findOne.mockResolvedValue(null);

      const result = await service.findById(id);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id },
        relations: ['users'],
      });
      expect(result).toBeNull();
    });
  });

  describe('findAll', () => {
    it('should return all conversations', async () => {
      const conversations = [mockConversation];
      repository.find.mockResolvedValue(conversations as Conversation[]);

      const result = await service.findAll();

      expect(repository.find).toHaveBeenCalledWith({
        relations: ['users'],
        order: { updatedAt: 'DESC' },
      });
      expect(result).toEqual(conversations);
    });

    it('should return empty array when no conversations', async () => {
      repository.find.mockResolvedValue([]);

      const result = await service.findAll();

      expect(repository.find).toHaveBeenCalledWith({
        relations: ['users'],
        order: { updatedAt: 'DESC' },
      });
      expect(result).toEqual([]);
    });
  });

  describe('updateConversation', () => {
    it('should update conversation', async () => {
      const id = 1;
      const updateData = { name: 'Updated Conversation' };
      const updatedConversation = { ...mockConversation, ...updateData };

      repository.findOne.mockResolvedValue(mockConversation as Conversation);
      repository.save.mockResolvedValue(updatedConversation as Conversation);

      const result = await service.updateConversation(id, updateData);

      expect(repository.findOne).toHaveBeenCalledWith({ where: { id } });
      expect(repository.save).toHaveBeenCalledWith({
        ...mockConversation,
        ...updateData,
      });
      expect(result).toEqual(updatedConversation);
    });

    it('should return null when conversation not found', async () => {
      const id = 999;
      const updateData = { name: 'Updated Conversation' };

      repository.findOne.mockResolvedValue(null);

      const result = await service.updateConversation(id, updateData);

      expect(repository.findOne).toHaveBeenCalledWith({ where: { id } });
      expect(result).toBeNull();
    });
  });
});
