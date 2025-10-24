import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';

// Mock entities
export const mockUser = {
  id: '1',
  email: 'test@example.com',
  password: 'hashedPassword',
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const mockConversation = {
  id: '1',
  user1: mockUser,
  user2: mockUser,
  messages: [],
  createdAt: new Date(),
  updatedAt: new Date(),
  lastMessageText: 'Test message',
};

export const mockMessage = {
  id: '1',
  text: 'Test message',
  createdAt: new Date(),
  sender: mockUser,
  conversation: mockConversation,
};

// Mock repository
export const createMockRepository = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  findOneBy: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  remove: jest.fn(),
});

// Mock JWT Service
export const createMockJwtService = () => ({
  signAsync: jest.fn(),
  verifyAsync: jest.fn(),
});

// Mock bcrypt
export const mockBcrypt = {
  hash: jest.fn(),
  compare: jest.fn(),
};

// Setup test module helper
export const createTestModule = async (providers: any[], controllers: any[] = []) => {
  return await Test.createTestingModule({
    providers,
    controllers,
  }).compile();
};
