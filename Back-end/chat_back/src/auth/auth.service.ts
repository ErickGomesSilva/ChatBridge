import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterUserDto } from '../dto/register-user.dto';
import { LoginDto } from '../dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';


@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) {}
    
    async register(registerDto: RegisterUserDto) {
        const hashedPassword = await bcrypt.hash(registerDto.password, 10);
        const user = await this.usersService.createUser({...registerDto, password: hashedPassword,});
        return user;
      }

      async login(loginDto: LoginDto) {
        const user = await this.usersService.findByEmail(loginDto.email);
        if (!user) throw new UnauthorizedException('Credenciais inválidas');    
        const isPasswordValid = await bcrypt.compare(loginDto.password, user.password, );

        if (!isPasswordValid) throw new UnauthorizedException('Credenciais inválidas');

        const payload = { sub: user.id, email: user.email };
        const token = await this.jwtService.signAsync(payload);
    
        return { access_token: token };
      }
}
