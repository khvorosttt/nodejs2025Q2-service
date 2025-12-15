import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import * as bcrypt from 'bcrypt';
import { tokenConfig } from './token/token.config';
import { IUser } from 'src/user/interfaces/user.interface';

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
    return this.generateTokens({ id: user.id, login: user.login });
  }

  async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is required');
    }
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: tokenConfig.refresh.secret,
      });
      const { userId, login } = payload;
      const user = await this.usersService.findOne(userId);
      if (!user || user.login !== login) {
        throw new ForbiddenException('User not found or login mismatch');
      }
      return this.generateTokens({ id: userId, login });
    } catch (_) {
      throw new ForbiddenException('Invalid or expired refresh token');
    }
  }

  async generateTokens(user: Pick<IUser, 'id' | 'login'>) {
    const tokenPayload = {
      userId: user.id,
      login: user.login,
    };
    const accessToken = await this.jwtService.signAsync(
      tokenPayload,
      tokenConfig.access,
    );
    const refreshToken = await this.jwtService.signAsync(
      tokenPayload,
      tokenConfig.refresh,
    );
    return { accessToken, refreshToken };
  }
}
