export const tokenConfig = {
  access: {
    secret: process.env.JWT_SECRET_KEY || 'secret123',
    expiresIn: process.env.TOKEN_EXPIRE_TIME || '1h',
  },
  refresh: {
    secret: process.env.JWT_SECRET_REFRESH_KEY || 'refresh-secret123',
    expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME || '24h',
  },
};
