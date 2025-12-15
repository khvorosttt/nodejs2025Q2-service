import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { tokenConfig } from '../token/token.config';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    if (type != 'Bearer' || !token) {
      throw new UnauthorizedException('Invalid token or token type');
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: tokenConfig.access.secret,
      });
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException('Ops... Something wrong');
    }
    return true;
  }
}
