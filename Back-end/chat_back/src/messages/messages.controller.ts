import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { Conversation } from '../conversations/conversation.entity';
import { User } from '../users/user.entity';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}


  @Post(':conversationId')
  async sendMessage(
    @Param('conversationId') conversationId: string,
    @Body('senderId') senderId: string,
    @Body('text') text: string,
  ) {
    const conversation = new Conversation();
    conversation.id = conversationId;

    const sender = new User();
    sender.id = senderId;

    return this.messagesService.createMessage(text, sender, conversation);
  }

  @Get(':conversationId')
  async getMessages(@Param('conversationId') conversationId: string) {
    return this.messagesService.getMessagesByConversation(conversationId);
  }
}
