import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid', {name: 'Id'})
  id: string;

  @Column({ unique: true , name: 'Email'})
  email: string;

  @Column({name: 'Senha'})
  password: string;

  @CreateDateColumn({name: 'DataCriacao'})
  createdAt: Date;
}