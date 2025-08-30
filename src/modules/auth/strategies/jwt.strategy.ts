import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserAppEntity } from '@entities';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { BaseJwtPayload } from 'incident-management-commons';
import { BusinessErrors } from '../errors/business-error';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @InjectRepository(UserAppEntity)
    private readonly _userAppRepository: Repository<UserAppEntity>,
    private readonly _configService: ConfigService,
  ) {
    super({
      secretOrKey: _configService.getOrThrow<string>('JWT_SECRET'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: BaseJwtPayload): Promise<UserAppEntity> {
    const { email } = payload;

    const user = await this._userAppRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException(BusinessErrors.InvalidToken.message);
    }

    if (!user.isActive) {
      throw new UnauthorizedException(BusinessErrors.UserIsInactive.message);
    }

    return user;
  }
}