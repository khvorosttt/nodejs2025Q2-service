import { JwtSignOptions } from '@nestjs/jwt';
import ms from 'ms';

export const tokenConfig: { access: JwtSignOptions; refresh: JwtSignOptions } =
  {
    access: {
      secret: process.env.JWT_SECRET_KEY || 'secret123',
      expiresIn: (process.env.TOKEN_EXPIRE_TIME || '1h') as ms.StringValue,
    },
    refresh: {
      secret: process.env.JWT_SECRET_REFRESH_KEY || 'refresh-secret123',
      expiresIn: (process.env.TOKEN_REFRESH_EXPIRE_TIME ||
        '24h') as ms.StringValue,
    },
  };
