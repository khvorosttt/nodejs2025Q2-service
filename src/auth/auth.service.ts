import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import * as bcrypt from 'bcrypt';
import { tokenConfig } from './token/token.config';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = await this.usersService.findUserByLogin(createUserDto.login);
    if (user) {
      throw new BadRequestException('User with this login is exosts');
    }
    return this.usersService.create(createUserDto);
  }

  async login(loginAuthDto: LoginAuthDto) {
    const user = await this.usersService.findUserByLogin(loginAuthDto.login);
    if (!user) {
      throw new NotFoundException('User with this login not found.');
    }
    const isCorrectPassword = await bcrypt.compare(
      loginAuthDto.password,
      user.password,
    );
    if (!isCorrectPassword) {
      throw new ForbiddenException("Passwords doesn't match.");
    }
    const tokenPayload = {
      id: user.id,
      login: user.login,
    };
    const token = await this.jwtService.signAsync(
      tokenPayload,
      tokenConfig.access,
    );
    return { accessToken: token };
  }
}
