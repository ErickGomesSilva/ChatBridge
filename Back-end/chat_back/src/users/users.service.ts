import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepo: Repository<User>,
    ) {}
    async createUser(data: Partial<User>): Promise<User> {
        const user = this.usersRepo.create(data);
        return this.usersRepo.save(user);
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.usersRepo.findOne({ where: { email } });
    }

    findAll(): Promise<User[]> {
        return this.usersRepo.find()
      }
}



