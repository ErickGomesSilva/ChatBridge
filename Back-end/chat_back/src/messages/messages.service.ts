import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './message.entity';
import { Repository } from 'typeorm';
import { Conversation } from '../conversations/conversation.entity';
import { User } from '../users/user.entity';
import { MessagesGateway } from './message.gateway';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private messagesRepo: Repository<Message>,
    private readonly gateway: MessagesGateway,
  ) {}

  async createMessage(
    text: string,
    sender: User,
    conversation: Conversation,
  ): Promise<Message> {
    const message = this.messagesRepo.create({
      text,
      sender,
      conversation,
    })
    const saved = await this.messagesRepo.save(message)
    const result = await this.messagesRepo.findOne({
      where: { id: saved.id },
      relations: ['sender', 'conversation'],
    })
    
    this.gateway.emitNewMessage(result!)
    return result!
  }


  async getMessagesByConversation(conversationId: string): Promise<Message[]> {
    return this.messagesRepo.find({
      where: {
        conversation: { id: conversationId },
      },
      relations: ['sender'],
      order: { createdAt: 'ASC' },
    })
  }
  
}
