import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { BaseJwtPayload } from 'incident-management-commons';

@Injectable()
export class JwtTokenService {
  constructor(
    private readonly _jwtService: JwtService,
    private readonly _configService: ConfigService,
  ) {}

  getJwtToken(payload: BaseJwtPayload): string {
    return this._jwtService.sign({
      ...payload,
      iss: 'auth-service',
      aud: this._configService.get<string>('JWT_AUDIENCE'),
    });
  }

  getRefreshToken(email: string): string {
    return this._jwtService.sign(
      {
        email,
        iss: 'auth-service',
        aud: this._configService.get<string>('JWT_AUDIENCE'),
      },
      {
        secret: this._configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this._configService.get<string>('JWT_REFRESH_EXPIRES_IN'),
      },
    );
  }

  decodeJwtToken(token: string): any {
    return this._jwtService.decode(token);
  }
}
