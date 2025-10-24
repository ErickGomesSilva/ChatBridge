import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    MessageBody,
    ConnectedSocket,
  } from '@nestjs/websockets'
  import { Server, Socket } from 'socket.io'
  import { Injectable } from '@nestjs/common'
  
  @WebSocketGateway({
    cors: {
      origin: '*',
    },
  })
  @Injectable()
  export class MessagesGateway {
    @WebSocketServer()
    server: Server
  
    @SubscribeMessage('joinConversation')
    handleJoinConversation(
      @MessageBody() conversationId: string,
      @ConnectedSocket() client: Socket,
    ) {
      client.join(`conversation-${conversationId}`)
      console.log(`Cliente ${client.id} entrou na sala conversation-${conversationId}`)
    }  
  
    emitNewMessage(message: any) {
      this.server.to(`conversation-${message.conversation.id}`).emit('newMessage', message)
    }
  }
  