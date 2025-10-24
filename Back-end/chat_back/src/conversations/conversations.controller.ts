import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { CreateConversationDto } from '../dto/create-conversation.dto';
import { User } from '../users/user.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('conversations')
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  @Post()
  async create(@Body() dto: CreateConversationDto) {
    const user1 = new User();
    user1.id = dto.user1Id;

    const user2 = new User();
    user2.id = dto.user2Id;

    return this.conversationsService.createConversation(user1, user2);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':userId')
  async findAllByUser(@Param('userId') userId: string) {
    return this.conversationsService.findAllByUser(userId);
  }
}
