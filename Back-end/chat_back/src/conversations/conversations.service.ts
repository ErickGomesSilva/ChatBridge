import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Conversation } from './conversation.entity';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { Message } from '../messages/message.entity';

@Injectable()
export class ConversationsService {
  constructor(
    @InjectRepository(Conversation)
    private conversationsRepo: Repository<Conversation>,
  ) {}

  async createConversation(user1: User, user2: User): Promise<Conversation> {
    const conversation = this.conversationsRepo.create({ user1, user2 });
    return this.conversationsRepo.save(conversation);
  }

  async findAllByUser(userId: string): Promise<Conversation[]> {
    return this.conversationsRepo.find({
      where: [
        { user1: { id: userId } },
        { user2: { id: userId } },
      ],
      relations: ['user1', 'user2', 'messages'],
      order: { updatedAt: 'DESC' },
    });
  }
}
