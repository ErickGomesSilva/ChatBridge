import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
  } from 'typeorm';
  import { User } from '../users/user.entity';
  import { Conversation } from '../conversations/conversation.entity';
  
  @Entity()
  export class Message {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @ManyToOne(() => Conversation, (conversation) => conversation.messages, { onDelete: 'CASCADE' })
    conversation: Conversation;
  
    @ManyToOne(() => User, { eager: true })
    sender: User;
  
    @Column()
    text: string;
  
    @CreateDateColumn()
    createdAt: Date;
  }
  