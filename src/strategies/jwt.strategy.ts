import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtAuthConfig } from 'src/config/types/jwt-auth.config';
import { IAuthContext } from 'src/types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(protected readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<JwtAuthConfig>('jwtAuthConfig').secretKey,
    });
  }

  async validate(payload: any): Promise<IAuthContext> {
    return {
      username: payload.username,
      name: payload.name,
      userId: payload.id,
    };
  }
}
