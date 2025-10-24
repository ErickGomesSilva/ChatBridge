import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MessagesService } from './messages.service';
import { Message } from './message.entity';
import { MessagesGateway } from './message.gateway';
import { User } from '../users/user.entity';
import { Conversation } from '../conversations/conversation.entity';
import { createMockRepository } from '../test/test-setup';

// Mock data based on actual entity structure
const mockUser: User = {
  id: '1',
  email: 'test@example.com',
  password: 'hashedPassword',
  createdAt: new Date(),
  updatedAt: new Date(),
} as User;

const mockConversation: Conversation = {
  id: '1',
  user1: mockUser,
  user2: mockUser,
  messages: [],
  createdAt: new Date(),
  updatedAt: new Date(),
  lastMessageText: 'Test message',
} as Conversation;

const mockMessage: Message = {
  id: '1',
  text: 'Test message',
  createdAt: new Date(),
  sender: mockUser,
  conversation: mockConversation,
} as Message;

describe('MessagesService', () => {
  let service: MessagesService;
  let repository: jest.Mocked<Repository<Message>>;
  let gateway: jest.Mocked<MessagesGateway>;

  beforeEach(async () => {
    const mockRepository = createMockRepository();
    const mockGateway = {
      emitNewMessage: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessagesService,
        {
          provide: getRepositoryToken(Message),
          useValue: mockRepository,
        },
        {
          provide: MessagesGateway,
          useValue: mockGateway,
        },
      ],
    }).compile();

    service = module.get<MessagesService>(MessagesService);
    repository = module.get(getRepositoryToken(Message));
    gateway = module.get(MessagesGateway);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createMessage', () => {
    it('should create a new message', async () => {
      const text = 'Hello world';
      const sender = mockUser;
      const conversation = mockConversation;

      const createdMessage = { ...mockMessage, text };
      const savedMessage = { ...createdMessage, id: 'saved-id' };
      const resultMessage = { ...savedMessage };

      repository.create.mockReturnValue(createdMessage);
      repository.save.mockResolvedValue(savedMessage);
      repository.findOne.mockResolvedValue(resultMessage);

      const result = await service.createMessage(text, sender, conversation);

      expect(repository.create).toHaveBeenCalledWith({
        text,
        sender,
        conversation,
      });
      expect(repository.save).toHaveBeenCalledWith(createdMessage);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: savedMessage.id },
        relations: ['sender', 'conversation'],
      });
      expect(gateway.emitNewMessage).toHaveBeenCalledWith(resultMessage);
      expect(result).toEqual(resultMessage);
    });

    it('should handle creation errors', async () => {
      const text = 'Hello world';
      const sender = mockUser;
      const conversation = mockConversation;

      repository.create.mockReturnValue(mockMessage);
      repository.save.mockRejectedValue(new Error('Database error'));

      await expect(service.createMessage(text, sender, conversation)).rejects.toThrow('Database error');
    });
  });

  describe('getMessagesByConversation', () => {
    it('should find messages by conversation id', async () => {
      const conversationId = '1';
      const messages = [mockMessage];
      
      repository.find.mockResolvedValue(messages);

      const result = await service.getMessagesByConversation(conversationId);

      expect(repository.find).toHaveBeenCalledWith({
        where: { conversation: { id: conversationId } },
        relations: ['sender'],
        order: { createdAt: 'ASC' },
      });
      expect(result).toEqual(messages);
    });

    it('should return empty array when no messages found', async () => {
      const conversationId = '999';
      repository.find.mockResolvedValue([]);

      const result = await service.getMessagesByConversation(conversationId);

      expect(repository.find).toHaveBeenCalledWith({
        where: { conversation: { id: conversationId } },
        relations: ['sender'],
        order: { createdAt: 'ASC' },
      });
      expect(result).toEqual([]);
    });

    it('should handle find errors', async () => {
      const conversationId = '1';
      repository.find.mockRejectedValue(new Error('Database error'));

      await expect(service.getMessagesByConversation(conversationId)).rejects.toThrow('Database error');
    });
  });
});
