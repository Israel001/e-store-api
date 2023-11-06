import { registerAs } from '@nestjs/config';
import { JwtAuthConfig } from './types/jwt-auth.config';

export const JwtAuthConfiguration = registerAs(
  'jwtAuthConfig',
  (): JwtAuthConfig => ({
    secretKey: process.env.JWT_SECRET_KEY || 'secret',
  }),
);
